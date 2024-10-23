import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

export enum COMMUNITY_CASH_FLOW_TYPES {
  NON_DEVELOPMENT = "Non-development",
  DEVELOPMENT = "Development",
}

@Entity("community_cash_flow")
export class CommunityCashFlow extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // TODO: Right now the dataset contains null values for other_community_cashflow, but not sure if this is correct
  @Column({ type: "enum", enum: COMMUNITY_CASH_FLOW_TYPES, nullable: true })
  cashflowType: COMMUNITY_CASH_FLOW_TYPES;

  @OneToOne(() => BaseData, (baseData) => baseData.communityCashFlow)
  baseData: BaseData[];
}
