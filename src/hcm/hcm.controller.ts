import { Body, Controller, Post } from '@nestjs/common';
import { HcmService } from './hcm.service';

@Controller('hcm')
export class HcmController {
  constructor(private service: HcmService) {}

  @Post('validate')
  validate(@Body() body) {
    return this.service.validate(body.employeeId, body.locationId, body.days);
  }

  @Post('batch')
  batch(@Body() body) {
    return this.service.batchSync(body);
  }
}