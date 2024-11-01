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

@Entity("community_benefit_sharing_fund")
@Unique(["country"])
export class CommunityBenefitSharingFund extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  @JoinColumn({ name: "country_code" })
  country: Country;

  @Column("decimal", { name: "community_benefit_sharing_fund_pc_of_revenue" })
  communityBenefitSharingFund: number;
}
