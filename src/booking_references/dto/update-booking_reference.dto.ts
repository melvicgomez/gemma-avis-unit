import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingReferenceDto } from './create-booking_reference.dto';

export class UpdateBookingReferenceDto extends PartialType(
  CreateBookingReferenceDto,
) {}
