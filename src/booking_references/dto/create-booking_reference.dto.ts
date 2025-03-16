import {
  IsUUID,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookingReferenceDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  project_id: string;

  @IsDate()
  check_in: Date;

  @IsDate()
  check_out: Date;

  @IsNumber()
  gross_sale: number;

  @IsNumber()
  initial_deposit_price: number;

  @IsOptional()
  @IsString()
  initial_deposit_reference_number?: string;

  @IsOptional()
  @IsString()
  initial_deposit_bank_name?: string;

  @IsNumber()
  full_payment_price: number;

  @IsOptional()
  @IsString()
  full_payment_reference_number?: string;

  @IsOptional()
  @IsString()
  full_payment_bank_name?: string;
}
