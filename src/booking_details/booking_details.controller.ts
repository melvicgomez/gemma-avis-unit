import { Controller } from '@nestjs/common';
import { BookingDetailsService } from './booking_details.service';

@Controller('booking-details')
export class BookingDetailsController {
  constructor(private readonly bookingDetailsService: BookingDetailsService) {}
}
