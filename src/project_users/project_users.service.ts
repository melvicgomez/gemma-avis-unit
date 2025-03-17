import { Injectable } from '@nestjs/common';
import { CreateProjectUserDto } from './dto/create-project_user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectUser } from './entities/project_user.entity';

@Injectable()
export class ProjectUsersService {
  constructor(
    @InjectRepository(ProjectUser)
    private projectUserRepository: Repository<ProjectUser>,
  ) {}

  async create(createProjectUserDto: CreateProjectUserDto) {
    return await this.projectUserRepository.save(createProjectUserDto);
  }
}
