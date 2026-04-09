import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TimeOffService } from './time-off.service';
import { CreateTimeOffDto } from 'src/DTO/timeoff.dto';

@Controller('timeoff')
export class TimeOffController {
  constructor(private service: TimeOffService) {}

  @Post('request')
  request(@Body() body: CreateTimeOffDto) {
    return this.service.request(body);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: number) {
    return this.service.approve(+id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: number) {
    return this.service.reject(+id);
  }

  @Get(':employeeId')
  get(@Param('employeeId') emp: string) {
    return this.service.getByEmployee(emp);
  }
}