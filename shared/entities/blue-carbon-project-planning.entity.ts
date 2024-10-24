import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

export enum INPUT_SELECTION {
  INPUT_1 = "Input 1",
  INPUT_2 = "Input 2",
  INPUT_3 = "Input 3",
}

@Entity("blue_carbon_project_planning")
export class BlueCarbonProjectPlanning extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: INPUT_SELECTION, nullable: false })
  inputSelection: INPUT_SELECTION;

  @Column("decimal", { name: "input_1_cost_per_project" })
  input1: number;

  @Column("decimal", { name: "input_2_cost_per_project" })
  input2: number;

  @Column("decimal", { name: "input_3_cost_per_project" })
  input3: number;

  @OneToOne(() => BaseData, (baseData) => baseData.blueCarbonProjectPlanning)
  baseData: BaseData;
}
