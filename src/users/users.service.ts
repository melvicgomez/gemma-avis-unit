import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(user_id: string) {
    return `This action returns a #${user_id} user`;
  }

  update(user_id: string, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${user_id} user`;
  }

  remove(user_id: string) {
    return `This action removes a #${user_id} user`;
  }
}
