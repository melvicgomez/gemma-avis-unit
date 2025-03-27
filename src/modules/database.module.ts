import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { User } from 'src/user/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: TypeOrmModuleOptions = {
  type: (process.env.DATABASE_TYPE ||
    'postgres') as PostgresConnectionOptions['type'],
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '') || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'db_name',
  // entities: [User],
  autoLoadEntities: true,
  ssl: process.env.NODE_ENV === 'production',
  logging: process.env.NODE_ENV === 'dev',
  // synchronize: true,
  // migrationsRun: false,
  // migrations: [],
  // dropSchema: true,
  // dropSchema: Boolean(parseInt(process.env.DB_DROP_SCHEMA)),
};

@Module({
  imports: [TypeOrmModule.forRoot(config)],
})
export class DatabaseModule {}
