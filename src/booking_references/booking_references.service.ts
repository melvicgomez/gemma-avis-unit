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

  async getAllBookingReferences(
    projectId: string,
    monthNumber: number,
    yearNumber: number,
    isMinified: boolean = true,
  ) {
    const startDate = new Date(yearNumber, monthNumber - 1, 1);
    const endDate = new Date(yearNumber, monthNumber, 0, 23, 59, 59, 999);

    const bookingRefs = this.bookingReferenceRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.booking_details', 'details')
      .where('booking.project_id = :projectId', { projectId })
      .andWhere('booking.check_in_date <= :endDate', { endDate })
      .andWhere('booking.check_out_date >= :startDate', { startDate })
      .andWhere('details.sales_date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });

    if (isMinified) {
      bookingRefs.select([
        'booking.booking_reference_id',
        'booking.check_in_date',
        'booking.check_out_date',
        'details.sales_date',
      ]);
    }

    return await bookingRefs.getMany();
  }

  async createBookingRef(
    userId: string,
    projectId: string,
    bookingDetailDto: CreateBookingReferenceDto,
  ) {
    try {
      const newBookingRef = this.bookingReferenceRepository.create({
        user_id: userId,
        project_id: projectId,
        check_in_date: bookingDetailDto.check_in_date,
        check_out_date: bookingDetailDto.check_out_date,
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
