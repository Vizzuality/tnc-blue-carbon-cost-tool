import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

@Entity("monitoring_cost")
export class MonitoringCost extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { name: "monitoring_cost_per_year" })
  monitoringCost: number;

  @OneToOne(() => BaseData, (baseData) => baseData.monitoringCost)
  baseData: BaseData;
}
