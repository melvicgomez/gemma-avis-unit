import { Test, TestingModule } from '@nestjs/testing';
import { BookingReferencesController } from './booking_references.controller';
import { BookingReferencesService } from './booking_references.service';

describe('BookingReferencesController', () => {
  let controller: BookingReferencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingReferencesController],
      providers: [BookingReferencesService],
    }).compile();

    controller = module.get<BookingReferencesController>(BookingReferencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
