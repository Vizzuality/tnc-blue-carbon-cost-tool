import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  Unique,
  JoinColumn,
} from "typeorm";
import { Country } from "@shared/entities/country.entity";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";

export enum SEQUESTRATION_RATE_TIER_TYPES {
  TIER_1 = "Tier 1 - IPCC default value",
  TIER_2 = "Tier 2 - Country-specific rate",
  TIER_3 = "Tier 3 - Project-specific rate",
}

// TODO: According to the calculation notebooks, we might be missing a Tier 3, which is a user-defined value, not sure if this should be stored as default or
//       just be provided by the user, but we need to somehow make it as an available option

@Entity("sequestration_rate")
@Unique(["country", "ecosystem"])
export class SequestrationRate extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  @JoinColumn({ name: "country_code" })
  country: Country;

  @Column({ name: "country_code", type: "char", length: 3 })
  countryCode: string;

  @Column({ name: "ecosystem", enum: ECOSYSTEM, type: "enum" })
  ecosystem: ECOSYSTEM;

  // @Column({
  //   type: "enum",
  //   enum: SEQUESTRATION_RATE_TIER_TYPES,
  // })
  // tierSelector: SEQUESTRATION_RATE_TIER_TYPES;

  @Column("decimal", { name: "tier_1_factor", nullable: true })
  tier1Factor: number;

  @Column("decimal", { name: "tier_2_factor", nullable: true })
  tier2Factor: number;

  // @Column("decimal", { name: "sequestration_rate", nullable: true })
  // sequestrationRate: number;

  // @BeforeInsert()
  // @BeforeUpdate()
  // setSequestrationRateValue() {
  //   if (this.tierSelector === SEQUESTRATION_RATE_TIER_TYPES.TIER_1) {
  //     this.sequestrationRate = this.tier1Factor;
  //   } else if (this.tierSelector === SEQUESTRATION_RATE_TIER_TYPES.TIER_2) {
  //     this.sequestrationRate = this.tier2Factor;
  //   }
  // }
}
