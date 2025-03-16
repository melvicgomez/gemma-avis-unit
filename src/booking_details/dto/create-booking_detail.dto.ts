import { IsDate, IsNumber } from 'class-validator';

export class CreateBookingDetailDto {
  @IsDate()
  sales_date: Date;

  @IsNumber()
  sales_price: number;
}
