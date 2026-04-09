import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { unlinkSync, existsSync } from 'fs';

import { BalanceService } from '../src/balance/balance.service';
import { Balance } from '../src/entities/balance.entity';
import { TimeOffService } from '../src/time-off/time-off.service';
import { TimeOffRequest } from '../src/entities/timeoff.entity';
import { HcmService } from '../src/hcm/hcm.service';
import { AppModule } from '../src/app.module';

describe('BalanceService', () => {
  let service: BalanceService;

  const mockRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        { provide: getRepositoryToken(Balance), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
  });

  it('should return balance', async () => {
    mockRepo.findOne.mockResolvedValue({ balance: 10 });

    const result = await service.getBalance('E1', 'L1');
    expect(result.balance).toBe(10);
  });

  it('should throw if insufficient balance', async () => {
    mockRepo.findOne.mockResolvedValue({ balance: 1 });

    await expect(service.deduct('E1', 'L1', 5)).rejects.toThrow();
  });
});

describe('TimeOffService', () => {
  let service: TimeOffService;

  const mockBalanceService = {
    getBalance: jest.fn(),
    deduct: jest.fn(),
  };

  const mockHcmService = {
    validate: jest.fn(),
  };

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeOffService,
        { provide: BalanceService, useValue: mockBalanceService },
        { provide: HcmService, useValue: mockHcmService },
        { provide: getRepositoryToken(TimeOffRequest), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<TimeOffService>(TimeOffService);
  });

  it('should create request', async () => {
    mockBalanceService.getBalance.mockResolvedValue({ balance: 10 });
    mockHcmService.validate.mockResolvedValue(true);
    mockRepo.create.mockReturnValue({});
    mockRepo.save.mockResolvedValue({ id: 1 });

    const result = await service.request({ employeeId: 'E1', locationId: 'L1', days: 2 });
    expect(result.id).toBe(1);
  });

  it('should fail if insufficient balance', async () => {
    mockBalanceService.getBalance.mockResolvedValue({ balance: 1 });

    await expect(service.request({ employeeId: 'E1', locationId: 'L1', days: 5 })).rejects.toThrow();
  });
});

describe('TimeOff E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Clean up existing database file
    if (existsSync('db.sqlite')) {
      unlinkSync('db.sqlite');
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create balance and request flow', async () => {
    await request(app.getHttpServer())
      .post('/balances/batch')
      .send([{ employeeId: 'E1', locationId: 'L1', balance: 10 }])
      .expect(201);

    const requestRes = await request(app.getHttpServer())
      .post('/timeoff/request')
      .send({ employeeId: 'E1', locationId: 'L1', days: 2 })
      .expect(201);

    const requestId = requestRes.body.id;

    await request(app.getHttpServer())
      .patch(`/timeoff/${requestId}/approve`)
      .expect(200);

    const res = await request(app.getHttpServer())
      .get('/balances/E1/L1')
      .expect(200);

    expect(res.body.balance).toBe(8);
  });
});