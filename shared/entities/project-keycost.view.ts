import { ValueTransformer, ViewColumn, ViewEntity } from "typeorm";

export const decimalTransformer: ValueTransformer = {
  to: (value: number | null) => value,
  from: (value: string | null): number | null =>
    value !== null ? parseFloat(value) : null,
};

@ViewEntity({
  name: "project_keycost_view",
  expression: `
SELECT
    p.id as id,
    p.country_code AS country_code,
    p.ecosystem AS ecosystem,
    p.activity AS activity,
    p.restoration_activity AS activity_subtype,
    p.project_name AS project_name,
    pk.implementation_labor AS implementation_labor,
    pk.community_benefit_sharing_fund AS community_benefit_sharing_fund,
    pk.monitoring_and_maintenance AS monitoring_and_maintenance,
    pk.community_representation_liaison AS community_representation_liaison,
    pk.conservation_planning_and_admin AS conservation_planning_and_admin,
    pk.long_term_project_operating AS long_term_project_operating,
    pk.carbon_standard_fees AS carbon_standard_fees  
FROM
    projects p
LEFT JOIN
    project_keycost pk
ON
    p.country_code = pk.country_code and
    pk."ecosystem"::VARCHAR = p."ecosystem"::VARCHAR`,
})
export class ProjectKeyCostView {
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

  @ViewColumn({
    name: "implementation_labor",
    transformer: decimalTransformer,
  })
  implementationLabor: number;

  @ViewColumn({
    name: "community_benefit_sharing_fund",
    transformer: decimalTransformer,
  })
  communityBenefitSharingFund: number;

  @ViewColumn({
    name: "monitoring_and_maintenance",
    transformer: decimalTransformer,
  })
  monitoringAndMaintenance: number;

  @ViewColumn({
    name: "community_representation_liaison",
    transformer: decimalTransformer,
  })
  communityRepresentationLiaison: number;

  @ViewColumn({
    name: "conservation_planning_and_admin",
    transformer: decimalTransformer,
  })
  conservationPlanningAndAdmin: number;

  @ViewColumn({
    name: "long-term_project_operating",
    transformer: decimalTransformer,
  })
  longTermProjectOperating: number;

  @ViewColumn({
    name: "carbon_standard_fees",
    transformer: decimalTransformer,
  })
  carbonStandardFees: number;
}
