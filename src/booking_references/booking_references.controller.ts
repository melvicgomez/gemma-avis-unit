import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  MethodNotAllowedException,
  Param,
  ParseUUIDPipe,
  Post,
  Patch,
  Query,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BookingReferencesService } from './booking_references.service';
import { CreateBookingReferenceDto } from './dto/create-booking_reference.dto';
import { IsScopeAllowed, IsPublic } from 'src/auth/auth.guard';
import { UserScope } from 'src/models/app';
import { ProjectUsersService } from 'src/project_users/project_users.service';
import { AuthService } from 'src/auth/auth.service';
import { BookingDetailsService } from 'src/booking_details/booking_details.service';
import { CreateBookingDetailDto } from 'src/booking_details/dto/create-booking_detail.dto';
import { UpdateBookingReferenceDto } from './dto/update-booking_reference.dto';

@Controller('booking-references')
export class BookingReferencesController {
  constructor(
    private readonly bookingReferencesService: BookingReferencesService,
    private readonly bookingDetailService: BookingDetailsService,
    private readonly projectUsersService: ProjectUsersService,
    private readonly authService: AuthService,
  ) {}

  @IsPublic()
  @Get(':project_id')
  async getProjectBookingRef(
    @Param('project_id', new ParseUUIDPipe()) projectId: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    if (!projectId) {
      throw new BadRequestException('Project ID is required');
    }

    if (!month || !year) {
      throw new BadRequestException('Month and year are required');
    }

    // Convert month and year to numbers
    const monthNumber = parseInt(month, 10);
    const yearNumber = parseInt(year, 10);

    if (
      isNaN(monthNumber) ||
      isNaN(yearNumber) ||
      monthNumber < 1 ||
      monthNumber > 12 ||
      yearNumber < 1900
    ) {
      throw new BadRequestException(
        'Month must be between 1-12 and year must be valid',
      );
    }

    const bookingReferences =
      await this.bookingReferencesService.getAllBookingReferences(
        projectId,
        monthNumber,
        yearNumber,
      );

    return bookingReferences;
  }

  @IsScopeAllowed([UserScope.TENANT, UserScope.ADMIN])
  @Get(':project_id/tenant')
  async getTenantProjectBookingRef(
    @Param('project_id', new ParseUUIDPipe()) projectId: string,
    @Query('month') month: string,
    @Query('year') year: string,
    @Headers('authorization') authHeader?: string,
  ) {
    if (!projectId) {
      throw new BadRequestException('Project ID is required');
    }

    if (!month || !year) {
      throw new BadRequestException('Month and year are required');
    }

    // Convert month and year to numbers
    const monthNumber = parseInt(month, 10);
    const yearNumber = parseInt(year, 10);

    if (
      isNaN(monthNumber) ||
      isNaN(yearNumber) ||
      monthNumber < 1 ||
      monthNumber > 12 ||
      yearNumber < 1900
    ) {
      throw new BadRequestException(
        'Month must be between 1-12 and year must be valid',
      );
    }

    const token = authHeader?.split(' ')[1];
    const decodedToken = this.authService.parseToken(token || '');

    const isAllowed =
      await this.projectUsersService.checkIfUserAllowedInProject(
        decodedToken.user_id,
        projectId,
      );

    if (isAllowed) {
      const bookingReferences =
        await this.bookingReferencesService.getAllBookingReferences(
          projectId,
          monthNumber,
          yearNumber,
          false,
        );
      return bookingReferences;
    }

    throw new MethodNotAllowedException(
      'User is not allowed to modify this project',
    );
  }

  @Post(':project_id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.CREATED)
  async createProjectBookingRef(
    @Param('project_id', new ParseUUIDPipe()) projectId: string,
    @Body() createBookingReferenceDto: CreateBookingReferenceDto,
    @Headers('authorization') authHeader?: string,
  ) {
    const token = authHeader?.split(' ')[1];
    const decodedToken = this.authService.parseToken(token || '');

    if (!decodedToken?.user_id) {
      throw new UnauthorizedException('Invalid or missing user ID in token');
    }

    const isAllowed =
      await this.projectUsersService.checkIfUserAllowedInProject(
        decodedToken.user_id,
        projectId,
      );

    if (!isAllowed) {
      throw new MethodNotAllowedException(
        'User is not allowed to modify this project',
      );
    }

    if (
      createBookingReferenceDto.check_in_date >=
      createBookingReferenceDto.check_out_date
    ) {
      throw new BadRequestException(
        'Invalid date range: check_in_date must be before check_out_date',
      );
    }
    try {
      const bookRef = await this.bookingReferencesService.createBookingRef(
        decodedToken.user_id,
        projectId,
        createBookingReferenceDto,
      );

      if (bookRef.booking_reference_id) {
        const bookingDetailsDto: CreateBookingDetailDto[] =
          createBookingReferenceDto.booking_details.map((bookingDetail) => ({
            ...bookingDetail,
            booking_reference_id: bookRef.booking_reference_id,
          }));

        await this.bookingDetailService.createBookingDetailByBookingRef(
          bookingDetailsDto,
        );
      }
      return null;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create booking reference (${error})`,
      );
    }
  }

  @Patch(':booking_ref_id/project/:project_id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async updateProjectBookingRefById(
    @Param('booking_ref_id', new ParseUUIDPipe()) bookingRefId: string,
    @Param('project_id', new ParseUUIDPipe()) projectId: string,
    @Body() updateBookingReferenceDto: UpdateBookingReferenceDto,
    @Headers('authorization') authHeader?: string,
  ) {
    const token = authHeader?.split(' ')[1];
    const decodedToken = this.authService.parseToken(token || '');

    if (!decodedToken?.user_id) {
      throw new UnauthorizedException('Invalid or missing user ID in token');
    }

    const isAllowed =
      await this.projectUsersService.checkIfUserAllowedInProject(
        decodedToken.user_id,
        projectId,
      );

    if (!isAllowed) {
      throw new MethodNotAllowedException(
        'User is not allowed to modify this project',
      );
    }

    const bookingRef =
      await this.bookingReferencesService.getBookingReferenceById(bookingRefId);

    if (!bookingRef) {
      throw new BadRequestException('Booking reference ID not found');
    }

    // Update only the fields that exist in updateBookingReferenceDto
    Object.assign(bookingRef, {
      description:
        updateBookingReferenceDto.description ?? bookingRef.description,
      check_in_date:
        updateBookingReferenceDto.check_in_date ?? bookingRef.check_in_date,
      check_out_date:
        updateBookingReferenceDto.check_out_date ?? bookingRef.check_out_date,
      full_payment_reference_number:
        updateBookingReferenceDto.full_payment_reference_number ??
        bookingRef.full_payment_reference_number,
      full_payment_price:
        updateBookingReferenceDto.full_payment_price ??
        bookingRef.full_payment_price,
      full_payment_bank_name:
        updateBookingReferenceDto.full_payment_bank_name ??
        bookingRef.full_payment_bank_name,
      initial_deposit_reference_number:
        updateBookingReferenceDto.initial_deposit_reference_number ??
        bookingRef.initial_deposit_reference_number,
      initial_deposit_price:
        updateBookingReferenceDto.initial_deposit_price ??
        bookingRef.initial_deposit_price,
      initial_deposit_bank_name:
        updateBookingReferenceDto.initial_deposit_bank_name ??
        bookingRef.initial_deposit_bank_name,
      gross_sale: updateBookingReferenceDto.gross_sale ?? bookingRef.gross_sale,
    });

    // Validate check-in and check-out dates
    if (bookingRef.check_in_date >= bookingRef.check_out_date) {
      throw new BadRequestException(
        'Invalid date range: check_in_date must be before check_out_date',
      );
    }

    await this.bookingReferencesService.updateBookingReferenceById(bookingRef);

    // Handle booking details update
    if (updateBookingReferenceDto.booking_details) {
      await this.bookingDetailService.deleteBookingDetailsByBookRefId(
        bookingRef.booking_reference_id,
      );

      const bookingDetailsDto: CreateBookingDetailDto[] =
        updateBookingReferenceDto.booking_details.map((bookingDetail) => ({
          ...bookingDetail,
          booking_reference_id: bookingRef.booking_reference_id,
        }));

      await this.bookingDetailService.createBookingDetailByBookingRef(
        bookingDetailsDto,
      );
    }
  }
}
