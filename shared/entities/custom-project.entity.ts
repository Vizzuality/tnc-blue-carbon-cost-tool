import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * @description: This entity is to save Custom Projects (that are calculated, and can be saved only by registered users. Most likely, we don't need to add these as a resource
 * in the backoffice because privacy reasons.
 *
 * The shape defined here is probably wrong, it's only based on the output of the prototype in the notebooks, and it will only serve as a learning resource.
 */

export enum CARBON_REVENUES_TO_COVER {
  OPEX = 'Opex',
  CAPEX_AND_OPEX = 'Capex and Opex',
}

export enum PROJECT_SPECIFIC_EMISSION {
  ONE_EMISSION_FACTOR = 'One emission factor',
  TWO_EMISSION_FACTORS = 'Two emission factors',
}
export enum PROJECT_EMISSION_FACTORS {
  TIER_3 = 'Tier 3 - Project specific emission factor',
  TIER_2 = 'Tier 2 - Country-specific emission factor',
  TIER_1 = 'Tier 1 - Global emission factor',
}


@Entity({ name: "custom_projects" })
export class CustomProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "project_name", type: "varchar", length: 255 })
  projectName: string;

  @Column({ name: "cost_per_tCO2e", type: "varchar", length: 50 })
  costPerTCO2e: string;

  @Column({ name: "cost_per_ha", type: "varchar", length: 50 })
  costPerHa: string;

  @Column({ name: "npv_covering_cost", type: "varchar", length: 50 })
  npvCoveringCost: string;

  @Column({ name: "irr_cover_opex", type: "varchar", length: 50 })
  irrWhenPricedToCoverOpex: string;

  @Column({ name: "irr_cover_total_costs", type: "varchar", length: 50 })
  irrWhenPricedToCoverTotalCosts: string;

  @Column({ name: "total_cost_npv", type: "varchar", length: 50 })
  totalCostNpv: string;

  @Column({ name: "capex_npv", type: "varchar", length: 50 })
  capitalExpenditureNpv: string;

  @Column({ name: "opex_npv", type: "varchar", length: 50 })
  operatingExpenditureNpv: string;

  @Column({ name: "credits_issued", type: "varchar", length: 50 })
  creditsIssued: string;

  @Column({ name: "total_revenue_npv", type: "varchar", length: 50 })
  totalRevenueNpv: string;

  @Column({ name: "total_revenue_non_discounted", type: "varchar", length: 50 })
  totalRevenueNonDiscounted: string;

  @Column({ name: "financing_cost", type: "varchar", length: 50 })
  financingCost: string;

  @Column({ name: "funding_gap_npv", type: "varchar", length: 50 })
  fundingGapNpv: string;

  @Column({ name: "funding_gap_per_tCO2e", type: "varchar", length: 50 })
  fundingGapPerTCO2eNpv: string;

  @Column({
    name: "community_benefit_sharing_fund_percentage",
    type: "varchar",
    length: 50,
  })
  communityBenefitSharingFundPercentage: string;
}
