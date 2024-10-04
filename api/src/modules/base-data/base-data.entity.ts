import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Country } from '@shared/entities/countries/country.entity';

export enum ECOSYSTEM {
  MANGROVE = 'Mangrove',
  SEAGRASS = 'Seagrass',
  SALT_MARSH = 'Salt Marsh',
}

export enum ACTIVITY {
  RESTORATION = 'Restoration',
  CONSERVATION = 'Conservation',
}

@Entity('base_data')
export class BaseData {
  // TODO: We could use a integer value as primary to match the excel rows so that we know if there are new values or something is being updated
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'ecosystem', enum: ECOSYSTEM, type: 'enum' })
  ecosystem: ECOSYSTEM;

  @Column({ name: 'activity', enum: ACTIVITY, type: 'enum' })
  activity: ACTIVITY;

  @Column({ name: 'country_code', length: 3, nullable: true })
  countryCode: string;

  // Unidirectional relation
  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_code' })
  country: Country;

  @Column('int', { name: 'project_size_ha', nullable: true })
  projectSizeHa: number;

  // // TODO: There is a typo in the excel, update both
  // @Column('decimal', {
  //   name: 'feseability_analysis',
  //   precision: 10,
  //   scale: 2,
  //   nullable: true,
  // })
  // feseabilityAnalysis: number;
  //
  // @Column('decimal', {
  //   name: 'conservation_planning_and_admin',
  //   precision: 10,
  //   scale: 2,
  //   nullable: true,
  // })
  // conservationPlanningAndAdmin: number;
  //
  // @Column('decimal', {
  //   name: 'data_collection_and_field_costs',
  //   precision: 10,
  //   scale: 2,
  //   nullable: true,
  // })
  // dataCollectionAndFieldCosts: number;
  //
  // @Column('decimal', {
  //   name: 'community_representation',
  //   precision: 10,
  //   scale: 2,
  //   nullable: true,
  // })
  // communityRepresentation: number;
  //
  // @Column('decimal', {
  //   name: 'blue_carbon_planning',
  //   precision: 10,
  //   scale: 2,
  //   nullable: true,
  // })
  // blueCarbonPlanning: number;
  //
  // @Column('decimal', {
  //   name: 'establishing_carbon_rights',
  //   precision: 10,
  //   scale: 2,
  //   nullable: true,
  // })
  // establishingCarbonRights: number;
  //
  // @Column('decimal', {
  //   name: 'financing_cost',
  //   precision: 5,
  //   scale: 4,
  //   nullable: true,
  // })
  // financingCost: number;
  //
  // @Column('decimal', {
  //   name: 'validation',
  //   precision: 10,
  //   scale: 2,
  //   nullable: true,
  // })
  // validation: number;
  //
  // @Column('decimal', {
  //   name: 'implementation_labor_planting',
  //   precision: 10,
  //   scale: 2,
  //   nullable: true,
  // })
  // implementationLaborPlanting: number;
  //
  // @Column('decimal', {
  //   name: 'implementation_labor_hybrid',
  //   precision: 10,
  //   scale: 2,
  //   nullable: true,
  // })
  // implementationLaborHybrid: number;
  //
  // @Column('decimal', {
  //   name: 'implementation_labor_hydrology',
  //   precision: 10,
  //   scale: 2,
  //   nullable: true,
  // })
  // implementationLaborHydrology: number;
  //
  // @Column('decimal', {
  //   name: 'monitoring',
  //   precision: 10,
  //   scale: 2,
  //   nullable: true,
  // })
  // monitoring: number;
  //
  // @Column('decimal', {
  //   name: 'maintenance',
  //   precision: 5,
  //   scale: 4,
  //   nullable: true,
  // })
  // maintenance: number;
  //
  // @Column('smallint', { name: 'maintenance_duration', nullable: true })
  // maintenanceDuration: number;
  //
  // @Column('decimal', {
  //   name: 'carbon_standard_fees',
  //   precision: 5,
  //   scale: 4,
  //   nullable: true,
  // })
  // carbonStandardFees: number;
  //
  // @Column('decimal', {
  //   name: 'community_benefit_sharing_fund',
  //   precision: 5,
  //   scale: 4,
  //   nullable: true,
  // })
  // communityBenefitSharingFund: number;
  //
  // @Column('decimal', {
  //   name: 'baseline_reassessment',
  //   precision: 10,
  //   scale: 2,
  //   nullable: true,
  // })
  // baselineReassessment: number;
  //
  // @Column('decimal', { name: 'MRV', precision: 10, scale: 2, nullable: true })
  // mrv: number;
  //
  // @Column('decimal', {
  //   name: 'long_term_project_operating_cost',
  //   precision: 10,
  //   scale: 2,
  //   nullable: true,
  // })
  // longTermProjectOperatingCost: number;
  //
  // @Column('decimal', {
  //   name: 'ecosystem_extent',
  //   precision: 12,
  //   scale: 4,
  //   nullable: true,
  // })
  // ecosystemExtent: number;
  //
  // @Column('decimal', {
  //   name: 'ecosystem_extent_historic',
  //   precision: 12,
  //   scale: 4,
  //   nullable: true,
  // })
  // ecosystemExtentHistoric: number;
  //
  // @Column('decimal', {
  //   name: 'ecosystem_loss_rate',
  //   precision: 10,
  //   scale: 9,
  //   nullable: true,
  // })
  // ecosystemLossRate: number;
  //
  // @Column('decimal', {
  //   name: 'restorable_land',
  //   precision: 10,
  //   scale: 4,
  //   nullable: true,
  // })
  // restorableLand: number;
  //
  // @Column({
  //   name: 'tier_1_emission_factor',
  //   length: 50,
  //   nullable: true,
  // })
  // tier1EmissionFactor: string;
  //
  // @Column('decimal', {
  //   name: 'emission_factor_AGB',
  //   precision: 10,
  //   scale: 8,
  //   nullable: true,
  // })
  // emissionFactorAgb: number;
  //
  // @Column('decimal', {
  //   name: 'emission_factor_SOC',
  //   precision: 10,
  //   scale: 8,
  //   nullable: true,
  // })
  // emissionFactorSoc: number;
  //
  // @Column('decimal', {
  //   name: 'sequestration_rate',
  //   precision: 8,
  //   scale: 4,
  //   nullable: true,
  // })
  // sequestrationRate: number;
  //
  // @Column({ name: 'other_community_cash_flow', length: 50, nullable: true })
  // otherCommunityCashFlow: string;
}
