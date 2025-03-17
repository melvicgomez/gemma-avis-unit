import { IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class CreateProjectUserDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  project_id: string;

  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}
