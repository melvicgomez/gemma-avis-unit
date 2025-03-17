import {
  IsString,
  IsOptional,
  IsNumber,
  IsObject,
  IsDateString,
  MaxLength,
  IsDefined,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { PricingDay, SocialLinkType } from 'src/models/app';

export class CreateProjectDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  max_active_users: number;

  @IsDefined()
  @IsNotEmpty()
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
  pricing: Partial<Record<PricingDay, number>>;

  @IsDefined()
  @IsNotEmpty()
  @IsDateString()
  expiration_date: string;
}
