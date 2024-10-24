import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

@Entity("long_term_project_operating")
export class LongTermProjectOperating extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { name: "long_term_project_operating_cost_per_year" })
  longTermProjectOperatingCost: number;

  @OneToOne(() => BaseData, (baseData) => baseData.longTermProjectOperating)
  baseData: BaseData;
}
