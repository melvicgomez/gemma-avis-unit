import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Param,
  Headers,
  Put,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IsPublic, IsAdmin } from 'src/auth/auth.guard';
import { ProjectsService } from 'src/projects/projects.service';
import { ProjectUsersService } from 'src/project_users/project_users.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly projectService: ProjectsService,
    private readonly projectUsersService: ProjectUsersService,
    private readonly authService: AuthService,
  ) {}

  @IsAdmin()
  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @IsAdmin()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @Post('create-new-user')
  async createNewUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.findUserByEmail(createUserDto.email);
    if (user === null) {
      await this.usersService.create(createUserDto);
      return null;
    } else {
      throw new BadRequestException('Email already exists');
    }
  }

  @IsPublic()
  @UsePipes(new ValidationPipe())
  @Post('register/:invite_code')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createUserDto: CreateUserDto,
    @Param('invite_code') invitationCode: string,
  ) {
    const project = await this.projectService.findOneById(invitationCode, true);
    if (project) {
      if (project.max_active_users > project.project_users.length) {
        const user = await this.usersService.findUserByEmail(
          createUserDto.email,
        );
        if (user === null) {
          const userCreated = await this.usersService.create(createUserDto);
          await this.projectUsersService.create({
            project_id: invitationCode,
            user_id: userCreated.user_id,
            is_active: true,
          });
          return null;
        } else {
          return new BadRequestException('Email already exists');
        }
      } else {
        throw new BadRequestException(
          'Invation code for this project reached the maximum active users.',
        );
      }
    } else {
      throw new BadRequestException('Invitation code used is not valid.');
    }
  }

  @UsePipes(new ValidationPipe())
  @Put('link-project/:project_id')
  @HttpCode(HttpStatus.CREATED)
  async linkProjectToUser(
    @Param('project_id') invitationCode: string,
    @Headers('authorization') authHeader?: string, // ✅ Mark as optional to avoid TypeScript error
  ) {
    const token = authHeader?.split(' ')[1];
    const decodedToken = this.authService.parseToken(token || '');
    const project = await this.projectService.findOneById(invitationCode, true);
    if (project) {
      if (project.max_active_users > project.project_users.length) {
        await this.projectUsersService.create({
          project_id: invitationCode,
          user_id: decodedToken.user_id,
          is_active: true,
        });
        return null;
      } else {
        throw new BadRequestException(
          'Invation code for this project reached the maximum active users.',
        );
      }
    } else {
      throw new BadRequestException('Invitation code used is not valid.');
    }
  }
}
