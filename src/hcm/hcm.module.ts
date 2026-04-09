import { Module } from '@nestjs/common';
import { HcmService } from './hcm.service';
import { HcmController } from './hcm.controller';

@Module({
  providers: [HcmService],
  exports: [HcmService],
  controllers: [HcmController]
})
export class HcmModule {}
