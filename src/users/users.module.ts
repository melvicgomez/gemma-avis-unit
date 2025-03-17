import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ProjectUser } from 'src/project_users/entities/project_user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { BookingReference } from 'src/booking_references/entities/booking_reference.entity';
import { ProjectsService } from 'src/projects/projects.service';
import { ProjectUsersService } from 'src/project_users/project_users.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ProjectUser, Project, BookingReference]),
  ],
  controllers: [UsersController],
  providers: [UsersService, ProjectsService, ProjectUsersService, AuthService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
