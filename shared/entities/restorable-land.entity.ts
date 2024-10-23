import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

@Entity("restorable_land")
export class RestorableLand extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { name: "restorable_land_ha" })
  restorableLand: number;

  @OneToOne(() => BaseData, (baseData) => baseData.restorableLand)
  baseData: BaseData;
}
