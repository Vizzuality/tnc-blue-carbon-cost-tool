import {
  Column,
  Entity,
  PrimaryColumn,
  BaseEntity,
  type Geometry,
  Index,
} from "typeorm";

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

export type CountryWithNoGeometry = Omit<Country, "geometry">;

@Entity("countries")
export class Country extends BaseEntity {
  @PrimaryColumn({ name: "code", length: 3, type: "char" })
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

  @Column({ name: "numeric_code", nullable: true, type: "varchar" })
  numericCode?: string;

  @Column({ name: "hdi", type: "int", nullable: true })
  hdi?: number;

  @Index({ spatial: true })
  @Column({
    type: "geometry",
    srid: 4326,
    // TODO: Make it nullable false once we have all the data
    nullable: true,
  })
  geometry: Geometry;
}
