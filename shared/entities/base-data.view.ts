import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
  name: "base_data_view",
  expression: `
WITH country_activity_ecosystem_combinations AS (
	SELECT 
	    c.code AS country_code,
	    a.activity as activity,
	    e.ecosystem as ecosystem
	FROM 
	    (SELECT DISTINCT code FROM countries) c
	CROSS JOIN 
        (SELECT 'Restoration'::VARCHAR AS activity UNION ALL 
         SELECT 'Conservation'::VARCHAR) AS a
    CROSS JOIN 
        (SELECT 'Mangrove'::VARCHAR AS ecosystem UNION ALL 
         SELECT 'Seagrass'::VARCHAR UNION ALL 
         SELECT 'Salt marsh'::VARCHAR) AS e
)
select 
	cae.country_code as country_code,
	cae.ecosystem as ecosystem,
	cae.activity as activity,
	ps.size as project_size_ha,
	fa.analysis_cost_per_project as feasibility_analysis,
	cpa.planning_cost_per_project as conservation_planning_and_admin,
	dcfc.field_cost_per_project as data_collection_and_field_cost,
	cr.liaison_cost as community_representation,
	bcpp.blue_carbon as blue_carbon_project_planning,
	crights.carbon_rights_cost as establishing_carbon_rights,
	fc.financing_cost_capex_percent as financing_cost,
	vc.validation_cost as validation,
	ilc.planting_cost_ha as implementation_labor_planting,
	ilc.hybrid_cost_ha as implementation_labor_hybrid,
	ilc.hydrology_cost_ha as implementation_labor_hydrology,
	monitoring.monitoring_cost_per_year as monitoring,
	maintenance.maintenance_cost_pc_of_impl_labor_cost as maintenance,
	maintenance.maintenance_duration_years as maintenance_duration,
	csf.cost_per_carbon_credit_issued as carbon_standard_fees,
	cbsf.community_benefit_sharing_fund_pc_of_revenue as community_benefit_sharing_fund,
	br.baseline_reassessment_cost_per_event as baseline_reassessment,
	mrv.mrv_cost_per_event as MRV,
	ltpo.long_term_project_operating_cost_per_year as long_term_project_operating_cost,
	ee.extent as ecosystem_extent,
	ee.historic_extent as ecosystem_extent_historic,
	elr.ecosystem_loss_rate as ecosystem_loss_rate,
	rl.restorable_land as restorable_land,
	ef.emission_factor_global as tier_1_emission_factor,
	ef.emission_factor_agb as emission_factor_AGB,
	ef.emission_factor_soc as emission_factor_SOC,
	sr.tier_1_factor as tier_1_sequestration_rate,
	sr.tier_2_factor as tier_2_sequestration_rate,
	ccf."cashflowType" as other_community_cash_flow
from
	country_activity_ecosystem_combinations as cae
inner join 
	project_size ps on 
		ps."country_code" = cae.country_code and 
		ps."ecosystem"::VARCHAR = cae."ecosystem"::VARCHAR and
		ps."activity"::VARCHAR = cae."activity"::VARCHAR
inner join 
	feasibility_analysis fa on 
		fa."country_code" = cae.country_code and 
		fa."ecosystem"::VARCHAR = cae."ecosystem"::VARCHAR
inner join 
	conservation_planning_and_admin cpa on 
		cpa."country_code" = cae.country_code and 
		cpa."ecosystem"::VARCHAR = cae."ecosystem"::VARCHAR
inner join 
	data_collection_and_field_costs dcfc on
		dcfc."country_code" = cae.country_code and 
		dcfc."ecosystem"::VARCHAR = cae."ecosystem"::VARCHAR
inner join 
	community_representation cr on
		cr."country_code" = cae.country_code and 
		cr."ecosystem"::VARCHAR = cae."ecosystem"::VARCHAR
inner join 
	blue_carbon_project_planning bcpp on bcpp."country_code" = cae.country_code
inner join 
	carbon_rights crights on  crights."country_code" = cae.country_code
inner join 
	financing_cost fc on fc."country_code" = cae.country_code
inner join 
	validation_cost vc on vc."country_code" = cae.country_code
inner join 
	monitoring_cost monitoring on 
		monitoring."country_code" = cae.country_code and 
		monitoring."ecosystem"::VARCHAR = cae."ecosystem"::VARCHAR
inner join 
	implementation_labor_cost ilc on 
		ilc."country_code" = cae.country_code and 
		ilc."ecosystem"::VARCHAR = cae."ecosystem"::VARCHAR
inner join 
	maintenance maintenance on maintenance."country_code" = cae.country_code
inner join 
	carbon_standard_fees csf on csf."country_code" = cae.country_code
inner join 
	community_benefit_sharing_fund cbsf on cbsf."country_code" = cae.country_code
inner join 
	baseline_reassessment br on br."country_code" = cae.country_code
inner join 
	mrv mrv on mrv."country_code" = cae.country_code
inner join 
	long_term_project_operating ltpo on 
		ltpo."country_code" = cae.country_code and 
		ltpo."ecosystem"::VARCHAR = cae."ecosystem"::VARCHAR
inner join 
	ecosystem_extent ee on 
		ee."country_code" = cae.country_code and 
		ee."ecosystem"::VARCHAR = cae."ecosystem"::VARCHAR
inner join 
	ecosystem_loss elr on 
		elr."country_code" = cae.country_code and 
		elr."ecosystem"::VARCHAR = cae."ecosystem"::VARCHAR
inner join 
	restorable_land rl on 
		rl."country_code" = cae.country_code and 
		rl."ecosystem"::VARCHAR = cae."ecosystem"::VARCHAR
inner join 
	emission_factors ef on 
		ef."country_code" = cae.country_code and 
		ef."ecosystem"::VARCHAR = cae."ecosystem"::VARCHAR
inner join 
	sequestration_rate sr on 
		sr."country_code" = cae.country_code and 
		sr."ecosystem"::VARCHAR = cae."ecosystem"::VARCHAR
inner join 
	community_cash_flow ccf on ccf."country_code" = cae.country_code`,
})
export class BaseDataView {
  @ViewColumn({ name: "country_code" })
  countryCode: string;

  @ViewColumn({ name: "ecosystem" })
  ecosystem: string;

  @ViewColumn({ name: "activity" })
  activity: string;

  @ViewColumn({ name: "project_size_ha" })
  projectSizeHa: number;

  @ViewColumn({ name: "feasibility_analysis" })
  feasibilityAnalysis: number;

  @ViewColumn({ name: "conservation_planning_and_admin" })
  conservationPlanningAndAdmin: number;

  @ViewColumn({ name: "data_collection_and_field_cost" })
  dataCollectionAndFieldCost: number;

  @ViewColumn({ name: "community_representation" })
  communityRepresentation: number;

  @ViewColumn({ name: "blue_carbon_project_planning" })
  blueCarbonProjectPlanning: number;

  @ViewColumn({ name: "establishing_carbon_rights" })
  establishingCarbonRights: number;

  @ViewColumn({ name: "financing_cost" })
  financingCost: number;

  @ViewColumn({ name: "validation" })
  validation: number;

  @ViewColumn({ name: "implementation_labor_planting" })
  implementationLaborPlanting: number;

  @ViewColumn({ name: "implementation_labor_hybrid" })
  implementationLaborHybrid: number;

  @ViewColumn({ name: "implementation_labor_hydrology" })
  implementationLaborHydrology: number;

  @ViewColumn({ name: "monitoring" })
  monitoring: number;

  @ViewColumn({ name: "maintenance" })
  maintenance: number;

  @ViewColumn({ name: "maintenance_duration" })
  maintenanceDuration: number;

  @ViewColumn({ name: "carbon_standard_fees" })
  carbonStandardFees: number;

  @ViewColumn({ name: "community_benefit_sharing_fund" })
  communityBenefitSharingFund: number;

  @ViewColumn({ name: "baseline_reassessment" })
  baselineReassessment: number;

  @ViewColumn({ name: "mrv" })
  mrv: number;

  @ViewColumn({ name: "long_term_project_operating_cost" })
  longTermProjectOperatingCost: number;

  @ViewColumn({ name: "ecosystem_extent" })
  ecosystemExtent: number;

  @ViewColumn({ name: "ecosystem_extent_historic" })
  ecosystemExtentHistoric: number;

  @ViewColumn({ name: "ecosystem_loss_rate" })
  ecosystemLossRate: number;

  @ViewColumn({ name: "restorable_land" })
  restorableLand: number;

  @ViewColumn({ name: "tier_1_emission_factor" })
  tier1EmissionFactor: number;

  @ViewColumn({ name: "emission_factor_agb" })
  emissionFactorAgb: number;

  @ViewColumn({ name: "emission_factor_soc" })
  emissionFactorSoc: number;

  @ViewColumn({ name: "tier_1_sequestration_rate" })
  tier1SequestrationRate: number;

  @ViewColumn({ name: "tier_2_sequestration_rate" })
  tier2SequestrationRate: number;

  @ViewColumn({ name: "other_community_cash_flow" })
  otherCommunityCashFlow: string;
}
