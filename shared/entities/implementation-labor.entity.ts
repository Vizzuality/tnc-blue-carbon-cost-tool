import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

@Entity("implementation_labor_cost")
export class ImplementationLaborCost extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { name: "implementation_labor_cost_per_ha" })
  implementationLaborCost: number;

  @OneToOne(() => BaseData, (baseData) => baseData.implementationLaborCost)
  baseData: BaseData;
}
