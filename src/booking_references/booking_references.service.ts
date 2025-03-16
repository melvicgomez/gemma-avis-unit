import { Injectable } from '@nestjs/common';
import { CreateBookingReferenceDto } from './dto/create-booking_reference.dto';
import { UpdateBookingReferenceDto } from './dto/update-booking_reference.dto';

@Injectable()
export class BookingReferencesService {
  create(createBookingReferenceDto: CreateBookingReferenceDto) {
    console.log(createBookingReferenceDto);
    return 'This action adds a new bookingReference';
  }

  findAll() {
    return `This action returns all bookingReferences`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookingReference`;
  }

  update(id: number, updateBookingReferenceDto: UpdateBookingReferenceDto) {
    console.log(updateBookingReferenceDto);
    return `This action updates a #${id} bookingReference`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookingReference`;
  }
}
