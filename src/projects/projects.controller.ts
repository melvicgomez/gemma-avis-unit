import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  // UnauthorizedException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { IsPublic, IsAdmin, IsScopeAllowed } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { UserScope } from 'src/models/app';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly authService: AuthService,
  ) {}

  @IsScopeAllowed([UserScope.TENANT, UserScope.ADMIN])
  @Get()
  async getAllProjects(@Headers('authorization') authHeader?: string) {
    const token = authHeader?.split(' ')[1];
    const decodedToken = this.authService.parseToken(token || '');
    return this.projectsService.findAllProjects(decodedToken.user_id);
  }

  @IsAdmin()
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }
  // TODO: update project

  @IsPublic()
  @Get(':project_id')
  async findOne(@Param('project_id') project_id: string) {
    return this.projectsService.findOneById(project_id);
  }
}
