import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

@Entity("carbon_rights")
export class CarbonRights extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { name: "carbon_rights_cost" })
  liaisonCost: number;

  @OneToOne(() => BaseData, (baseData) => baseData.carbonRights)
  baseData: BaseData[];
}
