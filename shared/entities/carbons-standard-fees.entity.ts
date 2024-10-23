import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

@Entity("carbon_standard_fees")
export class CarbonStandardFees extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { name: "cost_per_carbon_credit_issued" })
  carbonStandardFee: number;

  @OneToOne(() => BaseData, (baseData) => baseData.projectSize)
  baseData: BaseData;
}
