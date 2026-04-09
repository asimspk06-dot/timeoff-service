import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceService } from 'src/balance/balance.service';
import { CreateTimeOffDto } from 'src/DTO/timeoff.dto';
import { TimeOffRequest } from 'src/entities/timeoff.entity';
import { HcmService } from 'src/hcm/hcm.service';
import { Repository } from 'typeorm';

@Injectable()
export class TimeOffService {
  constructor(
    private balanceService: BalanceService,
    private hcmService: HcmService,
    @InjectRepository(TimeOffRequest)
    private repo: Repository<TimeOffRequest>,
  ) {}

  async request(dto: CreateTimeOffDto) {
    const balance = await this.balanceService.getBalance(dto.employeeId, dto.locationId);

    if (balance.balance < dto.days) {
      throw new BadRequestException('Insufficient local balance');
    }

    await this.hcmService.validate(dto.employeeId, dto.locationId, dto.days);

    const request = this.repo.create({ ...dto, status: 'PENDING' });
    return this.repo.save(request);
  }

  async approve(id: number) {
    const req = await this.repo.findOne({ where: { id } });

    if (!req) throw new NotFoundException('Request not found');
    if (req.status !== 'PENDING') throw new BadRequestException('Already processed');

    await this.balanceService.deduct(req.employeeId, req.locationId, req.days);

    req.status = 'APPROVED';
    return this.repo.save(req);
  }

  async reject(id: number) {
    const req = await this.repo.findOne({ where: { id } });

    if (!req) throw new NotFoundException('Request not found');

    req.status = 'REJECTED';
    return this.repo.save(req);
  }

  async getByEmployee(employeeId: string) {
    return this.repo.find({ where: { employeeId } });
  }
}
