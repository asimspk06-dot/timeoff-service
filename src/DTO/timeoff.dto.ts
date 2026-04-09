import { IsString, IsNumber } from 'class-validator';

export class CreateTimeOffDto {
  @IsString()
  employeeId: string;

  @IsString()
  locationId: string;

  @IsNumber()
  days: number;
}