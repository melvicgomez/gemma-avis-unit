import { Type } from 'class-transformer';
import {
  IsArray,
  ValidateNested,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateBookingDetailDto } from 'src/booking_details/dto/create-booking_detail.dto';

export class CreateBookingReferenceDto {
  @IsDate()
  @Type(() => Date)
  check_in_date: Date;

  @IsDate()
  @Type(() => Date)
  check_out_date: Date;

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBookingDetailDto)
  booking_details: CreateBookingDetailDto[];
}
