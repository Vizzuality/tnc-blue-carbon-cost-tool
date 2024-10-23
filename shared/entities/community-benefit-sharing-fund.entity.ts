import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

@Entity("community_benefit_sharing_fund")
export class CommunityBenefitSharingFund extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { name: "benefit_sharing_fund_pc_of_revenue" })
  benefitSharingFund: number;

  @OneToOne(() => BaseData, (baseData) => baseData.communityBenefit)
  baseData: BaseData[];
}
