import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TimeOffRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: string;

  @Column()
  locationId: string;

  @Column('float')
  days: number;

  @Column({ default: 'PENDING' })
  status: string;
}