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

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    ProjectsModule,
    UsersModule,
    BookingReferencesModule,
    BookingDetailsModule,
    ProjectUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
