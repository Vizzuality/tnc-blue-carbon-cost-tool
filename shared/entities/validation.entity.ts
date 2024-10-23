import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

@Entity("validation_cost")
export class ValidationCost extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { name: "validation_cost" })
  validationCost: number;

  @OneToOne(() => BaseData, (baseData) => baseData.validationCost)
  baseData: BaseData;
}
