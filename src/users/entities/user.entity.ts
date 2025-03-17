import { BookingReference } from 'src/booking_references/entities/booking_reference.entity';
import { UserScope } from 'src/models/app';
import { ProjectUser } from 'src/project_users/entities/project_user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 't_users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', default: UserScope.TENANT })
  scope: UserScope;

  @Column({ type: 'text' })
  password: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => ProjectUser, (projectUser) => projectUser.users)
  project_users?: ProjectUser[];

  @OneToMany(
    () => BookingReference,
    (bookingReference) => bookingReference.booking_reference_id,
  )
  user_booking_references?: BookingReference[];
}
