import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

@Entity("conservation_planning_and_admin")
export class ConservationPlanningAndAdmin extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { name: "planning_cost" })
  planningCost: number;

  @OneToOne(() => BaseData, (baseData) => baseData.conservationPlanningAndAdmin)
  baseData: BaseData[];
}
