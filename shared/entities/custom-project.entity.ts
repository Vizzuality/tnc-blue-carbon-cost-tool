import { CustomProjectSnapshotDto } from "@api/modules/custom-projects/dto/custom-project-snapshot.dto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * @description: This entity is to save Custom Projects (that are calculated, and can be saved only by registered users. Most likely, we don't need to add these as a resource
 * in the backoffice because privacy reasons.
 *
 * The shape defined here is probably wrong, it's only based on the output of the prototype in the notebooks, and it will only serve as a learning resource.
 */

@Entity({ name: "custom_projects" })
export class CustomProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "project_length", type: "decimal" })
  projectLength: number;

  // CAPEX costs (for each year)
  @Column({ name: "feasibility_analysis", type: "decimal", array: true })
  feasibilityAnalysis: number[];

  @Column({
    name: "conservation_planning_and_admin",
    type: "decimal",
    array: true,
  })
  conservationPlanningAndAdmin: number[];

  @Column({
    name: "data_collection_and_field_cost",
    type: "decimal",
    array: true,
  })
  dataCollectionAndFieldCost: number[];

  @Column({ name: "community_representation", type: "decimal", array: true })
  communityRepresentation: number[];

  @Column({
    name: "blue_carbon_project_planning",
    type: "decimal",
    array: true,
  })
  blueCarbonProjectPlanning: number[];

  @Column({ name: "establishing_carbon_rights", type: "decimal", array: true })
  establishingCarbonRights: number[];

  @Column({ name: "validation", type: "decimal", array: true })
  validation: number[];

  @Column({ name: "implementation_labor", type: "decimal", array: true })
  implementationLabor: number[];

  @Column({ name: "total_capex", type: "decimal", array: true })
  totalCapex: number[];

  // OPEX costs (for each year)
  @Column({ name: "monitoring", type: "decimal", array: true })
  monitoring: number[];

  @Column({ name: "maintenance", type: "decimal", array: true })
  maintenance: number[];

  @Column({
    name: "community_benefit_sharing_fund",
    type: "decimal",
    array: true,
  })
  communitySharingFund: number[];

  @Column({ name: "carbon_standard_fees", type: "decimal", array: true })
  carbonStandardFees: number[];

  @Column({ name: "baseline_reassessment", type: "decimal", array: true })
  baselineReassessment: number[];

  @Column({ name: "mrv", type: "decimal", array: true })
  mrv: number[];

  @Column({
    name: "long_term_project_operating_cost",
    type: "decimal",
    array: true,
  })
  longTermProjectOperatingCost: number[];

  @Column({ name: "total_opex", type: "decimal", array: true })
  totalOpex: number[];

  // Total costs (for each year)
  @Column({ name: "total_costs", type: "decimal", array: true })
  totalCosts: number[];

  @Column({ name: "est_credits_issued", type: "decimal", array: true })
  estCreditsIssued: number[];

  @Column({ name: "est_revenue", type: "decimal", array: true })
  estRevenue: number[];

  @Column({
    name: "annual_net_income_rev_less_opex",
    type: "decimal",
    array: true,
  })
  annualNetIncomeRevLessOpex: number[];

  @Column({
    name: "cumulative_net_income_rev_less_opex",
    type: "decimal",
    array: true,
  })
  cummulativeNetIncomeRevLessOpex: number[];

  @Column({ name: "funding_gap", type: "decimal", array: true })
  fundingGap: number[];

  @Column({ name: "irr_opex", type: "decimal", array: true })
  irrOpex: number[];

  @Column({ name: "irr_total_cost", type: "decimal", array: true })
  irrTotalCost: number[];

  @Column({ name: "irr_annual_net_income", type: "decimal", array: true })
  irrAnnualNetIncome: number[];

  @Column({ name: "annual_net_cash_flow", type: "decimal", array: true })
  annualNetCashFlow: number[];

  static fromCustomProjectSnapshotDTO(
    dto: CustomProjectSnapshotDto
  ): CustomProject {
    const customProject = new CustomProject();
    customProject.projectLength = dto.inputSnapshot.assumptions.projectLength;
    customProject.feasibilityAnalysis = dto.outputSnapshot.feasiabilityAnalysis;
    customProject.conservationPlanningAndAdmin =
      dto.outputSnapshot.conservationPlanningAndAdmin;
    customProject.dataCollectionAndFieldCost =
      dto.outputSnapshot.dataCollectionAndFieldCost;
    customProject.communityRepresentation =
      dto.outputSnapshot.communityRepresentation;
    customProject.blueCarbonProjectPlanning =
      dto.outputSnapshot.blueCarbonProjectPlanning;
    customProject.establishingCarbonRights =
      dto.outputSnapshot.establishingCarbonRights;
    customProject.validation = dto.outputSnapshot.validation;
    customProject.implementationLabor = dto.outputSnapshot.implementationLabor;
    customProject.totalCapex = dto.outputSnapshot.totalCapex;
    customProject.monitoring = dto.outputSnapshot.monitoring;
    customProject.maintenance = dto.outputSnapshot.maintenance;
    customProject.communitySharingFund =
      dto.outputSnapshot.communityBenefitSharingFund;
    customProject.carbonStandardFees = dto.outputSnapshot.carbonStandardFees;
    customProject.baselineReassessment =
      dto.outputSnapshot.baselineReassessment;
    customProject.mrv = dto.outputSnapshot.mrv;
    customProject.longTermProjectOperatingCost =
      dto.outputSnapshot.longTermProjectOperatingCost;
    customProject.totalOpex = dto.outputSnapshot.totalOpex;
    customProject.totalCosts = dto.outputSnapshot.totalCapex;
    customProject.estCreditsIssued = dto.outputSnapshot.estCreditsIssued;
    customProject.estRevenue = dto.outputSnapshot.estRevenue;
    customProject.annualNetIncomeRevLessOpex =
      dto.outputSnapshot.annualNetIncomeRevLessOpex;
    customProject.cummulativeNetIncomeRevLessOpex =
      dto.outputSnapshot.cummulativeNetIncomeRevLessOpex;
    customProject.fundingGap = dto.outputSnapshot.fundingGap;
    customProject.irrOpex = dto.outputSnapshot.irrOpex;
    customProject.irrTotalCost = dto.outputSnapshot.irrTotalCost;
    customProject.irrAnnualNetIncome = dto.outputSnapshot.irrAnnualNetIncome;
    customProject.annualNetCashFlow = dto.outputSnapshot.annualNetCashFlow;
    return customProject;
  }
}
