import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from "typeorm";
import { Country } from "../country.entity";

export enum COMMUNITY_CASH_FLOW_TYPES {
  NON_DEVELOPMENT = "Non-development",
  DEVELOPMENT = "Development",
}

@Entity("community_cash_flow")
@Unique(["country"])
export class CommunityCashFlow extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  country: Country;

  @Column({ type: "enum", enum: COMMUNITY_CASH_FLOW_TYPES, nullable: true })
  cashflowType: COMMUNITY_CASH_FLOW_TYPES;
}
