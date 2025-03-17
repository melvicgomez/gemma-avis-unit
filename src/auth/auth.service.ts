import * as bcrypt from 'bcrypt';
import {
  Injectable,
  Dependencies,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Dependencies(UsersService, JwtService)
@Injectable()
export class AuthService {
  usersService: UsersService;
  jwtService: JwtService;
  constructor(usersService: UsersService, jwtService: JwtService) {
    this.usersService = usersService;
    this.jwtService = jwtService;
  }

  parseToken(token: string) {
    try {
      const decoded = this.jwtService.decode(token);
      return decoded as User;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async getUserToken(email: string, password: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (user !== null) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException(
          'User did not found because either wrong email address or password.',
        );
      }

      delete user.project_users;
      delete user.user_booking_references;

      const userTokenPayload = {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        scope: user.scope,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
      const token: string = this.jwtService.sign(userTokenPayload);
      return token;
    } else {
      throw new UnauthorizedException('User not found');
    }
  }
}
