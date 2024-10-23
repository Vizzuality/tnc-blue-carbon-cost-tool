import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

@Entity("maintenance")
export class Maintenance extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { name: "maintenance_cost_pc_of_impl_labor_cost" })
  maintenanceCost: number;

  @Column("decimal", { name: "maintenance_duration_years" })
  maintenance_duration: number;

  @OneToOne(() => BaseData, (baseData) => baseData.maintenance)
  baseData: BaseData;
}
