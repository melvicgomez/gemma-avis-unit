import { BookingDetail } from 'src/booking_details/entities/booking_detail.entity';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 't_booking_references' })
export class BookingReference {
  @PrimaryGeneratedColumn('uuid')
  booking_reference_id: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @Column({ type: 'uuid', nullable: false })
  project_id: string;

  @Column({ type: 'date', nullable: false })
  check_in_date: Date;

  @Column({ type: 'date', nullable: false })
  check_out_date: Date;

  @Column({ type: 'decimal' })
  gross_sale: number;

  @Column({ type: 'decimal' })
  initial_deposit_price: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  initial_deposit_reference_number: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  initial_deposit_bank_name: string;

  @Column({ type: 'decimal' })
  full_payment_price: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  full_payment_reference_number: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  full_payment_bank_name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.user_booking_references, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Project, (project) => project.booking_references, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(
    () => BookingDetail,
    (bookingDetail) => bookingDetail.booking_reference,
    {
      cascade: true,
    },
  )
  booking_details: BookingDetail[];
}
