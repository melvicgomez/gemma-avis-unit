import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin.dto';
import { IsPublic } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @IsPublic()
  @Post('login')
  @UsePipes(new ValidationPipe())
  async signIn(@Body() signinUserDto: SigninUserDto) {
    const userToken = await this.authService.getUserToken(
      signinUserDto.email,
      signinUserDto.password,
    );
    return userToken;
  }
}
