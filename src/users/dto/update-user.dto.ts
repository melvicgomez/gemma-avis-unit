import { IsEmail, IsOptional, IsString, IsArray } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { UserScopes } from 'src/models/app';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsArray()
  scopes?: UserScopes[];

  @IsOptional()
  @IsString()
  password?: string;
}
