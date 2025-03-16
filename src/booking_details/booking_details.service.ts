import { Injectable } from '@nestjs/common';
import { CreateBookingDetailDto } from './dto/create-booking_detail.dto';
import { UpdateBookingDetailDto } from './dto/update-booking_detail.dto';

@Injectable()
export class BookingDetailsService {
  create(createBookingDetailDto: CreateBookingDetailDto) {
    console.log(createBookingDetailDto);
    return 'This action adds a new bookingDetail';
  }

  findAll() {
    return `This action returns all bookingDetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookingDetail`;
  }

  update(id: number, updateBookingDetailDto: UpdateBookingDetailDto) {
    console.log(updateBookingDetailDto);
    return `This action updates a #${id} bookingDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookingDetail`;
  }
}
