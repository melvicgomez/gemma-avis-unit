import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { UserScopes } from 'src/models/app';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsArray()
  @IsOptional() // Optional since it has a default value
  scopes?: UserScopes[];

  @IsNotEmpty()
  @IsString()
  password: string;
}
