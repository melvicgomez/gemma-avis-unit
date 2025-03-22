import { Module } from '@nestjs/common';
import { BookingReferencesService } from './booking_references.service';
import { BookingReferencesController } from './booking_references.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingReference } from './entities/booking_reference.entity';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { ProjectUser } from 'src/project_users/entities/project_user.entity';
import { ProjectsService } from 'src/projects/projects.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { BookingDetail } from 'src/booking_details/entities/booking_detail.entity';
import { ProjectUsersService } from 'src/project_users/project_users.service';
import { BookingDetailsService } from 'src/booking_details/booking_details.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookingReference,
      User,
      Project,
      ProjectUser,
      BookingDetail,
    ]),
  ],
  controllers: [BookingReferencesController],
  providers: [
    BookingReferencesService,
    ProjectsService,
    AuthService,
    ProjectUsersService,
    UsersService,
    JwtService,
    BookingDetailsService,
  ],
  exports: [BookingReferencesService, TypeOrmModule],
})
export class BookingReferencesModule {}
