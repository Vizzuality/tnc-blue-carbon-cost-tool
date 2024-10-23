import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

@Entity("financing_cost")
export class FinancingCost extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { name: "financing_cost_capex_percent" })
  financingCostCapexPercent: number;

  @OneToOne(() => BaseData, (baseData) => baseData.carbonRights)
  baseData: BaseData[];
}
