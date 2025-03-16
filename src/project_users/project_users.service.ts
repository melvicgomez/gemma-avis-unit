import { Injectable } from '@nestjs/common';
import { CreateProjectUserDto } from './dto/create-project_user.dto';
import { UpdateProjectUserDto } from './dto/update-project_user.dto';

@Injectable()
export class ProjectUsersService {
  create(createProjectUserDto: CreateProjectUserDto) {
    console.log(createProjectUserDto);
    return 'This action adds a new projectUser';
  }

  findAll() {
    return `This action returns all projectUsers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projectUser`;
  }

  update(id: number, updateProjectUserDto: UpdateProjectUserDto) {
    console.log(updateProjectUserDto);
    return `This action updates a #${id} projectUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectUser`;
  }
}
