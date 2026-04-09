import { Body, Controller, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { TimeOffService } from './time-off.service';
import { CreateTimeOffDto } from 'src/DTO/timeoff.dto';

@Controller('timeoff')
export class TimeOffController {
  constructor(private service: TimeOffService) {}

  @Post('request')
  @HttpCode(201)
  request(@Body() body: CreateTimeOffDto) {
    return this.service.request(body);
  }

  @Patch(':id/approve')
  @HttpCode(200)
  approve(@Param('id') id: number) {
    return this.service.approve(+id);
  }

  @Patch(':id/reject')
  @HttpCode(200)
  reject(@Param('id') id: number) {
    return this.service.reject(+id);
  }

  @Get(':employeeId')
  get(@Param('employeeId') emp: string) {
    return this.service.getByEmployee(emp);
  }
}