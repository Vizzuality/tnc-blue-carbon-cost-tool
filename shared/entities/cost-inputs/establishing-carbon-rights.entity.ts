import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Unique,
  JoinColumn,
} from "typeorm";
import { Country } from "@shared/entities/country.entity";
import { ModelComponentSource } from "@shared/entities/methodology/model-component-source.entity";

@Entity("carbon_rights")
@Unique(["country"])
export class CarbonRights extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  @JoinColumn({ name: "country_code" })
  country: Country;

  @Column({ name: "country_code", type: "char", length: 3 })
  countryCode: string;

  @Column("decimal", { name: "carbon_rights_cost" })
  carbonRightsCost: number;

  @ManyToOne("ModelComponentSource", "carbonRights", {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "source_id" })
  source: ModelComponentSource;
}
