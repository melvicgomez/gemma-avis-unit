import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectUserDto } from './create-project_user.dto';

export class UpdateProjectUserDto extends PartialType(CreateProjectUserDto) {}
