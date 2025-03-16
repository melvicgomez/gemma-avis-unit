import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookingReferencesService } from './booking_references.service';
import { CreateBookingReferenceDto } from './dto/create-booking_reference.dto';
import { UpdateBookingReferenceDto } from './dto/update-booking_reference.dto';

@Controller('booking-references')
export class BookingReferencesController {
  constructor(
    private readonly bookingReferencesService: BookingReferencesService,
  ) {}

  @Post()
  create(@Body() createBookingReferenceDto: CreateBookingReferenceDto) {
    return this.bookingReferencesService.create(createBookingReferenceDto);
  }

  @Get()
  findAll() {
    return this.bookingReferencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingReferencesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingReferenceDto: UpdateBookingReferenceDto,
  ) {
    return this.bookingReferencesService.update(+id, updateBookingReferenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingReferencesService.remove(+id);
  }
}
