import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Project } from './entities/project.entity';
import { ProjectUser } from 'src/project_users/entities/project_user.entity';
import { BookingReference } from 'src/booking_references/entities/booking_reference.entity';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ProjectUser, Project, BookingReference]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, UsersService, AuthService, JwtService],
  exports: [ProjectsService, TypeOrmModule],
})
export class ProjectsModule {}
