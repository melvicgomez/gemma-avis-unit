import { Module } from '@nestjs/common';
import { BookingReferencesService } from './booking_references.service';
import { BookingReferencesController } from './booking_references.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingReference } from './entities/booking_reference.entity';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { ProjectUser } from 'src/project_users/entities/project_user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingReference, User, Project, ProjectUser]),
  ],
  controllers: [BookingReferencesController],
  providers: [BookingReferencesService],
  exports: [BookingReferencesService, TypeOrmModule],
})
export class BookingReferencesModule {}
