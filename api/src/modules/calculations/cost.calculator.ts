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
import { sum } from 'lodash';

export type CostPlanMap = {
  [year: number]: number;
};

export type CostPlans = Record<
  keyof OverridableCostInputs | string,
  CostPlanMap
>;

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
  totalCapexNPV: number;
  totalOpexNPV: number;
  totalNPV: number;
  revenueProfitCalculator: RevenueProfitCalculator;
  sequestrationRateCalculator: SequestrationRateCalculator;
  constructor(
    projectInput: ProjectInput,
    baseSize: BaseSize,
    baseIncrease: BaseIncrease,
    sequestrationRateCalculator: SequestrationRateCalculator,
  ) {
    this.projectInput = projectInput;
    this.defaultProjectLength = projectInput.assumptions.defaultProjectLength;
    this.startingPointScaling = projectInput.assumptions.startingPointScaling;
    this.baseIncrease = baseIncrease;
    this.baseSize = baseSize;
    this.revenueProfitCalculator = new RevenueProfitCalculator(
      this.projectInput,
    );
    this.sequestrationRateCalculator = sequestrationRateCalculator;
  }

  initializeCostPlans() {
    this.capexTotalCostPlan = this.initializeTotalCostPlan(
      this.defaultProjectLength,
    );
    this.opexTotalCostPlan = this.initializeTotalCostPlan(
      this.defaultProjectLength,
    );
    this.calculateCostPlans();
    this.calculateCapexTotalPlan();
    this.calculateOpexTotalPlan();
    const totalCapex = sum(Object.values(this.capexTotalCostPlan));
    const totalCapexNPV = this.calculateNpv(
      this.capexTotalCostPlan,
      this.projectInput.assumptions.discountRate,
    );
    const totalOpex = sum(Object.values(this.opexTotalCostPlan));
    const totalOpexNPV = this.calculateNpv(
      this.opexTotalCostPlan,
      this.projectInput.assumptions.discountRate,
    );
    const totalNPV = totalCapexNPV + totalOpexNPV;
    const estimatedRevenuePlan =
      this.revenueProfitCalculator.calculateEstimatedRevenuePlan();
    const totalRevenue = sum(Object.values(estimatedRevenuePlan));
    const totalRevenueNPV = this.calculateNpv(
      estimatedRevenuePlan,
      this.projectInput.assumptions.discountRate,
    );
    const creditsIssuedPlan =
      this.sequestrationRateCalculator.calculateEstCreditsIssuedPlan();
    const totalCreditsIssued = sum(Object.values(creditsIssuedPlan));
    const costPerTCO2e =
      totalCreditsIssued != 0 ? totalCapex / totalCreditsIssued : 0;
    const costPerHa = totalNPV / this.projectInput.projectSizeHa;
    const npvCoveringCosts =
      this.projectInput.carbonRevenuesToCover === 'Opex'
        ? totalRevenueNPV - totalOpexNPV
        : totalRevenueNPV - totalNPV;
    const financingCost =
      this.projectInput.costAndCarbonInputs.financingCost * totalCapex;
    const fundingGapNPV = npvCoveringCosts < 0 ? npvCoveringCosts * -1 : 0;
    const fundingGapPerTCO2e =
      totalCreditsIssued != 0 ? fundingGapNPV / totalCreditsIssued : 0;
    const totalCommunityBenefitSharingFundNPV = this.calculateNpv(
      this.costPlans.communityBenefitSharingFund,
      this.projectInput.assumptions.discountRate,
    );
    const totalCommunityBenefitSharingFund =
      totalRevenueNPV === 0
        ? 0
        : totalCommunityBenefitSharingFundNPV / totalRevenueNPV;
    // return {
    //   costPlans: this.costPlans,
    //   capexTotalCostPlan: this.capexTotalCostPlan,
    //   opexTotalCostPlan: this.opexTotalCostPlan,
    // };
    const npvToUse =
      this.projectInput.carbonRevenuesToCover === 'Opex'
        ? totalOpexNPV
        : totalNPV;
    const fundingGap = this.calculateFundingGap(npvToUse, totalRevenueNPV);
    return {
      fundingGap,
    };
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
      this.revenueProfitCalculator.calculateEstimatedRevenuePlan();

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
      this.sequestrationRateCalculator.calculateEstCreditsIssuedPlan();

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

  calculateNpv(
    costPlan: CostPlanMap,
    discountRate: number,
    actualYear: number = -4,
  ): number {
    let npv = 0;

    for (const yearStr in costPlan) {
      const year = Number(yearStr);
      const cost = costPlan[year];

      if (year === actualYear) {
        npv += cost;
      } else if (year > 0) {
        npv += cost / Math.pow(1 + discountRate, year + (-actualYear - 1));
      } else {
        npv += cost / Math.pow(1 + discountRate, -actualYear + year);
      }
    }

    return npv;
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
    this.totalCapexNPV = this.calculateNpv(
      this.opexTotalCostPlan,
      this.projectInput.assumptions.discountRate,
    );
    this.totalOpexNPV = this.calculateNpv(
      this.opexTotalCostPlan,
      this.projectInput.assumptions.discountRate,
    );
    this.totalNPV = this.totalCapexNPV + this.totalOpexNPV;
    const totalCapex = sum(Object.values(this.capexTotalCostPlan));
    const totalOpex = sum(Object.values(this.opexTotalCostPlan));
    const estimatedRevenue =
      this.revenueProfitCalculator.calculateEstimatedRevenuePlan();
    const totalRevenue = sum(Object.values(estimatedRevenue));
    const totalRevenueNPV = this.calculateNpv(
      estimatedRevenue,
      this.projectInput.assumptions.discountRate,
    );
    const totalCreditsPlan =
      this.sequestrationRateCalculator.calculateEstCreditsIssuedPlan();
    const creditsIssued = sum(Object.values(totalCreditsPlan));
    const costPerTCO2e = creditsIssued != 0 ? totalCapex / creditsIssued : 0;
    const costPerHa = this.totalNPV / this.projectInput.projectSizeHa;
    const npvCoveringCosts =
      this.projectInput.carbonRevenuesToCover === 'Opex'
        ? totalRevenueNPV - this.totalOpexNPV
        : totalRevenueNPV - this.totalNPV;
    const financingCost =
      this.projectInput.costAndCarbonInputs.financingCost * totalCapex;
    const fundingGapNPV = npvCoveringCosts < 0 ? npvCoveringCosts * -1 : 0;
    const funding_gap_per_tco2_NPV =
      creditsIssued != 0 ? fundingGapNPV / creditsIssued : 0;
    const total_community_benefit_sharing_fund_NPV = this.calculateNpv(
      this.costPlans.communityBenefitSharingFund,
      this.projectInput.assumptions.discountRate,
    );
    const community_benefit_sharing_fund =
      totalRevenueNPV === 0
        ? 0
        : total_community_benefit_sharing_fund_NPV / totalRevenueNPV;
    const referenceNPV =
      this.projectInput.carbonRevenuesToCover === 'Opex'
        ? this.totalOpexNPV
        : this.totalNPV;
    const funding_gap = this.calculateFundingGap(referenceNPV, totalRevenueNPV);
    const IRR_opex = this.calculateIrr(
      this.revenueProfitCalculator.calculateAnnualNetCashFlow(
        this.capexTotalCostPlan,
        this.opexTotalCostPlan,
      ),
      this.revenueProfitCalculator.calculateAnnualNetIncome(
        this.capexTotalCostPlan,
      ),
      false,
    );
    const IRR_total_cost = this.calculateIrr(
      this.revenueProfitCalculator.calculateAnnualNetCashFlow(
        this.capexTotalCostPlan,
        this.opexTotalCostPlan,
      ),
      this.revenueProfitCalculator.calculateAnnualNetIncome(
        this.capexTotalCostPlan,
      ),
      true,
    );

    return {
      costPlans: this.costPlans,
      rest: {
        financingCost,
        totalCapex,
        totalOpex,
        totalNPV: this.totalNPV,
        totalCapexNPV: this.totalCapexNPV,
        totalOpexNPV: this.totalOpexNPV,
        totalRevenueNPV,
        creditsIssued,
        costPerTCO2e,
        costPerHa,
        npvCoveringCosts,
        fundingGapNPV,
        funding_gap_per_tco2_NPV,
        total_community_benefit_sharing_fund_NPV,
        community_benefit_sharing_fund,
        referenceNPV,
        funding_gap,
        IRR_opex,
        IRR_total_cost,
        totalRevenue,
      },
    };
  }

  calculateCapexTotalPlan() {
    const costs = [
      this.costPlans.feasibilityAnalysis,
      this.costPlans.conservationPlanningAndAdmin,
      this.costPlans.dataCollectionAndFieldCost,
      this.costPlans.blueCarbonProjectPlanning,
      this.costPlans.communityRepresentation,
      this.costPlans.establishingCarbonRights,
      this.costPlans.validation,
      this.costPlans.implementationLabor,
    ];
    for (const cost of costs) {
      this.aggregateCosts(cost, this.capexTotalCostPlan);
    }
    return this;
  }

  calculateOpexTotalPlan() {
    const costs = [
      this.costPlans.monitoring,
      this.costPlans.maintenance,
      this.costPlans.communityBenefitSharingFund,
      this.costPlans.carbonStandardFees,
      this.costPlans.baselineReassessment,
      this.costPlans.mrv,
      this.costPlans.longTermProjectOperatingCost,
    ];
    for (const cost of costs) {
      this.aggregateCosts(cost, this.opexTotalCostPlan);
    }
    return this;
  }

  aggregateCosts(
    costPlan: CostPlanMap,
    totalCostPlan: CostPlanMap,
  ): CostPlanMap {
    for (const year in costPlan) {
      if (totalCostPlan[year] === undefined) {
        totalCostPlan[year] = 0;
      }
      totalCostPlan[year] += costPlan[year];
    }
    return totalCostPlan;
  }
  calculateFundingGap(referenceNpv: number, totalRevenueNpv: number): number {
    const value = totalRevenueNpv - referenceNpv;
    const fundingGap = value > 0 ? 0 : value * -1;
    return fundingGap;
  }

  calculateIrr(
    netCashFlow: CostPlanMap,
    netIncome: CostPlanMap,
    useCapex: boolean = false,
  ): number {
    const cashFlowArray = useCapex
      ? Object.values(netCashFlow)
      : Object.values(netIncome);

    const calculateIrrFromCashFlows = (cashFlows: number[]): number => {
      const guess = 0.1;
      const maxIterations = 1000;
      const precision = 1e-6;

      let irr = guess;
      for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let npvDerivative = 0;

        for (let t = 0; t < cashFlows.length; t++) {
          npv += cashFlows[t] / Math.pow(1 + irr, t);
          npvDerivative -= (t * cashFlows[t]) / Math.pow(1 + irr, t + 1);
        }

        const newIrr = irr - npv / npvDerivative;
        if (Math.abs(newIrr - irr) < precision) {
          return newIrr;
        }
        irr = newIrr;
      }

      console.error('IRR calculation did not converge');
    };

    return calculateIrrFromCashFlows(cashFlowArray);
  }

  calculateCostPlans(): this {
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
    };
    return this;
  }

  // communityBenefitSharingFundPlan():CostPlanMap {
  //
  //   const baseCost: number = this.projectInput.costAndCarbonInputs.communityBenefitSharingFund
  //
  //
  //   let communityBenefitSharingFundCostPlan: CostPlanMap = {};
  //   for (let year = -4; year <= this.projectInput.assumptions.defaultProjectLength; year++) {
  //     if (year !== 0) {
  //       communityBenefitSharingFundCostPlan[year] = 0;
  //     }
  //   }
  //
  //   const estimatedRevenuePlan: CostPlanMap = this.revenueProfitCalculator.calculateEstimatedRevenuePlan();
  //
  //
  //   for (const year in communityBenefitSharingFundCostPlan) {
  //     const yearNum = Number(year);
  //     if (yearNum <= this.projectInput.assumptions.projectLength) {
  //       communityBenefitSharingFundCostPlan[yearNum] =
  //           estimatedRevenuePlan[yearNum] * baseCost;
  //     } else {
  //       communityBenefitSharingFundCostPlan[yearNum] = 0;
  //     }
  //   }
  //
  //   return communityBenefitSharingFundCostPlan;
  // }
}
