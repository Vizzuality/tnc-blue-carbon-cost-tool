import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

export enum EMISSION_FACTORS_TIER_TYPES {
  TIER_2 = "Tier 2 - Country-specific emission factor",
  TIER_1 = "Tier 1 - Global emission factor",
}

@Entity("emission_factors")
export class EmissionFactors extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: EMISSION_FACTORS_TIER_TYPES, nullable: false })
  tierSelector: EMISSION_FACTORS_TIER_TYPES;

  @Column("decimal", { name: "tier_1_factor" })
  tier1Factor: number;

  // TODO
  // Tier2 for mangrove is taken from sources table
  // Tier 2 values for other ecosystem is NA
  @Column("decimal", { name: "tier_2_AGB_factor" })
  tier2AGBFactor: number;

  @Column("decimal", { name: "tier_2_SOC_factor" })
  tier2SOCFactor: number;

  @OneToOne(() => BaseData, (baseData) => baseData.emissionFactors)
  baseData: BaseData[];
}
