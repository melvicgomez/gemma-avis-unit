import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin.dto';
import { Public } from './auth.guard';
// import { Public } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
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
