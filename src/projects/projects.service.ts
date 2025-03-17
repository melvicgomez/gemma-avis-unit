import { BadRequestException, Injectable } from '@nestjs/common';
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
      const project = await this.projectRepository.save(createProjectDto);
      return project;
    } else {
      throw new BadRequestException('Project already exists.');
    }
  }

  async findOneBySlug(slug: string) {
    return this.projectRepository.findOneBy({ slug: slug });
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
