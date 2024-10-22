import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { BaseData } from "@api/modules/model/base-data.entity";

@Entity("conservation_planning_and_admin")
export class ConservationPlanningAndAdmin extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { name: "planning_cost" })
  planningCost: number;

  @OneToMany(
    () => BaseData,
    (baseData) => baseData.conservationPlanningAndAdmin,
  )
  baseData: BaseData[];
}
