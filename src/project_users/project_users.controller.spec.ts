import { Test, TestingModule } from '@nestjs/testing';
import { ProjectUsersController } from './project_users.controller';
import { ProjectUsersService } from './project_users.service';

describe('ProjectUsersController', () => {
  let controller: ProjectUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectUsersController],
      providers: [ProjectUsersService],
    }).compile();

    controller = module.get<ProjectUsersController>(ProjectUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
