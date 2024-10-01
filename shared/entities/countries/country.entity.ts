import { Column, Entity, PrimaryColumn } from "typeorm";

export enum CONTINENTS {
  AFRICA = "Africa",
  ASIA = "Asia",
  EUROPE = "Europe",
  NORTH_AMERICA = "North America",
  OCEANIA = "Oceania",
  SOUTH_AMERICA = "South America",
}

@Entity("countries")
export class Country {
  @PrimaryColumn({ name: "country_code", length: 3 })
  countryCode: string;

  @Column({ length: 100 })
  country: string;

  @Column({ type: "enum", enum: CONTINENTS })
  continent: CONTINENTS;

  @Column({ name: "region_1", length: 50, nullable: true })
  region1: string;

  @Column({ name: "region_2", length: 50, nullable: true })
  region2: string;

  @Column({ name: "numeric_code", length: 3, nullable: true })
  numericCode: string;

  @Column({ name: "hdi", type: "int" })
  hdi: number;
}
