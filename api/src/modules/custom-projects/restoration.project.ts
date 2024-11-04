import { ACTIVITY } from '@shared/entities/activity.enum';
import {
  RestorationProjectConfig,
  DEFAULT_STUFF,
} from '@api/modules/custom-projects/project-config.interface';
import { BaseDataView } from '@shared/entities/base-data.view';
import { CostInputs } from '@api/modules/custom-projects/cost-inputs.interface';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { RESTORATION_ACTIVITY_SUBTYPE } from '@shared/entities/projects.entity';

export class RestorationProject {
  name: string;
  activity: ACTIVITY.RESTORATION;
  ecosystem: string;
  countryCode: string;
  costInputs: CostInputs;
  modelAssumptions?: ModelAssumptions;
  startingPointScaling: number =
    DEFAULT_STUFF.RESTORATION_STARTING_POINT_SCALING;
  projectSizeHa: number;
  plantingSuccessRate: number;
  carbonPrice: number;
  carbonRevenuesToCover: string;
  carbonRevenuesWillNotCover: string;
  discountRate: number = DEFAULT_STUFF.DISCOUNT_RATE;
  verificationFrequency: number = DEFAULT_STUFF.VERIFICATION_FREQUENCY;
  carbonPriceIncrease: number = DEFAULT_STUFF.CARBON_PRICE_INCREASE;
  restorationRate: number = DEFAULT_STUFF.RESTORATION_RATE;
  buffer: number = DEFAULT_STUFF.BUFFER;
  soilOrganicCarbonReleaseLength: number =
    DEFAULT_STUFF.SOIL_ORGANIC_CARBON_RELEASE_LENGTH;
  restorationProjectLength: number = DEFAULT_STUFF.RESTORATION_PROJECT_LENGTH;
  sequestrationRateUsed?: string;
  projectSpecificSequestrationRate?: number;
  restorationActivity?: string;
  sequestrationRate: number;

  constructor(projectConfig: RestorationProjectConfig) {
    this.name = projectConfig.name;
    this.ecosystem = projectConfig.ecosystem;
    this.countryCode = projectConfig.countryCode;
    this.projectSizeHa = Number(projectConfig.projectSizeHa);
    this.carbonPrice = Number(projectConfig.carbonPrice) || 30;
    this.plantingSuccessRate = projectConfig.plantingSuccessRate;
    this.carbonRevenuesToCover = projectConfig.carbonRevenuesToCover || 'Opex';
    this.carbonRevenuesWillNotCover =
      this.carbonRevenuesToCover === 'Opex' ? 'Capex' : 'None';
    this.restorationActivity = projectConfig.activitySubtype;
    this.initializeCostInputs(projectConfig.inputData);
    this.setImplementationLabor(projectConfig.inputData);
    this.setSequestrationRate(projectConfig.inputData);
    this.setPlantingSuccessRate();
  }

  private initializeCostInputs(baseData: BaseDataView): void {
    this.costInputs = {
      feasibilityAnalysis: Number(baseData.feasibilityAnalysis),
      conservationPlanningAndAdmin: Number(
        baseData.conservationPlanningAndAdmin,
      ),
      dataCollectionAndFieldCost: Number(baseData.dataCollectionAndFieldCost),
      communityRepresentation: Number(baseData.communityRepresentation),
      blueCarbonProjectPlanning: Number(baseData.blueCarbonProjectPlanning),
      establishingCarbonRights: Number(baseData.establishingCarbonRights),
      validation: Number(baseData.validation),
      monitoring: Number(baseData.monitoring),
      maintenance: Number(baseData.maintenance),
      maintenanceDuration: Number(baseData.maintenanceDuration),
      communityBenefitSharingFund: Number(baseData.communityBenefitSharingFund),
      carbonStandardFees: Number(baseData.carbonStandardFees),
      baselineReassessment: Number(baseData.baselineReassessment),
      mrv: Number(baseData.mrv),
      longTermProjectOperating: Number(baseData.longTermProjectOperatingCost),
      financingCost: Number(baseData.financingCost),
      // This is set in the constructor
      implementationLabor: 0,
      projectSizeHa: Number(baseData.projectSizeHa),
      projectDevelopmentType: baseData.otherCommunityCashFlow,
      tier1SequestrationRate: baseData.tier1SequestrationRate,
      tier2SequestrationRate: baseData.tier2SequestrationRate,
    };
  }

  setImplementationLabor(baseData: BaseDataView): void {
    switch (this.restorationActivity) {
      case RESTORATION_ACTIVITY_SUBTYPE.HYBRID:
        this.costInputs.implementationLabor =
          baseData.implementationLaborHybrid;
        break;
      case RESTORATION_ACTIVITY_SUBTYPE.PLANTING:
        this.costInputs.implementationLabor =
          baseData.implementationLaborPlanting;
        break;
      case RESTORATION_ACTIVITY_SUBTYPE.HYDROLOGY:
        this.costInputs.implementationLabor =
          baseData.implementationLaborHydrology;
        break;
    }
  }

  public setSequestrationRate(baseData: BaseDataView): void {
    if (this.activity !== ACTIVITY.RESTORATION) {
      throw new Error(
        'Sequestration rate can only be calculated for restoration projects.',
      );
    }

    if (this.sequestrationRateUsed === 'Tier 1 - IPCC default value') {
      this.sequestrationRate = Number(baseData.tier1SequestrationRate);
    } else if (
      this.sequestrationRateUsed === 'Tier 2 - Country-specific rate'
    ) {
      if (this.ecosystem === 'Mangrove') {
        this.sequestrationRate = Number(baseData.tier2SequestrationRate);
      } else {
        throw new Error(
          'Country-specific sequestration rate is not available for this ecosystem.',
        );
      }
    } else if (
      this.sequestrationRateUsed === 'Tier 3 - Project-specific rate'
    ) {
      if (this.projectSpecificSequestrationRate !== undefined) {
        this.sequestrationRate = this.projectSpecificSequestrationRate;
      } else {
        throw new Error(
          'Project-specific sequestration rate must be provided when "Tier 3 - Project-specific rate" is selected.',
        );
      }
    } else {
      throw new Error('Invalid sequestration rate option selected.');
    }
  }

  // TODO: This is not actually setting any value, check with data
  public setPlantingSuccessRate(): void {
    if (this.activity !== ACTIVITY.RESTORATION) {
      throw new Error(
        'Planting success rate can only be set for restoration projects.',
      );
    }

    if (
      this.restorationActivity === RESTORATION_ACTIVITY_SUBTYPE.PLANTING &&
      this.plantingSuccessRate === undefined
    ) {
      throw new Error(
        'Planting success rate must be provided when "Planting" is selected as the restoration activity.',
      );
    }
  }
}
