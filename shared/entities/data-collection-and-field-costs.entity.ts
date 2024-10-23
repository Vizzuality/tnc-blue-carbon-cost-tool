import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

@Entity("data_collection_and_field_costs")
export class DataCollectionAndFieldCosts extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { name: "field_cost" })
  fieldCost: number;

  @OneToOne(() => BaseData, (baseData) => baseData.dataCollectionAndFieldCosts)
  baseData: BaseData[];
}
