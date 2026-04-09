import { Module } from '@nestjs/common';
import { TimeOffController } from './time-off.controller';
import { TimeOffService } from './time-off.service';
import { BalanceModule } from '../balance/balance.module';
import { HcmModule } from '../hcm/hcm.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeOffRequest } from '../entities/timeoff.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimeOffRequest]),
    BalanceModule,
    HcmModule,
  ],
  controllers: [TimeOffController],
  providers: [TimeOffService]
})
export class TimeOffModule {}
