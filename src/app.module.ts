import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from './modules/environment.module';
import { DatabaseModule } from './modules/database.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { BookingReferencesModule } from './booking_references/booking_references.module';
import { BookingDetailsModule } from './booking_details/booking_details.module';
import { ProjectUsersModule } from './project_users/project_users.module';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';
import { ProjectsController } from './projects/projects.controller';
import { BookingReferencesController } from './booking_references/booking_references.controller';
import { BookingDetailsController } from './booking_details/booking_details.controller';
import { ProjectUsersController } from './project_users/project_users.controller';
import { BookingDetailsService } from './booking_details/booking_details.service';
import { BookingReferencesService } from './booking_references/booking_references.service';
import { ProjectUsersService } from './project_users/project_users.service';
import { ProjectsService } from './projects/projects.service';
import { UsersService } from './users/users.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    AuthModule,
    ProjectsModule,
    UsersModule,
    BookingReferencesModule,
    BookingDetailsModule,
    ProjectUsersModule,
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    ProjectsController,
    BookingReferencesController,
    BookingDetailsController,
    ProjectUsersController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppService,
    UsersService,
    ProjectsService,
    BookingReferencesService,
    BookingDetailsService,
    ProjectUsersService,
  ],
})
export class AppModule {}
