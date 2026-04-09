import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceDto } from 'src/DTO/balance.dto';
import { Balance } from 'src/entities/balance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BalanceService {
  constructor(@InjectRepository(Balance) private repo: Repository<Balance>) {}

  async getBalance(employeeId: string, locationId: string) {
    const balance = await this.repo.findOne({ where: { employeeId, locationId } });
    if (!balance) throw new NotFoundException('Balance not found');
    return balance;
  }

  async batchUpdate(data: BalanceDto[]) {
    return this.repo.save(data);
  }

  async deduct(employeeId: string, locationId: string, days: number) {
    const bal = await this.getBalance(employeeId, locationId);

    if (bal.balance < days) {
      throw new BadRequestException('Insufficient balance');
    }

    bal.balance -= days;
    return this.repo.save(bal);
  }
  
  // constructor(@InjectRepository(Balance) private repo: Repository<Balance>) {}

  // async getBalance(employeeId: string, locationId: string) {
  //   return this.repo.findOne({ where: { employeeId, locationId } });
  // }

  // async updateBalance(employeeId: string, locationId: string, amount: number) {
  //   const bal = await this.getBalance(employeeId, locationId);
  //   if (!bal) {
  //     throw new Error(`Balance not found for employee ${employeeId} at location ${locationId}`);
  //   }
  //   bal.balance += amount;
  //   return this.repo.save(bal);
  // }

  // async batchUpdate(data: any[]) {
  //   return this.repo.save(data);
  // }
}
