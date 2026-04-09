import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class HcmService {
  async validate(employeeId: string, locationId: string, days: number) {
    if (days <= 0) throw new BadRequestException('Invalid days');

    // Simulate external validation
    if (days > 20) {
      throw new BadRequestException('HCM: Insufficient balance');
    }

    return { success: true };
  }

  async batchSync(data: any[]) {
    return { synced: data.length };
  }
}
