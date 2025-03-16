import {
  IsString,
  IsOptional,
  IsNumber,
  IsObject,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { PricingDay, SocialLinkType } from 'src/models/app';

export class CreateProjectDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNumber()
  max_active_users: number;

  @IsString()
  @MaxLength(255)
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  mobile_num?: string;

  @IsOptional()
  @IsObject()
  social_links?: Partial<Record<SocialLinkType, string>>;

  @IsOptional()
  @IsObject()
  pricing?: Partial<Record<PricingDay, number>>;

  @IsDateString()
  expiration_date: string;
}
