// import { BaseDataView } from '@shared/entities/base-data.view';
// import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
// import { ACTIVITY } from '@shared/entities/activity.enum';
// import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
// import { RESTORATION_ACTIVITY_SUBTYPE } from '@shared/entities/projects.entity';
// import { SEQUESTRATION_RATE_TIER_TYPES } from '@shared/entities/carbon-inputs/sequestration-rate.entity';
// import { EMISSION_FACTORS_TIER_TYPES } from '@shared/entities/carbon-inputs/emission-factors.entity';
//
// /**
//  * @notes: There is a clear distinction between the data needed depending on the activity, and the ecosystem. We will probably need to create a class for each of the activities,
//  * and then have a factory that will create the correct class depending on the activity and ecosystem.
//  *
//  * BaseSize and BaseIncrease are not used in the example class of the notebook, but they are later used in the constructor, so we don't need them here
//  *
//  */
//
// // TODO: This seems to be a mix of assumptions, base sizes and increases. Check with Data
// export const DEFAULT_STUFF = {
//   VERIFICATION_FREQUENCY: 5,
//   BASELINE_REASSESSMENT_FREQUENCY: 10,
//   DISCOUNT_RATE: 0.04,
//   CARBON_PRICE_INCREASE: 0.015,
//   ANNUAL_COST_INCREASE: 0,
//   BUFFER: 0.2,
//   SOIL_ORGANIC_CARBON_RELEASE_LENGTH: 10,
//   RESTORATION_STARTING_POINT_SCALING: 500,
//   CONSERVATION_STARTING_POINT_SCALING: 20000,
//   RESTORATION_PROJECT_LENGTH: 20,
//   CONSERVATION_PROJECT_LENGTH: 20,
//   RESTORATION_RATE: 250,
//   DEFAULT_PROJECT_LENGTH: 40,
// };
//
// export class ProjectCalculationBuilder {
//   private countryCode: string;
//   private ecosystem: string;
//   private activity: ACTIVITY;
//   private activitySubType: string;
//   private carbonPrice: number;
//   private carbonRevenuesToCover: string;
//   // baseData here references the cost inputs, which can be the defaults found, or be overridden by the user
//   private baseData: BaseDataView;
//   private assumptions: ModelAssumptions;
//   // This seems to be a hardcoded value in the notebook, double check how it should work: Is editable etc
//   private soilOrganicCarbonReleaseLength: number = 10;
//   private startingScalingPoint: number;
//   private conservationProjectLength: number =
//     DEFAULT_STUFF.CONSERVATION_PROJECT_LENGTH;
//   private restorationProjectLength: number =
//     DEFAULT_STUFF.RESTORATION_PROJECT_LENGTH;
//   private restorationRate: number = DEFAULT_STUFF.RESTORATION_RATE;
//   private defaultProjectLength: number = DEFAULT_STUFF.DEFAULT_PROJECT_LENGTH;
//   private carbonRevenuesWillNotCover: string;
//   private plantingSuccessRate: number;
//   private implmentationLabor: number;
//   private secuestrationRate: number;
//   private projectSpecificLossRate: number;
//   private lossRateUsed: string;
//   private lossRate: number;
//   private restorationPlan: any;
//   private emissionFactor: number;
//   private emissionFactorAGB: number;
//   private emissionFactorSOC: number;
//   private emissionFactorUsed: string;
//   constructor(config: {
//     countryCode: string;
//     ecosystem: ECOSYSTEM;
//     activity: ACTIVITY;
//     activitySubType: string;
//     carbonPrice: number;
//     carbonRevenuesToCover: string;
//     baseData: BaseDataView;
//     assumptions: ModelAssumptions;
//     plantingSuccessRate: number;
//     sequestrationRateUsed: SEQUESTRATION_RATE_TIER_TYPES;
//     projectSpecificSequestrationRate: number;
//     projectSpecificLossRate: number;
//     lossRateUsed: string;
//     emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES;
//   }) {
//     this.countryCode = config.countryCode;
//     this.ecosystem = config.ecosystem;
//     this.activity = config.activity;
//     this.activitySubType = config.activitySubType;
//     // We need base size and increase here
//     this.carbonPrice = config.carbonPrice;
//     this.carbonRevenuesToCover = config.carbonRevenuesToCover;
//     this.baseData = config.baseData;
//     this.assumptions = config.assumptions;
//     this.setStartingScalingPoint();
//     this.carbonRevenuesWillNotCover =
//       this.carbonRevenuesToCover === 'Opex' ? 'Opex' : 'Capex';
//     this.plantingSuccessRate = config.plantingSuccessRate;
//     this.setImplementationLabor();
//     this.setSequestrationRate(
//       config.sequestrationRateUsed,
//       config.projectSpecificSequestrationRate,
//     );
//     this.lossRateUsed = config.lossRateUsed;
//     this.projectSpecificLossRate = config.projectSpecificLossRate;
//     //this.setPlantingSuccessRate();
//     this.setLossRate();
//     this.emissionFactorUsed = config.emissionFactorUsed;
//     this.getEmissionFactor();
//     this.restorationPlan = this.initializeRestorationPlan();
//   }
//
//   private setStartingScalingPoint() {
//     // From where do we get this values? Increase? Base Size?
//     if (this.activity === ACTIVITY.RESTORATION) {
//       this.startingScalingPoint =
//         DEFAULT_STUFF.RESTORATION_STARTING_POINT_SCALING;
//     } else {
//       this.startingScalingPoint =
//         DEFAULT_STUFF.CONSERVATION_STARTING_POINT_SCALING;
//     }
//   }
//
//   // private setPlantingSuccessRate() {
//   //   // TODO: In the code this method does not set any value to any property
//   //   if (this.activity != ACTIVITY.RESTORATION) {
//   //     throw new Error(
//   //       'Planting success rate is only available for restoration projects',
//   //     );
//   //   }
//   //   if (this.activitySubType === 'Planting' && !this.plantingSuccessRate) {
//   //     throw new Error(
//   //       'Planting success rate is required for planting projects',
//   //     );
//   //   }
//   // }
//
//   private setImplementationLabor() {
//     if (this.activity === ACTIVITY.CONSERVATION) {
//       this.implmentationLabor = 0;
//       return;
//     }
//     if (this.activitySubType === RESTORATION_ACTIVITY_SUBTYPE.PLANTING) {
//       this.implmentationLabor = this.baseData.implementation_labor_planting;
//     }
//     if (this.activitySubType === RESTORATION_ACTIVITY_SUBTYPE.HYBRID) {
//       this.implmentationLabor = this.baseData.implementation_labor_hybrid;
//     }
//     if (this.activitySubType === RESTORATION_ACTIVITY_SUBTYPE.HYDROLOGY) {
//       this.implmentationLabor = this.baseData.implementation_labor_hydrology;
//     }
//   }
//
//   private setSequestrationRate(
//     sequestrationRateUsed: SEQUESTRATION_RATE_TIER_TYPES,
//     projectSpecificSequestrationRate: number,
//   ) {
//     if (this.activity === ACTIVITY.CONSERVATION) {
//       console.error('Conservation projects do not have sequestration rates');
//       return;
//     }
//     if (sequestrationRateUsed === SEQUESTRATION_RATE_TIER_TYPES.TIER_1) {
//       this.secuestrationRate = this.baseData.tier_1_sequestration_rate;
//     }
//     if (sequestrationRateUsed === SEQUESTRATION_RATE_TIER_TYPES.TIER_2) {
//       this.secuestrationRate = this.baseData.tier_2_sequestration_rate;
//     }
//     if (
//       sequestrationRateUsed !== SEQUESTRATION_RATE_TIER_TYPES.TIER_1 &&
//       sequestrationRateUsed !== SEQUESTRATION_RATE_TIER_TYPES.TIER_2
//     ) {
//       if (!projectSpecificSequestrationRate) {
//         throw new Error(
//           'Project specific sequestration rate is required for Tier 3 sequestration rate',
//         );
//       }
//       this.secuestrationRate = projectSpecificSequestrationRate;
//     }
//   }
//
//   private setLossRate() {
//     if (this.activity !== ACTIVITY.CONSERVATION) {
//       throw new Error('Loss rate is only available for conservation projects');
//     }
//     if (this.lossRateUsed === 'National average') {
//       this.lossRate = this.baseData.ecosystem_loss_rate;
//     } else {
//       if (!this.projectSpecificLossRate) {
//         throw new Error(
//           'Project specific loss rate is required for custom loss rate',
//         );
//       }
//       this.lossRate = this.projectSpecificLossRate;
//     }
//   }
//
//   getEmissionFactor(): void {
//     // TODO
//     if (this.activity !== ACTIVITY.CONSERVATION) {
//       throw new Error(
//         'Emission factor can only be calculated for conservation projects.',
//       );
//     }
//
//     if (this.emissionFactorUsed === 'Tier 1 - Global emission factor') {
//       this.emissionFactor = this.baseData.tier_1_emission_factor;
//     } else if (
//       this.emissionFactorUsed === 'Tier 2 - Country-specific emission factor'
//     ) {
//       this.emissionFactorAGB = this.baseData.emission_factor_agb;
//       this.emissionFactorSOC = this.baseData.emission_factor_soc;
//     }
//   }
//
//   private initializeRestorationPlan(): { [key: number]: number } {
//     const restorationPlan: { [key: number]: number } = {};
//
//     for (let i = 1; i <= 40; i++) {
//       restorationPlan[i] = 0;
//     }
//
//     restorationPlan[-1] = 250;
//
//     return restorationPlan;
//   }
// }
