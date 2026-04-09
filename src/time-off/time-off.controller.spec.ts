import { Test, TestingModule } from '@nestjs/testing';
import { TimeOffController } from './time-off.controller';
import { TimeOffService } from './time-off.service';

describe('TimeOffController', () => {
  let controller: TimeOffController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeOffController],
      providers: [
        {
          provide: TimeOffService,
          useValue: {
            request: jest.fn(),
            approve: jest.fn(),
            reject: jest.fn(),
            getByEmployee: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TimeOffController>(TimeOffController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
