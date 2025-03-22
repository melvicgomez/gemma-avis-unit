import { Type } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';

export class CreateBookingDetailDto {
  @IsDate()
  @Type(() => Date)
  sales_date: Date;

  @IsNumber()
  sales_price: number;
}
