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
    p.abatement_potential AS abatement_potential,
    p.total_cost AS total_cost,
    p.total_cost_npv AS total_cost_npv
FROM
	projects p
LEFT JOIN
	project_scorecard ps 
ON
	p.country_code = ps.country_code and
	ps."ecosystem"::VARCHAR = p."ecosystem"::VARCHAR`,
})
export class ProjectScorecardView {
  @ViewColumn({ name: "country_code", transformer: decimalTransformer })
  countryCode: string;

  @ViewColumn({ name: "ecosystem", transformer: decimalTransformer })
  ecosystem: string;

  @ViewColumn({ name: "activity", transformer: decimalTransformer })
  activity: string;

  @ViewColumn({ name: "activity_subtype", transformer: decimalTransformer })
  activitySubtype: string;

  @ViewColumn({ name: "project_name", transformer: decimalTransformer })
  projectName: string;

  @ViewColumn({
    name: "financial_feasibility",
    transformer: decimalTransformer,
  })
  financialFeasibility: string;

  @ViewColumn({ name: "legal_feasibility", transformer: decimalTransformer })
  legalFeasibility: string;

  @ViewColumn({
    name: "implementation_feasibility",
    transformer: decimalTransformer,
  })
  implementationFeasibility: string;

  @ViewColumn({ name: "social_feasibility", transformer: decimalTransformer })
  socialFeasibility: string;

  @ViewColumn({ name: "security_rating", transformer: decimalTransformer })
  securityRating: string;

  @ViewColumn({
    name: "availability_of_experienced_labor",
    transformer: decimalTransformer,
  })
  availabilityOfExperiencedLabor: string;

  @ViewColumn({
    name: "availability_of_alternating_funding",
    transformer: decimalTransformer,
  })
  availabilityOfAlternatingFunding: string;

  @ViewColumn({
    name: "coastal_protection_benefits",
    transformer: decimalTransformer,
  })
  coastalProtectionBenefits: string;

  @ViewColumn({ name: "biodiversity_benefit", transformer: decimalTransformer })
  biodiversityBenefit: string;

  @ViewColumn({ name: "abatement_potential", transformer: decimalTransformer })
  abatementPotential: number;

  @ViewColumn({ name: "total_cost", transformer: decimalTransformer })
  totalCost: number;

  @ViewColumn({ name: "total_cost_npv", transformer: decimalTransformer })
  totalCostNPV: number;
}
