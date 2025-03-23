import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  Patch,
  BadRequestException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { IsPublic, IsAdmin, IsScopeAllowed } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { UserScope } from 'src/models/app';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly authService: AuthService,
  ) {}

  @IsScopeAllowed([UserScope.TENANT])
  @Get()
  async getAllProjects(@Headers('authorization') authHeader?: string) {
    const token = authHeader?.split(' ')[1];
    const decodedToken = this.authService.parseToken(token || '');
    return this.projectsService.findAllProjects(decodedToken.user_id);
  }

  @IsAdmin()
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @IsPublic()
  @Get(':project_id')
  async findOne(@Param('project_id') project_id: string) {
    return this.projectsService.findOneById(project_id);
  }

  @IsScopeAllowed([UserScope.TENANT])
  @Patch(':project_id')
  async update(
    @Param('project_id') project_id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Headers('authorization') authHeader?: string,
  ) {
    const projectObj = await this.projectsService.findOneById(project_id, true);
    if (projectObj) {
      const token = authHeader?.split(' ')[1];
      const decodedToken = this.authService.parseToken(token || '');
      const userIsAllowed = projectObj.project_users.find(
        (u) => u.user_id === decodedToken.user_id,
      );

      if (userIsAllowed) {
        await this.projectsService.update({
          ...projectObj,
          ...updateProjectDto,
        });
      } else {
        throw new MethodNotAllowedException(
          'User is not allowed to modify this project',
        );
      }
    } else {
      throw new BadRequestException(
        'Month must be between 1-12 and year must be valid',
      );
    }
  }
}
