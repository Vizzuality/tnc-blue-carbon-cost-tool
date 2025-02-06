import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  Unique,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Country } from "@shared/entities/country.entity";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { ModelComponentSource } from "@shared/entities/methodology/model-component-source.entity";

@Entity("community_representation")
@Unique(["country", "ecosystem"])
export class CommunityRepresentation extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  @JoinColumn({ name: "country_code" })
  country: Country;

  @Column({ name: "country_code", type: "char", length: 3 })
  countryCode: string;

  @Column({ name: "ecosystem", enum: ECOSYSTEM, type: "enum" })
  ecosystem: ECOSYSTEM;

  @Column("decimal", { name: "liaison_cost" })
  liaisonCost: number;

  @ManyToOne("ModelComponentSource", "dataCollectionAndFieldCosts", {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "source_id" })
  source: ModelComponentSource;
}
