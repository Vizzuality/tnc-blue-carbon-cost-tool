import { ACTIVITY } from '@shared/entities/activity.enum';
import {
  ConservationProjectConfig,
  DEFAULT_STUFF,
} from '@api/modules/custom-projects/project-config.interface';
import { BaseDataView } from '@shared/entities/base-data.view';
import { CostInputs } from '@api/modules/custom-projects/cost-inputs.interface';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';

export class ConservationProject {
  name: string;
  activity: ACTIVITY.CONSERVATION;
  ecosystem: string;
  countryCode: string;
  costInputs: CostInputs;
  modelAssumptions?: ModelAssumptions;
  startingPointScaling: number =
    DEFAULT_STUFF.CONSERVATION_STARTING_POINT_SCALING;
  projectSizeHa: number;
  carbonPrice: number;
  carbonRevenuesToCover: string;
  carbonRevenuesWillNotCover: string;
  discountRate: number = DEFAULT_STUFF.DISCOUNT_RATE;
  verificationFrequency: number = DEFAULT_STUFF.VERIFICATION_FREQUENCY;
  carbonPriceIncrease: number = DEFAULT_STUFF.CARBON_PRICE_INCREASE;
  buffer: number = DEFAULT_STUFF.BUFFER;
  projectSpecificLossRate?: number;
  emissionFactorUsed: string;
  emissionFactor?: number;
  emissionFactorAGB?: number;
  emissionFactorSOC?: number;
  tier3ProjectSpecificEmission?: string;
  tier3ProjectSpecificEmissionOneFactor?: number;
  tier3EmissionFactorAGB?: number;
  tier3EmissionFactorSOC?: number;
  conservationProjectLength: number = DEFAULT_STUFF.CONSERVATION_PROJECT_LENGTH;
  lossRate?: number;

  constructor(projectConfig: ConservationProjectConfig) {
    this.name = projectConfig.name;
    this.ecosystem = projectConfig.ecosystem;
    this.countryCode = projectConfig.countryCode;
    this.projectSizeHa = projectConfig.projectSizeHa;
    this.carbonPrice = projectConfig.carbonPrice || 30;
    this.carbonRevenuesToCover = projectConfig.carbonRevenuesToCover || 'Opex';
    this.carbonRevenuesWillNotCover =
      this.carbonRevenuesToCover === 'Opex' ? 'Capex' : 'None';
    this.lossRate = this.setLossRate(projectConfig.inputData);
    this.emissionFactorUsed = projectConfig.emissionFactorUsed;
    this.tier3ProjectSpecificEmission =
      projectConfig.tier3ProjectSpecificEmission;
    this.tier3ProjectSpecificEmissionOneFactor =
      projectConfig.tier3ProjectSpecificEmissionOneFactor;
    this.tier3EmissionFactorAGB = projectConfig.tier3EmissionFactorAGB;
    this.tier3EmissionFactorSOC = projectConfig.tier3EmissionFactorSOC;
    this.initializeCostInputs(projectConfig.inputData);
    this.setEmissionFactor(projectConfig.inputData);
  }

  private initializeCostInputs(baseData: BaseDataView): void {
    this.costInputs = {
      feasibilityAnalysis: baseData.feasibilityAnalysis,
      conservationPlanningAndAdmin: baseData.conservationPlanningAndAdmin,
      dataCollectionAndFieldCost: baseData.dataCollectionAndFieldCost,
      communityRepresentation: baseData.communityRepresentation,
      blueCarbonProjectPlanning: baseData.blueCarbonProjectPlanning,
      establishingCarbonRights: baseData.establishingCarbonRights,
      validation: baseData.validation,
      monitoring: baseData.monitoring,
      maintenance: baseData.maintenance,
      communityBenefitSharingFund: baseData.communityBenefitSharingFund,
      carbonStandardFees: baseData.carbonStandardFees,
      baselineReassessment: baseData.baselineReassessment,
      mrv: baseData.mrv,
      longTermProjectOperating: baseData.longTermProjectOperatingCost,
      financingCost: baseData.financingCost,
      implementationLabor: 0, // It's set to 0 for Conservation projects
      // TODO: Not sure if the below 2 properties are cost inputs
      lossRate: this.setLossRate(baseData),
      projectSizeHa: baseData.projectSizeHa,
      //emissionFactor: this.setEmissionFactor(baseData),
    };
  }

  private setLossRate(inputData: BaseDataView): number {
    if (this.projectSpecificLossRate) {
      return this.projectSpecificLossRate;
    } else {
      return inputData.ecosystemLossRate;
    }
  }

  // TODO: Not sure if emission factor are cost inputs, and if we need all different types of emission factors (AGB, SOC, etc.)
  private setEmissionFactor(inputData: BaseDataView): void {
    if (this.emissionFactorUsed === 'Tier 1 - Global emission factor') {
      this.emissionFactor = inputData.tier1EmissionFactor;
    } else if (
      this.emissionFactorUsed === 'Tier 2 - Country-specific emission factor'
    ) {
      this.emissionFactorAGB = inputData.emissionFactorAgb;
      this.emissionFactorSOC = inputData.emissionFactorSoc;
    } else if (
      this.emissionFactorUsed === 'Tier 3 - Project specific emission factor'
    ) {
      if (this.tier3ProjectSpecificEmission === 'One emission factor') {
        if (this.tier3ProjectSpecificEmissionOneFactor !== undefined) {
          this.emissionFactor = this.tier3ProjectSpecificEmissionOneFactor;
          this.emissionFactorAGB = 0;
          this.emissionFactorSOC = 0;
        } else {
          throw new Error(
            'Tier 3 project-specific emission factor must be provided.',
          );
        }
      } else if (
        this.tier3ProjectSpecificEmission === 'AGB and SOC separately'
      ) {
        if (
          this.tier3EmissionFactorAGB !== undefined &&
          this.tier3EmissionFactorSOC !== undefined
        ) {
          this.emissionFactorAGB = this.tier3EmissionFactorAGB;
          this.emissionFactorSOC = this.tier3EmissionFactorSOC;
        } else {
          throw new Error(
            'Tier 3 emission factors for AGB and SOC must be provided.',
          );
        }
      } else {
        throw new Error('Invalid Tier 3 emission factor option selected.');
      }
    } else {
      throw new Error('Invalid emission factor used option selected.');
    }
  }

  // TODO: Implement getProjectParameters, if later we see that is usefull
}
