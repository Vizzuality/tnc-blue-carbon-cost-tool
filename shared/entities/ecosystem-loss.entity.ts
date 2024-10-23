import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

@Entity("ecosystem_loss")
export class EcosystemLoss extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { name: "ecosystem_loss_rate" })
  ecosystemLossRate: number;

  @OneToOne(() => BaseData, (baseData) => baseData.ecosystemLoss)
  baseData: BaseData;
}
