import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

@Entity("baseline_reassessment")
export class BaselineReassessment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { name: "baseline_reassessment_cost_per_event" })
  baselineReassessmentCost: number;

  @OneToOne(() => BaseData, (baseData) => baseData.baselineReassessment)
  baseData: BaseData;
}
