import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      parseInt(process.env.BCRYPT_ROUNDS || '10'),
    );
    createUserDto.password = hashedPassword;
    const newUser = this.userRepository.create(createUserDto);
    const userCreated = await this.userRepository.save(newUser);
    return userCreated;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email: email });
  }
}
