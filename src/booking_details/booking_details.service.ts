import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingDetail } from './entities/booking_detail.entity';
import { Repository } from 'typeorm';
import { CreateBookingDetailDto } from './dto/create-booking_detail.dto';

@Injectable()
export class BookingDetailsService {
  constructor(
    @InjectRepository(BookingDetail)
    private bookingDetailRepository: Repository<BookingDetail>,
  ) {}

  async createBookingDetailByBookingRef(
    bookingDetailsDto: CreateBookingDetailDto[],
  ) {
    try {
      const newBookingDetails = bookingDetailsDto.map((dto) =>
        this.bookingDetailRepository.create(dto),
      );

      return await this.bookingDetailRepository.save(newBookingDetails);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create booking detail (${error})`,
      );
    }
  }

  async deleteBookingDetailsByBookRefId(bookingReferenceId: string) {
    const deletedRecord = await this.bookingDetailRepository.delete({
      booking_reference_id: bookingReferenceId,
    });

    return deletedRecord;
  }
}
