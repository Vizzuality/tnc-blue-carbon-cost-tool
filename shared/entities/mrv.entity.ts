import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

@Entity("mrv")
export class MRV extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { name: "mrv_cost_per_event" })
  mrvCost: number;

  @OneToOne(() => BaseData, (baseData) => baseData.mrv)
  baseData: BaseData;
}
