import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

export enum SEQUESTRATION_RATE_TIER_TYPES {
  TIER_2 = "Tier 2 - Country-specific rate",
  TIER_1 = "Tier 1 - IPCC default value",
}

@Entity("sequestration_rate")
export class SequestrationRate extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: SEQUESTRATION_RATE_TIER_TYPES,
    nullable: false,
    default: SEQUESTRATION_RATE_TIER_TYPES.TIER_1,
  })
  tierSelector: SEQUESTRATION_RATE_TIER_TYPES;

  // TODO
  // Tier 1 for all ecosystem is taken from Sources >> Sequestration Rate table
  @Column("decimal", { name: "tier_1_factor" })
  tier1Factor: number;

  // Tier 2 is defined for each ecosystem in this table
  @Column("decimal", { name: "tier_2_factor" })
  tier2Factor: number;

  @OneToOne(() => BaseData, (baseData) => baseData.sequestrationRate)
  baseData: BaseData[];
}
