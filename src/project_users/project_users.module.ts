import { Module } from '@nestjs/common';
import { ProjectUsersService } from './project_users.service';
import { ProjectUsersController } from './project_users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import { ProjectUser } from './entities/project_user.entity';
import { BookingReference } from 'src/booking_references/entities/booking_reference.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ProjectUser, Project, BookingReference]),
  ],
  controllers: [ProjectUsersController],
  providers: [ProjectUsersService],
  exports: [ProjectUsersService, TypeOrmModule],
})
export class ProjectUsersModule {}
