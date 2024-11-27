/**
 * @description: Once we understand how the cost is calculated, we might move the common logic to this class, and extend it for each specific project type
 */
import { ConservationProjectInput } from '@api/modules/custom-projects/input-factory/conservation-project.input';
import { RestorationProjectInput } from '@api/modules/custom-projects/input-factory/restoration-project.input';
import { BaseSize } from '@shared/entities/base-size.entity';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import {
  OverridableCostInputs,
  PROJECT_DEVELOPMENT_TYPE,
} from '@api/modules/custom-projects/dto/project-cost-inputs.dto';
import { RevenueProfitCalculator } from '@api/modules/calculations/revenue-profit.calculator';
import { SequestrationRateCalculator } from '@api/modules/calculations/sequestration-rate.calculator';

export type CostPlanMap = {
  [year: number]: number;
};

export type CostPlans = Record<keyof OverridableCostInputs, CostPlanMap>;

// TODO: Strongly type this to bound it to existing types
export enum COST_KEYS {
  FEASIBILITY_ANALYSIS = 'feasibilityAnalysis',
  CONSERVATION_PLANNING_AND_ADMIN = 'conservationPlanningAndAdmin',
  DATA_COLLECTION_AND_FIELD_COST = 'dataCollectionAndFieldCost',
  COMMUNITY_REPRESENTATION = 'communityRepresentation',
  BLUE_CARBON_PROJECT_PLANNING = 'blueCarbonProjectPlanning',
  ESTABLISHING_CARBON_RIGHTS = 'establishingCarbonRights',
  FINANCING_COST = 'financingCost',
  VALIDATION = 'validation',
  MONITORING = 'monitoring',
  BASELINE_REASSESSMENT = 'baselineReassessment',
  MRV = 'mrv',
  LONG_TERM_PROJECT_OPERATING_COST = 'longTermProjectOperatingCost',
  IMPLEMENTATION_LABOR = 'implementationLabor',
  MAINTENANCE = 'maintenance',
}

export type ProjectInput = ConservationProjectInput | RestorationProjectInput;

export class CostCalculator {
  projectInput: ProjectInput;
  defaultProjectLength: number;
  startingPointScaling: number;
  baseSize: BaseSize;
  baseIncrease: BaseIncrease;
  capexTotalCostPlan: CostPlanMap;
  opexTotalCostPlan: CostPlanMap;
  costPlans: CostPlans;
  revenueProfitCalculator: RevenueProfitCalculator;
  sequestrationRateCalculator: SequestrationRateCalculator;
  constructor(
    projectInput: ProjectInput,
    baseSize: BaseSize,
    baseIncrease: BaseIncrease,
  ) {
    this.projectInput = projectInput;
    this.defaultProjectLength = projectInput.assumptions.defaultProjectLength;
    this.startingPointScaling = projectInput.assumptions.startingPointScaling;
    this.baseIncrease = baseIncrease;
    this.baseSize = baseSize;
    this.revenueProfitCalculator = new RevenueProfitCalculator(
      this.projectInput,
    );
    this.sequestrationRateCalculator = new SequestrationRateCalculator(
      this.projectInput,
    );
  }

  initializeCostPlans() {
    this.capexTotalCostPlan = this.initializeTotalCostPlan(
      this.defaultProjectLength,
    );
    this.opexTotalCostPlan = this.initializeTotalCostPlan(
      this.defaultProjectLength,
    );
    return this;
  }

  /**
   * @description: Initialize the cost plan with the default project length, with 0 costs for each year
   * @param defaultProjectLength
   */
  private initializeTotalCostPlan(defaultProjectLength: number): CostPlanMap {
    const costPlan: CostPlanMap = {};
    for (let i = 1; i <= defaultProjectLength; i++) {
      costPlan[i] = 0;
    }
    return costPlan;
  }

  private createSimpleCostPlan(
    totalBaseCost: number,
    years = [-4, -3, -2, -1],
  ) {
    const costPlan: CostPlanMap = {};
    years.forEach((year) => {
      costPlan[year] = totalBaseCost;
    });
    return costPlan;
  }

  private getTotalBaseCost(costType: COST_KEYS): number {
    const baseCost = this.projectInput.costAndCarbonInputs[costType];
    const increasedBy: number = this.baseIncrease[costType];
    const sizeDifference =
      this.projectInput.projectSizeHa - this.startingPointScaling;
    const scalingFactor = Math.max(Math.round(sizeDifference / baseCost), 0);
    const totalBaseCost = baseCost + increasedBy * scalingFactor * baseCost;

    this.throwIfValueIsNotValid(totalBaseCost, costType);
    return totalBaseCost;
  }

  private feasibilityAnalysisCosts() {
    const totalBaseCost = this.getTotalBaseCost(COST_KEYS.FEASIBILITY_ANALYSIS);
    const feasibilityAnalysisCostPlan = this.createSimpleCostPlan(
      totalBaseCost,

      [-4],
    );
    return feasibilityAnalysisCostPlan;
  }

  private conservationPlanningAndAdminCosts() {
    const totalBaseCost = this.getTotalBaseCost(
      COST_KEYS.CONSERVATION_PLANNING_AND_ADMIN,
    );
    const conservationPlanningAndAdminCostPlan = this.createSimpleCostPlan(
      totalBaseCost,
      [-4, -3, -2, -1],
    );
    return conservationPlanningAndAdminCostPlan;
  }

  private dataCollectionAndFieldCosts() {
    const totalBaseCost = this.getTotalBaseCost(
      COST_KEYS.DATA_COLLECTION_AND_FIELD_COST,
    );
    const dataCollectionAndFieldCostPlan = this.createSimpleCostPlan(
      totalBaseCost,
      [-4, -3, -2],
    );
    return dataCollectionAndFieldCostPlan;
  }

  private blueCarbonProjectPlanningCosts() {
    const totalBaseCost = this.getTotalBaseCost(
      COST_KEYS.BLUE_CARBON_PROJECT_PLANNING,
    );
    const blueCarbonProjectPlanningCostPlan = this.createSimpleCostPlan(
      totalBaseCost,
      [-4, -3, -2],
    );
    return blueCarbonProjectPlanningCostPlan;
  }

  private communityRepresentationCosts() {
    const totalBaseCost = this.getTotalBaseCost(
      COST_KEYS.COMMUNITY_REPRESENTATION,
    );
    // TODO: TO avoid type crash, fix after cost calculator has all required inputs
    const projectDevelopmentType = 'Development';
    //  this.projectInput.costInputs.otherCommunityCashFlow;
    const initialCost =
      projectDevelopmentType === PROJECT_DEVELOPMENT_TYPE.DEVELOPMENT
        ? 0
        : totalBaseCost;
    const communityRepresentationCostPlan = this.createSimpleCostPlan(
      totalBaseCost,
      [-4, -3, -2, -1],
    );
    communityRepresentationCostPlan[-4] = initialCost;
    return communityRepresentationCostPlan;
  }

  private establishingCarbonRightsCosts() {
    const totalBaseCost = this.getTotalBaseCost(
      COST_KEYS.ESTABLISHING_CARBON_RIGHTS,
    );
    const establishingCarbonRightsCostPlan = this.createSimpleCostPlan(
      totalBaseCost,
      [-3, -2, -1],
    );
    return establishingCarbonRightsCostPlan;
  }

  private validationCosts() {
    const totalBaseCost = this.getTotalBaseCost(COST_KEYS.VALIDATION);
    const validationCostPlan = this.createSimpleCostPlan(totalBaseCost, [-1]);
    return validationCostPlan;
  }

  private implementationLaborCosts() {
    const baseCost = this.projectInput.costAndCarbonInputs.implementationLabor;
    const areaRestoredOrConservedPlan =
      this.sequestrationRateCalculator.calculateAreaRestoredOrConserved();
    const implementationLaborCostPlan: CostPlanMap = {};
    for (
      let year = -4;
      year <= this.projectInput.assumptions.defaultProjectLength;
      year++
    ) {
      if (year !== 0) {
        implementationLaborCostPlan[year] = 0;
      }
    }

    for (let year = -1; year <= 40; year++) {
      if (year === 0) {
        continue;
      }
      if (year <= this.projectInput.assumptions.projectLength) {
        let laborCost: number;
        if (year - 1 === 0) {
          laborCost =
            baseCost *
            (areaRestoredOrConservedPlan[year] -
              areaRestoredOrConservedPlan[-1]);
        } else {
          laborCost =
            baseCost *
            (areaRestoredOrConservedPlan[year] -
              (areaRestoredOrConservedPlan[year - 1] || 0));
        }
        implementationLaborCostPlan[year] = laborCost;
      }
    }

    return implementationLaborCostPlan;
  }

  private calculateMonitoringCosts() {
    const totalBaseCost = this.getTotalBaseCost(COST_KEYS.MONITORING);
    const monitoringCostPlan: CostPlanMap = {};
    // TODO: How is this plan different from the others?
    for (let year = -4; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        monitoringCostPlan[year] =
          year >= 1 && year <= this.projectInput.assumptions.projectLength
            ? totalBaseCost
            : 0;
      }
    }
    return monitoringCostPlan;
  }

  maintenanceCosts(): { [year: number]: number } {
    const baseCost = this.projectInput.costAndCarbonInputs.maintenance;

    // TODO: Figure out how to sneak this in for the response
    let key: string;
    if (baseCost < 1) {
      key = '% of implementation labor';
    } else {
      key = '$/yr';
    }

    const maintenanceDuration: number =
      this.projectInput.costAndCarbonInputs.maintenanceDuration;

    const implementationLaborCostPlan = this.implementationLaborCosts();

    const findFirstZeroValue = (plan: CostPlanMap): number | null => {
      const years = Object.keys(plan)
        .map(Number)
        .sort((a, b) => a - b);
      for (const year of years) {
        if (plan[year] === 0) {
          return year;
        }
      }
      return null;
    };

    const firstZeroValue = findFirstZeroValue(implementationLaborCostPlan);

    if (firstZeroValue === null) {
      throw new Error(
        'Could not find a first year with 0 value for implementation labor cost',
      );
    }

    const projectSizeHa = this.projectInput.projectSizeHa;
    const restorationRate = this.projectInput.assumptions.restorationRate;
    const defaultProjectLength =
      this.projectInput.assumptions.defaultProjectLength;

    let maintenanceEndYear: number;

    if (projectSizeHa / restorationRate <= 20) {
      maintenanceEndYear = firstZeroValue + maintenanceDuration - 1;
    } else {
      maintenanceEndYear = defaultProjectLength + maintenanceDuration;
    }

    const maintenanceCostPlan: CostPlanMap = {};

    for (
      let year = -4;
      year <= this.projectInput.assumptions.defaultProjectLength;
      year++
    ) {
      if (year !== 0) {
        maintenanceCostPlan[year] = 0;
      }
    }

    const implementationLaborValue = implementationLaborCostPlan[-1];

    for (const yearStr in maintenanceCostPlan) {
      const year = Number(yearStr);
      if (year < 1) {
        continue;
      } else {
        if (year <= this.projectInput.assumptions.defaultProjectLength) {
          if (year <= maintenanceEndYear) {
            if (key === '$/yr') {
              maintenanceCostPlan[year] = baseCost;
            } else {
              const minValue = Math.min(
                year,
                maintenanceEndYear - maintenanceDuration + 1,
                maintenanceEndYear - year + 1,
                maintenanceDuration,
              );
              maintenanceCostPlan[year] =
                baseCost * implementationLaborValue * minValue;
            }
          } else {
            maintenanceCostPlan[year] = 0;
          }
        } else {
          maintenanceCostPlan[year] = 0;
        }
      }
    }

    return maintenanceCostPlan;
  }

  communityBenefitAndSharingCosts(): CostPlanMap {
    const baseCost: number =
      this.projectInput.costAndCarbonInputs.communityBenefitSharingFund;

    const communityBenefitSharingFundCostPlan: CostPlanMap = {};

    for (
      let year = -4;
      year <= this.projectInput.assumptions.defaultProjectLength;
      year++
    ) {
      if (year !== 0) {
        communityBenefitSharingFundCostPlan[year] = 0;
      }
    }

    const estimatedRevenue: CostPlanMap =
      this.revenueProfitCalculator.calculateEstimatedRevenue();

    for (const yearStr in communityBenefitSharingFundCostPlan) {
      const year = Number(yearStr);
      if (year <= this.projectInput.assumptions.projectLength) {
        communityBenefitSharingFundCostPlan[year] =
          estimatedRevenue[year] * baseCost;
      } else {
        communityBenefitSharingFundCostPlan[year] = 0;
      }
    }

    return communityBenefitSharingFundCostPlan;
  }

  carbonStandardFeeCosts(): { [year: number]: number } {
    const baseCost: number =
      this.projectInput.costAndCarbonInputs.carbonStandardFees;

    const carbonStandardFeesCostPlan: CostPlanMap = {};

    for (
      let year = -4;
      year <= this.projectInput.assumptions.defaultProjectLength;
      year++
    ) {
      if (year !== 0) {
        carbonStandardFeesCostPlan[year] = 0;
      }
    }

    const estimatedCreditsIssued: CostPlanMap =
      this.sequestrationRateCalculator.calculateEstCreditsIssued();

    for (const yearStr in carbonStandardFeesCostPlan) {
      const year = Number(yearStr);
      if (year <= -1) {
        carbonStandardFeesCostPlan[year] = 0;
      } else if (year <= this.projectInput.assumptions.projectLength) {
        carbonStandardFeesCostPlan[year] =
          estimatedCreditsIssued[year] * baseCost;
      } else {
        carbonStandardFeesCostPlan[year] = 0;
      }
    }

    return carbonStandardFeesCostPlan;
  }

  baseLineReassessmentCosts(): { [year: number]: number } {
    const baseCost: number =
      this.projectInput.costAndCarbonInputs.baselineReassessment;

    const baselineReassessmentCostPlan: CostPlanMap = {};

    for (
      let year = -4;
      year <= this.projectInput.assumptions.defaultProjectLength;
      year++
    ) {
      if (year !== 0) {
        baselineReassessmentCostPlan[year] = 0;
      }
    }

    for (const yearStr in baselineReassessmentCostPlan) {
      const year = Number(yearStr);

      if (year < -1) {
        baselineReassessmentCostPlan[year] = 0;
      } else if (year === -1) {
        baselineReassessmentCostPlan[year] = baseCost;
      } else if (year <= this.projectInput.assumptions.projectLength) {
        if (
          year / this.projectInput.assumptions.baselineReassessmentFrequency ===
          Math.floor(
            year / this.projectInput.assumptions.baselineReassessmentFrequency,
          )
        ) {
          baselineReassessmentCostPlan[year] =
            baseCost *
            Math.pow(
              1 + this.projectInput.assumptions.annualCostIncrease,
              year,
            );
        } else {
          baselineReassessmentCostPlan[year] = 0;
        }
      } else {
        baselineReassessmentCostPlan[year] = 0;
      }
    }

    return baselineReassessmentCostPlan;
  }

  mrvCosts(): CostPlanMap {
    const baseCost: number = this.projectInput.costAndCarbonInputs.mrv;

    const mrvCostPlan: CostPlanMap = {};

    for (
      let year = -4;
      year <= this.projectInput.assumptions.defaultProjectLength;
      year++
    ) {
      if (year !== 0) {
        mrvCostPlan[year] = 0;
      }
    }

    for (const yearStr in mrvCostPlan) {
      const year = Number(yearStr);

      if (year <= -1) {
        mrvCostPlan[year] = 0;
      } else if (year <= this.projectInput.assumptions.projectLength) {
        if (
          year / this.projectInput.assumptions.verificationFrequency ===
          Math.floor(year / this.projectInput.assumptions.verificationFrequency)
        ) {
          mrvCostPlan[year] =
            baseCost *
            Math.pow(
              1 + this.projectInput.assumptions.annualCostIncrease,
              year,
            );
        } else {
          mrvCostPlan[year] = 0;
        }
      } else {
        mrvCostPlan[year] = 0;
      }
    }

    return mrvCostPlan;
  }

  longTermProjectOperatingCosts(): CostPlanMap {
    const baseSize: number = this.baseSize.longTermProjectOperatingCost;

    if (baseSize === 0) {
      throw new Error('Base size cannot be 0 to avoid division errors');
    }

    const baseCost: number =
      this.projectInput.costAndCarbonInputs.longTermProjectOperatingCost;

    const increasedBy = this.baseIncrease.longTermProjectOperatingCost;
    const startingPointScaling =
      this.projectInput.assumptions.startingPointScaling;

    let totalBaseCostAdd: number;

    if (
      (this.projectInput.projectSizeHa -
        this.projectInput.assumptions.startingPointScaling) /
        baseSize <
      1
    ) {
      totalBaseCostAdd = 0;
    } else {
      totalBaseCostAdd = Math.round(
        (this.projectInput.projectSizeHa - startingPointScaling) / baseSize,
      );
    }

    const totalBaseCost: number =
      baseCost + totalBaseCostAdd * increasedBy * baseCost;

    const longTermProjectOperatingCostPlan: CostPlanMap = {};

    for (
      let year = -4;
      year <= this.projectInput.assumptions.defaultProjectLength;
      year++
    ) {
      if (year !== 0) {
        longTermProjectOperatingCostPlan[year] = 0;
      }
    }

    for (const yearStr in longTermProjectOperatingCostPlan) {
      const year = Number(yearStr);

      if (year <= -1) {
        longTermProjectOperatingCostPlan[year] = 0;
      } else if (year <= this.projectInput.assumptions.projectLength) {
        longTermProjectOperatingCostPlan[year] = totalBaseCost;
      } else {
        longTermProjectOperatingCostPlan[year] = 0;
      }
    }

    return longTermProjectOperatingCostPlan;
  }

  private throwIfValueIsNotValid(value: number, costKey: COST_KEYS): void {
    if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
      console.error(
        `Invalid number: ${value} produced for ${costKey}: Setting to 0 for development`,
      );
      value = 12345;
    }
  }

  calculateCosts() {
    this.costPlans = {
      feasibilityAnalysis: this.feasibilityAnalysisCosts(),
      conservationPlanningAndAdmin: this.conservationPlanningAndAdminCosts(),
      dataCollectionAndFieldCost: this.dataCollectionAndFieldCosts(),
      blueCarbonProjectPlanning: this.blueCarbonProjectPlanningCosts(),
      communityRepresentation: this.communityRepresentationCosts(),
      establishingCarbonRights: this.establishingCarbonRightsCosts(),
      validation: this.validationCosts(),
      implementationLabor: this.implementationLaborCosts(),
      monitoring: this.calculateMonitoringCosts(),
      maintenance: this.maintenanceCosts(),
      communityBenefitSharingFund: this.communityBenefitAndSharingCosts(),
      carbonStandardFees: this.carbonStandardFeeCosts(),
      baselineReassessment: this.baseLineReassessmentCosts(),
      mrv: this.mrvCosts(),
      longTermProjectOperatingCost: this.longTermProjectOperatingCosts(),
      // Financing cost is calculated using total capex which is calculated in the summary generator
      financingCost: null,
    };
    return this.costPlans;
  }
}
