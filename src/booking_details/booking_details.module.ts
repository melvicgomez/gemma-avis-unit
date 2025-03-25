import { Module } from '@nestjs/common';
import { BookingDetailsService } from './booking_details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingDetail } from './entities/booking_detail.entity';
import { BookingReference } from 'src/booking_references/entities/booking_reference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingDetail, BookingReference])],
  controllers: [],
  providers: [BookingDetailsService],
  exports: [BookingDetailsService, TypeOrmModule],
})
export class BookingDetailsModule {}
