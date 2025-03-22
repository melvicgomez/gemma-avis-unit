import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectUser } from 'src/project_users/entities/project_user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectUser)
    private projectUserRepository: Repository<ProjectUser>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const alreadyExists = await this.findOneBySlug(createProjectDto.slug);
    if (!alreadyExists) {
      try {
        const newProject = this.projectRepository.create(createProjectDto);
        const project = await this.projectRepository.save(newProject);
        return project;
      } catch (error) {
        throw new InternalServerErrorException(
          `Failed to create booking reference (${error})`,
        );
      }
    } else {
      throw new BadRequestException('Project already exists.');
    }
  }

  async findOneBySlug(slug: string) {
    return this.projectRepository.findOneBy({ slug: slug });
  }

  async findAllProjects(userId: string) {
    const projects = await this.projectRepository.find({
      relations: ['project_users'],
      where: {
        project_users: {
          user_id: userId,
          is_active: true,
        },
      },
    });

    return projects;
  }

  async findOneById(id: string, includeActiveUsers?: boolean) {
    if (includeActiveUsers) {
      const projects = await this.projectRepository.findOne({
        where: { project_id: id },
        relations: ['project_users'],
      });

      if (projects) {
        projects.project_users = projects.project_users.filter(
          (user) => user.is_active,
        );
      }

      return projects;
    } else {
      return this.projectRepository.findOneBy({
        project_id: id,
      });
    }
  }
}
