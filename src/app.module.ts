import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TimeOffModule } from './time-off/time-off.module';
import { HcmModule } from './hcm/hcm.module';
import { BalanceModule } from './balance/balance.module';
import { TimeOffRequest } from './entities/timeoff.entity';
import { Balance } from './entities/balance.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [TimeOffRequest, Balance],
      synchronize: true,
    }),
    TimeOffModule,
    BalanceModule,
    HcmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}