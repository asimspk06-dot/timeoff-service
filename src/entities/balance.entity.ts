import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: string;

  @Column()
  locationId: string;

  @Column('float')
  balance: number;
}