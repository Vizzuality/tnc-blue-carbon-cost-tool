import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ecosystem_projects')
export class EcosystemProject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'country', length: 100 })
  country: string;

  @Column({ name: 'ecosystem', length: 50 })
  ecosystem: string;

  @Column({ name: 'activity', length: 50 })
  activity: string;

  @Column({ name: 'country_code', length: 3 })
  countryCode: string;

  @Column({ name: 'continent', length: 20 })
  continent: string;

  @Column('decimal', { name: 'hdi', precision: 3, scale: 2 })
  hdi: number;

  @Column('int', { name: 'project_size_ha' })
  projectSizeHa: number;

  // TODO: There is a typo in the excel, update both
  @Column('decimal', { name: 'feseability_analysis', precision: 10, scale: 2 })
  feseabilityAnalysis: number;

  @Column('decimal', {
    name: 'conservation_planning_and_admin',
    precision: 10,
    scale: 2,
  })
  conservationPlanningAndAdmin: number;

  @Column('decimal', {
    name: 'data_collection_and_field_costs',
    precision: 10,
    scale: 2,
  })
  dataCollectionAndFieldCosts: number;

  @Column('decimal', {
    name: 'community_representation',
    precision: 10,
    scale: 2,
  })
  communityRepresentation: number;

  @Column('decimal', { name: 'blue_carbon_planning', precision: 10, scale: 2 })
  blueCarbonPlanning: number;

  @Column('decimal', {
    name: 'establishing_carbon_rights',
    precision: 10,
    scale: 2,
  })
  establishingCarbonRights: number;

  @Column('decimal', { name: 'financing_cost', precision: 5, scale: 4 })
  financingCost: number;

  @Column('decimal', { name: 'validation', precision: 10, scale: 2 })
  validation: number;

  @Column('decimal', {
    name: 'implementation_labor_planting',
    precision: 10,
    scale: 2,
  })
  implementationLaborPlanting: number;

  @Column('decimal', {
    name: 'implementation_labor_hybrid',
    precision: 10,
    scale: 2,
  })
  implementationLaborHybrid: number;

  @Column('decimal', {
    name: 'implementation_labor_hydrology',
    precision: 10,
    scale: 2,
  })
  implementationLaborHydrology: number;

  @Column('decimal', { name: 'monitoring', precision: 10, scale: 2 })
  monitoring: number;

  @Column('decimal', { name: 'maintenance', precision: 5, scale: 4 })
  maintenance: number;

  @Column('smallint', { name: 'maintenance_duration' })
  maintenanceDuration: number;

  @Column('decimal', { name: 'carbon_standard_fees', precision: 5, scale: 4 })
  carbonStandardFees: number;

  @Column('decimal', {
    name: 'community_benefit_sharing_fund',
    precision: 5,
    scale: 4,
  })
  communityBenefitSharingFund: number;

  @Column('decimal', { name: 'baseline_reassessment', precision: 10, scale: 2 })
  baselineReassessment: number;

  @Column('decimal', { name: 'MRV', precision: 10, scale: 2 })
  mrv: number;

  @Column('decimal', {
    name: 'long_term_project_operating_cost',
    precision: 10,
    scale: 2,
  })
  longTermProjectOperatingCost: number;

  @Column('decimal', { name: 'ecosystem_extent', precision: 12, scale: 4 })
  ecosystemExtent: number;

  @Column('decimal', {
    name: 'ecosystem_extent_historic',
    precision: 12,
    scale: 4,
  })
  ecosystemExtentHistoric: number;

  @Column('decimal', { name: 'ecosystem_loss_rate', precision: 10, scale: 9 })
  ecosystemLossRate: number;

  @Column('decimal', { name: 'restorable_land', precision: 10, scale: 4 })
  restorableLand: number;

  @Column({ name: 'tier_1_emission_factor', length: 50, nullable: true })
  tier1EmissionFactor: string;

  @Column('decimal', { name: 'emission_factor_AGB', precision: 10, scale: 8 })
  emissionFactorAgb: number;

  @Column('decimal', { name: 'emission_factor_SOC', precision: 10, scale: 8 })
  emissionFactorSoc: number;

  @Column('decimal', { name: 'sequestration_rate', precision: 8, scale: 4 })
  sequestrationRate: number;

  @Column({ name: 'other_community_cash_flow', length: 50 })
  otherCommunityCashFlow: string;
}
