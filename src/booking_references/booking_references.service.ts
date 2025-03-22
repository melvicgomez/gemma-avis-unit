import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BookingReference } from './entities/booking_reference.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookingReferenceDto } from './dto/create-booking_reference.dto';

@Injectable()
export class BookingReferencesService {
  constructor(
    @InjectRepository(BookingReference)
    private bookingReferenceRepository: Repository<BookingReference>,
  ) {}

  async createBookingRef(
    userId: string,
    projectId: string,
    bookingDetailDto: CreateBookingReferenceDto,
  ) {
    try {
      const newBookingRef = this.bookingReferenceRepository.create({
        user_id: userId,
        project_id: projectId,
        check_in: bookingDetailDto.check_in,
        check_out: bookingDetailDto.check_out,
        gross_sale: bookingDetailDto.gross_sale,
        full_payment_bank_name: bookingDetailDto.full_payment_bank_name,
        full_payment_price: bookingDetailDto.full_payment_price,
        full_payment_reference_number:
          bookingDetailDto.full_payment_reference_number,
        initial_deposit_bank_name: bookingDetailDto.initial_deposit_bank_name, // Ensure names match
        initial_deposit_price: bookingDetailDto.initial_deposit_price,
        initial_deposit_reference_number:
          bookingDetailDto.initial_deposit_reference_number,
      });
      return await this.bookingReferenceRepository.save(newBookingRef);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create booking reference (${error})`,
      );
    }
  }
}
