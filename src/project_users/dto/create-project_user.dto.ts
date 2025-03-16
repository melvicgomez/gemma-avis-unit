import { IsUUID, IsBoolean } from 'class-validator';

export class CreateProjectUserDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  project_id: string;

  @IsBoolean()
  is_active: boolean;
}
