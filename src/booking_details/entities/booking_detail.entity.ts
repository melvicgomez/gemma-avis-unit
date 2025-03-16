import { BookingReference } from 'src/booking_references/entities/booking_reference.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 't_booking_ref_details' })
export class BookingDetail {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'date' })
  sales_date: Date;

  @Column({ type: 'decimal' })
  sales_price: number;

  @ManyToOne(
    () => BookingReference,
    (bookingReference) => bookingReference.booking_reference_id,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'booking_reference_id' })
  booking_reference: BookingReference;
}
