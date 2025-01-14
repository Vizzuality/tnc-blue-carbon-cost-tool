import { ValueTransformer, ViewColumn, ViewEntity } from "typeorm";

export const decimalTransformer: ValueTransformer = {
  to: (value: number | null) => value,
  from: (value: string | null): number | null =>
    value !== null ? parseFloat(value) : null,
};

@ViewEntity({
  name: "project_scorecard_key_costs",
  expression: `
SELECT
  p.project_name AS project_name,
  p.conservation_planning_npv AS conservation_planning_npv,
  p.conservation_planning AS conservation_planning,
  p.community_representation_npv AS community_representation_npv,
  p.community_representation AS community_representation,
  p.implementation_labor_npv AS implementation_labor_npv,
  p.implementation_labor AS implementation_labor,
  p.monitoring_maintenance_mpv AS monitoring_maintenance_mpv,
  p.monitoring_maintenance AS monitoring_maintenance,
  p.community_benefit_npv AS community_benefit_npv,
  p.community_benefit AS community_benefit,
  p.carbon_standard_fees_npv AS carbon_standard_fees_npv,
  p.carbon_standard_fees AS carbon_standard_fees,
  p.long_term_project_operating_npv AS long_term_project_operating_npv,
  p.long_term_project_operating AS long_term_project_operating
FROM
	projects p
LEFT JOIN
	project_scorecard ps 
ON
	p.country_code = ps.country_code and
	ps."ecosystem"::VARCHAR = p."ecosystem"::VARCHAR`,
})
export class ProjectKeyCostsView {
  @ViewColumn({ name: "id" })
  id: string;

  @ViewColumn({ name: "project_name" })
  projectName: string;

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
    name: "implementation_labor_npv",
    transformer: decimalTransformer,
  })
  implementationLaborNPV: number;

  @ViewColumn({ name: "implementation_labor", transformer: decimalTransformer })
  implementationLabor: number;

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
    name: "long_term_project_operating_npv",
    transformer: decimalTransformer,
  })
  longTermProjectOperatingNPV: number;

  @ViewColumn({
    name: "long_term_project_operating",
    transformer: decimalTransformer,
  })
  longTermProjectOperating: number;
}
