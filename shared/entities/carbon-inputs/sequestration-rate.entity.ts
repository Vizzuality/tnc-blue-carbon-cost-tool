import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  Unique,
} from "typeorm";
import { Country } from "../country.entity";
import { ECOSYSTEM } from "../ecosystem.enum";

export enum SEQUESTRATION_RATE_TIER_TYPES {
  TIER_2 = "Tier 2 - Country-specific rate",
  TIER_1 = "Tier 1 - IPCC default value",
}

@Entity("sequestration_rate_2")
@Unique(["country", "ecosystem"])
export class SequestrationRate2 extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  country: Country;

  @Column({ name: "ecosystem", enum: ECOSYSTEM, type: "enum" })
  ecosystem: ECOSYSTEM;

  @Column({
    type: "enum",
    enum: SEQUESTRATION_RATE_TIER_TYPES,
  })
  tierSelector: SEQUESTRATION_RATE_TIER_TYPES;

  @Column("decimal", { name: "tier_1_factor", nullable: true })
  tier1Factor: number;

  @Column("decimal", { name: "tier_2_factor", nullable: true })
  tier2Factor: number;

  @Column("decimal", { name: "sequestration_rate", nullable: true })
  sequestrationRate: number;

  @BeforeInsert()
  @BeforeUpdate()
  setSequestrationRateValue() {
    if (this.tierSelector === SEQUESTRATION_RATE_TIER_TYPES.TIER_1) {
      this.sequestrationRate = this.tier1Factor;
    } else if (this.tierSelector === SEQUESTRATION_RATE_TIER_TYPES.TIER_2) {
      this.sequestrationRate = this.tier2Factor;
    }
  }
}
