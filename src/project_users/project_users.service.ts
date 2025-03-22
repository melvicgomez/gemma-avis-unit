import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    try {
      const newBookingDetails =
        this.projectUserRepository.create(createProjectUserDto);
      return await this.projectUserRepository.save(newBookingDetails);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create booking reference (${error})`,
      );
    }
  }

  async checkIfUserAllowedInProject(user_id: string, project_id: string) {
    const activateUsers = await this.projectUserRepository.find({
      where: {
        project_id,
        user_id,
        is_active: true,
      },
    });
    return activateUsers.length > 0;
  }
}
