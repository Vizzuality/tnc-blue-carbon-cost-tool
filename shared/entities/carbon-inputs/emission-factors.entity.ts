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
  OneToMany,
} from "typeorm";
import { Country } from "@shared/entities/country.entity";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";

// TODO: The calculations provide a third option Tier 3 which is provided by the user. Do we need to support this in the DB for this entity,
//       or would be enough to save the user provided value as metadata for the custom project
export enum EMISSION_FACTORS_TIER_TYPES {
  TIER_1 = "Tier 1 - Global emission factor",
  TIER_2 = "Tier 2 - Country-specific emission factor",
  TIER_3 = "Tier 3 - Project specific emission factor",
}

@Entity({ name: "emission_factors" })
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

  @Column("decimal", { name: "emission_factor_agb", nullable: true })
  AGB: number;

  @Column("decimal", { name: "emission_factor_soc", nullable: true })
  SOC: number;

  @Column("decimal", { name: "emission_factor_global", nullable: true })
  global: number;
}
