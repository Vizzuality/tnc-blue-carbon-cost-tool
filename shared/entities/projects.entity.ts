import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Country } from "@shared/entities/country.entity";
import { ECOSYSTEM } from "./ecosystem.enum";
import { ACTIVITY } from "./activity.enum";

export enum PROJECT_SIZE_FILTER {
  SMALL = "Small",
  MEDIUM = "Medium",
  LARGE = "Large",
}

export enum PROJECT_PRICE_TYPE {
  OPEN_BREAK_EVEN_PRICE = "Opex breakeven price",
  MARKET_PRICE = "Market price",
}

export enum RESTORATION_ACTIVITY_SUBTYPE {
  HYBRID = "Hybrid",
  HYDROLOGY = "Hydrology",
  PLANTING = "Planting",
}

@Entity("projects")
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "project_name", type: "varchar", length: 255 })
  projectName: string;

  @Column({ name: "country_code", length: 3, nullable: true, type: "char" })
  countryCode: string;

  //Unidirectional relation
  @ManyToOne(() => Country)
  @JoinColumn({ name: "country_code" })
  country: Country;

  @Column({ name: "ecosystem", enum: ECOSYSTEM, type: "enum" })
  ecosystem: ECOSYSTEM;

  @Column({ name: "activity", enum: ACTIVITY, type: "enum" })
  activity: ACTIVITY;

  // TODO: We need to make this a somehow enum, as a subactivity of restoration, that can be null for conservation, and can represent all restoration activities
  @Column({
    name: "activity_subtype",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  activitySubtype: RESTORATION_ACTIVITY_SUBTYPE;

  @Column({ name: "project_size", type: "decimal" })
  projectSize: number;

  // TODO: We could potentially remove this column from the database and excel, and have a threshold to filter by
  @Column({
    name: "project_size_filter",
    type: "enum",
    enum: PROJECT_SIZE_FILTER,
  })
  projectSizeFilter: string;

  @Column({ name: "abatement_potential", type: "decimal", nullable: true })
  abatementPotential: number;

  @Column({ name: "total_cost_npv", type: "decimal", nullable: true })
  totalCostNPV: number;

  @Column({ name: "total_cost", type: "decimal", nullable: true })
  totalCost: number;

  @Column({ name: "cost_per_tco2e_npv", type: "decimal", nullable: true })
  costPerTCO2eNPV: number;

  @Column({ name: "cost_per_tco2e", type: "decimal", nullable: true })
  costPerTCO2e: number;

  @Column({
    name: "initial_price_assumption",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  initialPriceAssumption: string;

  @Column({
    name: "price_type",
    enum: PROJECT_PRICE_TYPE,
    type: "enum",
    nullable: true,
  })
  priceType: PROJECT_PRICE_TYPE;
}
