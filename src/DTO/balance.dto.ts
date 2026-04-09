import { IsString, IsNumber } from 'class-validator';

export class BalanceDto {
  @IsString()
  employeeId: string;

  @IsString()
  locationId: string;

  @IsNumber()
  balance: number;
}