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

@Controller('booking-references')
export class BookingReferencesController {
  constructor(
    private readonly bookingReferencesService: BookingReferencesService,
    private readonly bookingDetailService: BookingDetailsService,
    private readonly projectUsersService: ProjectUsersService,
    private readonly authService: AuthService,
  ) {
    // TODO: endpoint to get the booking ref
    // TODO: create booking ref
  }

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

    // TODO: Query the database to return the project booking references
    return Promise.resolve({ projectId, month: monthNumber, year: yearNumber });
  }

  @IsScopeAllowed([UserScope.TENANT])
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
      // TODO: Fetch and return filtered booking references by projectId, month, and year
      return { projectId, month: monthNumber, year: yearNumber };
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
}
