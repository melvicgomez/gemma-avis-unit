import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserScope } from 'src/models/app';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional() // Optional since it has a default value
  scope?: UserScope;

  @IsNotEmpty()
  @IsString()
  password: string;
}
