import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  async getBookingReferenceById(bookingReferenceId: string) {
    return this.bookingReferenceRepository.findOne({
      where: {
        booking_reference_id: bookingReferenceId,
      },
      relations: ['booking_details'],
    });
  }

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
    bookingRefDto: CreateBookingReferenceDto,
  ) {
    try {
      const newBookingRef = this.bookingReferenceRepository.create({
        user_id: userId,
        description: bookingRefDto.description,
        project_id: projectId,
        check_in_date: bookingRefDto.check_in_date,
        check_out_date: bookingRefDto.check_out_date,
        gross_sale: bookingRefDto.gross_sale,
        full_payment_bank_name: bookingRefDto.full_payment_bank_name,
        full_payment_price: bookingRefDto.full_payment_price,
        full_payment_reference_number:
          bookingRefDto.full_payment_reference_number,
        initial_deposit_bank_name: bookingRefDto.initial_deposit_bank_name, // Ensure names match
        initial_deposit_price: bookingRefDto.initial_deposit_price,
        initial_deposit_reference_number:
          bookingRefDto.initial_deposit_reference_number,
      });
      return await this.bookingReferenceRepository.save(newBookingRef);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create booking reference (${error})`,
      );
    }
  }

  async updateBookingReferenceById(bookingRef: BookingReference) {
    try {
      const bookingReference =
        await this.bookingReferenceRepository.preload(bookingRef);

      if (!bookingReference) {
        throw new NotFoundException(
          `Booking reference with ID ${bookingRef.booking_reference_id} not found`,
        );
      }

      return await this.bookingReferenceRepository.save(bookingReference);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update booking reference: ${error.message}`,
      );
    }
  }
}
