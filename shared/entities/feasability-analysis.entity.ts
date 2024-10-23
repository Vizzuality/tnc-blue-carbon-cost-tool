import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

@Entity("feasibility_analysis")
export class FeasibilityAnalysis extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { name: "analysis_score" })
  analysisScore: number;

  @OneToOne(() => BaseData, (baseData) => baseData.feasibilityAnalysis)
  baseData: BaseData[];
}
