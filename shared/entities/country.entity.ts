import { Column, Entity, PrimaryColumn, BaseEntity } from "typeorm";

export enum CONTINENTS {
  AFRICA = "Africa",
  ASIA = "Asia",
  EUROPE = "Europe",
  EUROPE_AND_ASIA = "Europe/Asia",
  NORTH_AMERICA = "North America",
  OCEANIA = "Oceania",
  SOUTH_AMERICA = "South America",
  ANTARCTICA = "Antarctica",
}

@Entity("countries")
export class Country extends BaseEntity {
  @PrimaryColumn({ name: "country_code", length: 3, type: "char" })
  code: string;

  @Column({ length: 100, type: "varchar" })
  name: string;

  // TODO: Right now the dataset contains null values for continents, but not sure if this is correct
  @Column({ type: "enum", enum: CONTINENTS, nullable: true })
  continent: CONTINENTS;

  @Column({ name: "region_1", length: 50, nullable: true, type: "varchar" })
  region1?: string;

  @Column({ name: "region_2", length: 50, nullable: true, type: "varchar" })
  region2?: string;

  @Column({ name: "numeric_code", length: 3, nullable: true, type: "char" })
  numericCode?: string;

  @Column({ name: "hdi", type: "int", nullable: true })
  hdi?: number;
}
