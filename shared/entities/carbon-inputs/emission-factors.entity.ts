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

// TODO: The calculations provide a third option Tier 3 which is provided by the user. Do we need to support this in the DB for this entity,
//       or would be enough to save the user provided value as metadata for the custom project
export enum EMISSION_FACTORS_TIER_TYPES {
  TIER_2 = "Tier 2 - Country-specific emission factor",
  TIER_1 = "Tier 1 - Global emission factor",
}

@Entity("emission_factors")
@Unique(["country", "ecosystem"])
export class EmissionFactors extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  @JoinColumn({ name: "country_code" })
  country: Country;

  @Column({ name: "country_code", type: "char", length: 3 })
  countryCode: string;

  @Column({ name: "ecosystem", enum: ECOSYSTEM, type: "enum" })
  ecosystem: ECOSYSTEM;

  @Column({
    type: "enum",
    enum: EMISSION_FACTORS_TIER_TYPES,
    nullable: false,
  })
  tierSelector: EMISSION_FACTORS_TIER_TYPES;

  @Column("decimal", { name: "emission_factor", nullable: true })
  emissionFactor: number;

  @Column("decimal", { name: "emission_factor_agb", nullable: true })
  AGB: number;

  @Column("decimal", { name: "emission_factor_soc", nullable: true })
  SOC: number;

  @Column("decimal", { name: "emission_factor_global", nullable: true })
  global: number;

  // TODO: the following inputs should be taken from sources table
  // currently just populated at import with whatever value we have
  // in this table
  @Column("decimal", { name: "emission_factor_country_AGB", nullable: true })
  t2CountrySpecificAGB: number;

  @Column("decimal", { name: "emission_factor_country_SOC", nullable: true })
  t2CountrySpecificSOC: number;

  @BeforeInsert()
  @BeforeUpdate()
  setSequestrationRateValue() {
    if (this.tierSelector === EMISSION_FACTORS_TIER_TYPES.TIER_1) {
      this.emissionFactor = this.global;
      this.AGB = 0;
      this.SOC = 0;
    } else if (this.tierSelector === EMISSION_FACTORS_TIER_TYPES.TIER_2) {
      this.emissionFactor = 0;
      this.AGB = this.t2CountrySpecificAGB;
      this.SOC = this.t2CountrySpecificSOC;
    }
  }
}
