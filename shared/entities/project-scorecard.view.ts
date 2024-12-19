import { ValueTransformer, ViewColumn, ViewEntity } from "typeorm";

export const decimalTransformer: ValueTransformer = {
  to: (value: number | null) => value,
  from: (value: string | null): number | null =>
    value !== null ? parseFloat(value) : null,
};

@ViewEntity({
  name: "project_scorecard_view",
  expression: `
SELECT
  p.id as id,
	p.country_code AS country_code,
	p.ecosystem AS ecosystem,
  p.activity AS activity,
  p.restoration_activity AS activity_subtype,
  p.project_name AS project_name,
	ps.financial_feasibility AS financial_feasibility,
  ps.legal_feasibility AS legal_feasibility,
  ps.implementation_feasibility AS implementation_feasibility,
  ps.social_feasibility AS social_feasibility,
  ps.security_rating AS security_rating,
  ps.availability_of_experienced_labor AS availability_of_experienced_labor,
  ps.availability_of_alternating_funding AS availability_of_alternating_funding,
  ps.coastal_protection_benefits AS coastal_protection_benefits,
  ps.biodiversity_benefit AS biodiversity_benefit,
  p.total_cost AS total_cost,
  p.total_cost_npv AS total_cost_npv,
  p.project_size AS project_size,
  p.project_size_filter AS project_size_filter,
  p.price_type AS price_type,
  p.abatement_potential AS abatement_potential,
  p.capex_npv AS capex_npv,
  p.capex AS capex,
  p.opex_npv AS opex_npv,
  p.opex AS opex,
  p.cost_per_tco2e_npv AS cost_per_tco2e_npv,
  p.cost_per_tco2e AS cost_per_tco2e,
  p.feasibility_analysis_npv AS feasibility_analysis_npv,
  p.feasibility_analysis AS feasibility_analysis,
  p.conservation_planning_npv AS conservation_planning_npv,
  p.conservation_planning AS conservation_planning,
  p.data_collection_npv AS data_collection_npv,
  p.data_collection AS data_collection,
  p.community_representation_npv AS community_representation_npv,
  p.community_representation AS community_representation,
  p.blue_carbon_project_planning_npv AS blue_carbon_project_planning_npv,
  p.blue_carbon_project_planning AS blue_carbon_project_planning,
  p.establishing_carbon_rights_npv AS establishing_carbon_rights_npv,
  p.establishing_carbon_rights AS establishing_carbon_rights,
  p.validation_npv AS validation_npv,
  p.validation AS validation,
  p.implementation_labor_npv AS implementation_labor_npv,
  p.implementation_labor AS implementation_labor,
  p.monitoring_npv AS monitoring_npv,
  p.monitoring AS monitoring,
  p.maintenance_npv AS maintenance_npv,
  p.maintenance AS maintenance,
  p.monitoring_maintenance_mpv AS monitoring_maintenance_mpv,
  p.monitoring_maintenance AS monitoring_maintenance,
  p.community_benefit_npv AS community_benefit_npv,
  p.community_benefit AS community_benefit,
  p.carbon_standard_fees_npv AS carbon_standard_fees_npv,
  p.carbon_standard_fees AS carbon_standard_fees,
  p.baseline_reassessment_npv AS baseline_reassessment_npv,
  p.baseline_reassessment AS baseline_reassessment,
  p.mrv_npv AS mrv_npv,
  p.mrv AS mrv,
  p.long_term_project_operating_npv AS long_term_project_operating_npv,
  p.long_term_project_operating AS long_term_project_operating,
  p.initial_price_assumption AS initial_price_assumption,
  p.leftover_after_opex_npv AS leftover_after_opex_npv,
  p.leftover_after_opex AS leftover_after_opex,
  p.total_revenue_npv AS total_revenue_npv,
  p.total_revenue AS total_revenue,
  p.credits_issued AS credits_issued,
  p.score_card_rating AS score_card_rating
FROM
	projects p
LEFT JOIN
	project_scorecard ps 
ON
	p.country_code = ps.country_code and
	ps."ecosystem"::VARCHAR = p."ecosystem"::VARCHAR`,
})
export class ProjectScorecardView {
  @ViewColumn({ name: "id" })
  id: string;

  @ViewColumn({ name: "country_code" })
  countryCode: string;

  @ViewColumn({ name: "ecosystem" })
  ecosystem: string;

  @ViewColumn({ name: "activity" })
  activity: string;

  @ViewColumn({ name: "activity_subtype" })
  activitySubtype: string;

  @ViewColumn({ name: "project_name" })
  projectName: string;

  @ViewColumn({ name: "financial_feasibility" })
  financialFeasibility: string;

  @ViewColumn({ name: "legal_feasibility" })
  legalFeasibility: string;

  @ViewColumn({ name: "implementation_feasibility" })
  implementationFeasibility: string;

  @ViewColumn({ name: "social_feasibility" })
  socialFeasibility: string;

  @ViewColumn({ name: "security_rating" })
  securityRating: string;

  @ViewColumn({ name: "availability_of_experienced_labor" })
  availabilityOfExperiencedLabor: string;

  @ViewColumn({ name: "availability_of_alternating_funding" })
  availabilityOfAlternatingFunding: string;

  @ViewColumn({ name: "coastal_protection_benefits" })
  coastalProtectionBenefits: string;

  @ViewColumn({ name: "biodiversity_benefit" })
  biodiversityBenefit: string;

  @ViewColumn({ name: "abatement_potential", transformer: decimalTransformer })
  abatementPotential: number;

  @ViewColumn({ name: "total_cost", transformer: decimalTransformer })
  totalCost: number;

  @ViewColumn({ name: "total_cost_npv", transformer: decimalTransformer })
  totalCostNPV: number;

  @ViewColumn({ name: "project_size", transformer: decimalTransformer })
  projectSize: number;

  @ViewColumn({ name: "project_size_filter" })
  projectSizeFilter: string;

  @ViewColumn({ name: "price_type" })
  priceType: string;

  @ViewColumn({ name: "capex_npv", transformer: decimalTransformer })
  capexNPV: number;

  @ViewColumn({ name: "capex", transformer: decimalTransformer })
  capex: number;

  @ViewColumn({ name: "opex_npv", transformer: decimalTransformer })
  opexNPV: number;

  @ViewColumn({ name: "opex", transformer: decimalTransformer })
  opex: number;

  @ViewColumn({ name: "cost_per_tco2e_npv", transformer: decimalTransformer })
  costPerTCO2eNPV: number;

  @ViewColumn({ name: "cost_per_tco2e", transformer: decimalTransformer })
  costPerTCO2e: number;

  @ViewColumn({
    name: "feasibility_analysis_npv",
    transformer: decimalTransformer,
  })
  feasibilityAnalysisNPV: number;

  @ViewColumn({ name: "feasibility_analysis", transformer: decimalTransformer })
  feasibilityAnalysis: number;

  @ViewColumn({
    name: "conservation_planning_npv",
    transformer: decimalTransformer,
  })
  conservationPlanningNPV: number;

  @ViewColumn({
    name: "conservation_planning",
    transformer: decimalTransformer,
  })
  conservationPlanning: number;

  @ViewColumn({ name: "data_collection_npv", transformer: decimalTransformer })
  dataCollectionNPV: number;

  @ViewColumn({ name: "data_collection", transformer: decimalTransformer })
  dataCollection: number;

  @ViewColumn({
    name: "community_representation_npv",
    transformer: decimalTransformer,
  })
  communityRepresentationNPV: number;

  @ViewColumn({
    name: "community_representation",
    transformer: decimalTransformer,
  })
  communityRepresentation: number;

  @ViewColumn({
    name: "blue_carbon_project_planning_npv",
    transformer: decimalTransformer,
  })
  blueCarbonProjectPlanningNPV: number;

  @ViewColumn({
    name: "blue_carbon_project_planning",
    transformer: decimalTransformer,
  })
  blueCarbonProjectPlanning: number;

  @ViewColumn({
    name: "establishing_carbon_rights_npv",
    transformer: decimalTransformer,
  })
  establishingCarbonRightsNPV: number;

  @ViewColumn({
    name: "establishing_carbon_rights",
    transformer: decimalTransformer,
  })
  establishingCarbonRights: number;

  @ViewColumn({ name: "validation_npv", transformer: decimalTransformer })
  validationNPV: number;

  @ViewColumn({ name: "validation", transformer: decimalTransformer })
  validation: number;

  @ViewColumn({
    name: "implementation_labor_npv",
    transformer: decimalTransformer,
  })
  implementationLaborNPV: number;

  @ViewColumn({ name: "implementation_labor", transformer: decimalTransformer })
  implementationLabor: number;

  @ViewColumn({ name: "monitoring_npv", transformer: decimalTransformer })
  monitoringNPV: number;

  @ViewColumn({ name: "monitoring", transformer: decimalTransformer })
  monitoring: number;

  @ViewColumn({ name: "maintenance_npv", transformer: decimalTransformer })
  maintenanceNPV: number;

  @ViewColumn({ name: "maintenance", transformer: decimalTransformer })
  maintenance: number;

  @ViewColumn({
    name: "monitoring_maintenance_mpv",
    transformer: decimalTransformer,
  })
  monitoringMaintenanceMPV: number;

  @ViewColumn({
    name: "monitoring_maintenance",
    transformer: decimalTransformer,
  })
  monitoringMaintenance: number;

  @ViewColumn({
    name: "community_benefit_npv",
    transformer: decimalTransformer,
  })
  communityBenefitNPV: number;

  @ViewColumn({ name: "community_benefit", transformer: decimalTransformer })
  communityBenefit: number;

  @ViewColumn({
    name: "carbon_standard_fees_npv",
    transformer: decimalTransformer,
  })
  carbonStandardFeesNPV: number;

  @ViewColumn({ name: "carbon_standard_fees", transformer: decimalTransformer })
  carbonStandardFees: number;

  @ViewColumn({
    name: "baseline_reassessment_npv",
    transformer: decimalTransformer,
  })
  baselineReassessmentNPV: number;

  @ViewColumn({
    name: "baseline_reassessment",
    transformer: decimalTransformer,
  })
  baselineReassessment: number;

  @ViewColumn({ name: "mrv_npv", transformer: decimalTransformer })
  mrvNPV: number;

  @ViewColumn({ name: "mrv", transformer: decimalTransformer })
  mrv: number;

  @ViewColumn({
    name: "long_term_project_operating_npv",
    transformer: decimalTransformer,
  })
  longTermProjectOperatingNPV: number;

  @ViewColumn({
    name: "long_term_project_operating",
    transformer: decimalTransformer,
  })
  longTermProjectOperating: number;

  @ViewColumn({
    name: "initial_price_assumption",
    transformer: decimalTransformer,
  })
  initialPriceAssumption: number;

  @ViewColumn({
    name: "leftover_after_opex_npv",
    transformer: decimalTransformer,
  })
  leftoverAfterOpexNPV: number;

  @ViewColumn({ name: "leftover_after_opex", transformer: decimalTransformer })
  leftoverAfterOpex: number;

  @ViewColumn({ name: "total_revenue_npv", transformer: decimalTransformer })
  totalRevenueNPV: number;

  @ViewColumn({ name: "total_revenue", transformer: decimalTransformer })
  totalRevenue: number;

  @ViewColumn({ name: "credits_issued", transformer: decimalTransformer })
  creditsIssued: number;

  @ViewColumn({ name: "score_card_rating" })
  scoreCardRating: string;
}
