import { BookingReference } from 'src/booking_references/entities/booking_reference.entity';
import { PricingDay, SocialLinkType } from 'src/models/app';
import { ProjectUser } from 'src/project_users/entities/project_user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
} from 'typeorm';

@Entity({ name: 't_projects' })
export class Project {
  @PrimaryGeneratedColumn('uuid')
  project_id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'integer', default: 1 })
  max_active_users: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  mobile_num: string;

  @Column({ type: 'jsonb', nullable: true })
  social_links: Partial<Record<SocialLinkType, string>>;

  @Column({ type: 'jsonb', nullable: false, default: '{}' })
  pricing: Partial<Record<PricingDay, number>>;

  @Column({ type: 'timestamptz' })
  expiration_date: Date;

  @OneToMany(() => ProjectUser, (projectUser) => projectUser.projects)
  project_users: ProjectUser[];

  @OneToMany(
    () => BookingReference,
    (bookingReference) => bookingReference.booking_reference_id,
  )
  project_booking_references: BookingReference[];
}
