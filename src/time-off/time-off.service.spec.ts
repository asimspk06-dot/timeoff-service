import { Test, TestingModule } from '@nestjs/testing';
import { TimeOffService } from './time-off.service';
import { BalanceService } from '../balance/balance.service';
import { HcmService } from '../hcm/hcm.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TimeOffRequest } from '../entities/timeoff.entity';

describe('TimeOffService', () => {
  let service: TimeOffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeOffService,
        {
          provide: BalanceService,
          useValue: {
            getBalance: jest.fn(),
            deduct: jest.fn(),
          },
        },
        {
          provide: HcmService,
          useValue: {
            validate: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(TimeOffRequest),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TimeOffService>(TimeOffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
