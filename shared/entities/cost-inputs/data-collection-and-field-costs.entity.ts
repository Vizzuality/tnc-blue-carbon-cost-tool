import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Unique,
} from "typeorm";
import { Country } from "../country.entity";
import { ECOSYSTEM } from "../ecosystem.enum";

@Entity("data_collection_and_field_costs")
@Unique(["country", "ecosystem"])
export class DataCollectionAndFieldCosts extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  country: Country;

  @Column({ name: "ecosystem", enum: ECOSYSTEM, type: "enum" })
  ecosystem: ECOSYSTEM;

  @Column("decimal", { name: "field_cost_per_project" })
  fieldCost: number;
}
