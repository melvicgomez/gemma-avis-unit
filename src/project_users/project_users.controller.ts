import { Controller, Post, Body } from '@nestjs/common';
import { ProjectUsersService } from './project_users.service';
import { CreateProjectUserDto } from './dto/create-project_user.dto';

@Controller('project-users')
export class ProjectUsersController {
  constructor(private readonly projectUsersService: ProjectUsersService) {}

  @Post()
  create(@Body() createProjectUserDto: CreateProjectUserDto) {
    return this.projectUsersService.create(createProjectUserDto);
  }
}
