import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceDto } from 'src/DTO/balance.dto';

@Controller('balances')
export class BalanceController {
  constructor(private service: BalanceService) {}

  @Get(':employeeId/:locationId')
  get(@Param('employeeId') emp: string, @Param('locationId') loc: string) {
    return this.service.getBalance(emp, loc);
  }

  @Post('batch')
  batch(@Body() body: BalanceDto[]) {
    return this.service.batchUpdate(body);
  }
}
