import { Test, TestingModule } from '@nestjs/testing';
import { HcmController } from './hcm.controller';
import { HcmService } from './hcm.service';

describe('HcmController', () => {
  let controller: HcmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HcmController],
      providers: [
        {
          provide: HcmService,
          useValue: {
            validate: jest.fn(),
            batchSync: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HcmController>(HcmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
