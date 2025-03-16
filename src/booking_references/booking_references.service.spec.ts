import { Test, TestingModule } from '@nestjs/testing';
import { BookingReferencesService } from './booking_references.service';

describe('BookingReferencesService', () => {
  let service: BookingReferencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingReferencesService],
    }).compile();

    service = module.get<BookingReferencesService>(BookingReferencesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
