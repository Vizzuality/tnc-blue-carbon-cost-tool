import { ConservationProject } from '@api/modules/custom-projects/conservation.project';
import { DEFAULT_STUFF } from '@api/modules/custom-projects/project-config.interface';
import { CostCalculator } from '@api/modules/calculations/cost.calculator';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import { BaseSize } from '@shared/entities/base-size.entity';

export class ConservationCostCalculator extends CostCalculator {
  project: ConservationProject;
  // TODO: Project length and starting point scaling depend on the activity and it seems to only be used in the calculation, so we can probably remove it from project instantiation
  conservationProjectLength: number = DEFAULT_STUFF.CONSERVATION_PROJECT_LENGTH;
  startingPointScaling: number =
    DEFAULT_STUFF.CONSERVATION_STARTING_POINT_SCALING;
  defaultProjectLength: number = DEFAULT_STUFF.DEFAULT_PROJECT_LENGTH;
  restorationRate: number = DEFAULT_STUFF.RESTORATION_RATE;
  discountRate: number = DEFAULT_STUFF.DISCOUNT_RATE;
  // TODO: Maybe instead of using capexTotal and opexTotal, we can use just totalCostPlan if the only difference is the type of cost
  baselineReassessmentFrequency: number =
    DEFAULT_STUFF.BASELINE_REASSESSMENT_FREQUENCY;
  capexTotalCostPlan: { [year: number]: number } = {};
  opexTotalCostPlan: { [year: number]: number } = {};
  totalCostPlan: { [year: number]: number } = {};
  totalCapex: number;
  totalCapexNPV: number;
  totalOpexNPV: number;
  totalNPV: number;
  baseIncrease: BaseIncrease;
  baseSize: BaseSize;
  constructor(
    project: ConservationProject,
    baseIncrease: BaseIncrease,
    baseSize: BaseSize,
  ) {
    super();
    this.project = project;
    this.baseIncrease = baseIncrease;
    this.baseSize = baseSize;
    this.capexTotalCostPlan = this.initializeCostPlan();
    this.opexTotalCostPlan = this.initializeCostPlan();
    this.totalCostPlan = this.initializeCostPlan();
    this.calculateCapexTotal();
    this.calculateOpexTotal();
    this.totalCapex = Object.values(this.capexTotalCostPlan).reduce(
      (sum, value) => sum + value,
      0,
    );
    this.totalCapexNPV = this.calculateNPV(
      this.capexTotalCostPlan,
      this.discountRate,
    );
    this.totalOpexNPV = this.calculateNPV(
      this.opexTotalCostPlan,
      this.discountRate,
    );
    this.totalNPV = this.totalCapexNPV + this.totalOpexNPV;
  }

  private initializeCostPlan(): { [year: number]: number } {
    const costPlan: { [year: number]: number } = {};
    for (let i = -4; i <= this.defaultProjectLength; i++) {
      if (i !== 0) {
        costPlan[i] = 0;
      }
    }
    return costPlan;
  }

  // TODO: CAPEX TOTAL
  private calculateCapexTotal(): { [year: number]: number } {
    const costFunctions = [
      this.calculateFeasibilityAnalysisCost,
      this.calculateConservationPlanningAndAdmin,
      this.calculateDataCollectionAndFieldCost,
      this.calculateCommunityRepresentation,
      this.calculateBlueCarbonProjectPlanning,
      this.calculateEstablishingCarbonRights,
      this.calculateValidation,
      this.calculateImplementationLabor,
    ];

    for (const costFunc of costFunctions) {
      const costPlan = costFunc.call(this);
      this.aggregateCosts(costPlan, this.capexTotalCostPlan);
    }

    return this.capexTotalCostPlan;
  }

  private calculateFeasibilityAnalysisCost(): { [year: number]: number } {
    const totalBaseCost = this.calculateCostPlan('feasibilityAnalysis');
    const feasibilityAnalysisCostPlan = this.createSimplePlan(totalBaseCost, [
      -4,
    ]);
    return feasibilityAnalysisCostPlan;
  }

  private calculateConservationPlanningAndAdmin(): { [year: number]: number } {
    const totalBaseCost = this.calculateCostPlan(
      'conservationPlanningAndAdmin',
    );
    const conservationPlanningAndAdminCostPlan = this.createSimplePlan(
      totalBaseCost,
      [-4, -3, -2, -1],
    );
    return conservationPlanningAndAdminCostPlan;
  }

  private calculateDataCollectionAndFieldCost(): { [year: number]: number } {
    const totalBaseCost = this.calculateCostPlan('dataCollectionAndFieldCost');
    const dataCollectionAndFieldCostPlan = this.createSimplePlan(
      totalBaseCost,
      [-4, -3, -2],
    );
    return dataCollectionAndFieldCostPlan;
  }

  private calculateCommunityRepresentation(): { [year: number]: number } {
    const totalBaseCost = this.calculateCostPlan('communityRepresentation');
    const projectDevelopmentType =
      this.project.costInputs.projectDevelopmentType;
    const initialCostPlan =
      projectDevelopmentType === 'Development' ? totalBaseCost : 0;
    const communityRepresentationCostPlan = this.createSimplePlan(
      totalBaseCost,
      [-4, -3, -2],
    );
    communityRepresentationCostPlan[-4] = initialCostPlan;
    return communityRepresentationCostPlan;
  }

  private calculateBlueCarbonProjectPlanning(): { [year: number]: number } {
    const totalBaseCost = this.calculateCostPlan('blueCarbonProjectPlanning');
    const blueCarbonProjectPlanningCostPlan = this.createSimplePlan(
      totalBaseCost,
      [-1],
    );
    return blueCarbonProjectPlanningCostPlan;
  }

  private calculateEstablishingCarbonRights(): { [year: number]: number } {
    const totalBaseCost = this.calculateCostPlan('establishingCarbonRights');
    const establishingCarbonRightsCostPlan = this.createSimplePlan(
      totalBaseCost,
      [-3, -2, -1],
    );
    return establishingCarbonRightsCostPlan;
  }

  private calculateValidation(): { [year: number]: number } {
    const totalBaseCost = this.calculateCostPlan('validation');
    const validationCostPlan = this.createSimplePlan(totalBaseCost, [-1]);
    return validationCostPlan;
  }

  private calculateImplementationLabor(): { [year: number]: number } {
    // TODO: This needs SequestrationCreditsCalculator to be implemented
    const totalBaseCost = this.project.costInputs.implementationLabor;
    return totalBaseCost as any;
    // const implementationLaborCostPlan = this.createSimplePlan(totalBaseCost, [
    //   -1,
    // ]);
    // return implementationLaborCostPlan;
  }

  // TODO: OPEX TOTAL COST CALCULATION
  private calculateOpexTotal(): { [year: number]: number } {
    const costFunctions = [
      this.calculateMonitoring,
      this.calculateMaintenance,
      this.calculateCommunityBenefitSharingFund,
      this.calculateCarbonStandardFees,
      this.calculateBaselineReassessment,
      this.calculateMRV,
      this.calculateLongTermProjectOperating,
    ];

    for (const costFunc of costFunctions) {
      try {
        const costPlan = costFunc.call(this);
        this.aggregateCosts(costPlan, this.opexTotalCostPlan);
      } catch (error) {
        console.error(`Error calculating ${costFunc.name}`);
      }
    }

    return this.opexTotalCostPlan;
  }

  private calculateMonitoring(): { [year: number]: number } {
    const totalBaseCost = this.calculateCostPlan('monitoring');
    const monitoringCostPlan: { [year: number]: number } = {};

    for (let year = -4; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        monitoringCostPlan[year] =
          year >= 1 && year <= this.defaultProjectLength ? totalBaseCost : 0;
      }
    }

    return monitoringCostPlan;
  }

  private calculateMaintenance(): { [year: number]: number } {
    const baseCost = this.project.costInputs.maintenance;
    const maintenanceDuration = this.project.costInputs.maintenanceDuration;
    const implementationLaborCostPlan = this.calculateImplementationLabor();
    // TODO: Should I get the first year where value is 0 where key is greater or equal than 1?
    const firstZeroValue = Number(
      Object.keys(implementationLaborCostPlan).find((key) => {
        return implementationLaborCostPlan[key] === 0 && Number(key) >= 1;
      }),
    );
    let maintenanceEndYear: number;
    if (this.project.costInputs.projectSizeHa / this.restorationRate <= 20) {
      maintenanceEndYear = firstZeroValue + maintenanceDuration - 1;
    } else {
      maintenanceEndYear = this.defaultProjectLength + maintenanceDuration;
    }
    const maintenanceCostPlan: { [year: number]: number } = {};

    // Initialize the cost plan with zeros
    for (let year = -4; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        maintenanceCostPlan[year] = 0;
      }
    }
    // For Conservation projects, apply the base cost over the project length
    for (let year = 1; year <= this.conservationProjectLength; year++) {
      if (year <= maintenanceEndYear) {
        maintenanceCostPlan[year] = baseCost;
      }
    }

    return maintenanceCostPlan;
  }

  private calculateCommunityBenefitSharingFund(): { [year: number]: number } {
    const baseCost = this.project.costInputs.communityBenefitSharingFund;
    const communityBenefitSharingFundCostPlan: { [year: number]: number } = {};

    for (let year = -4; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        communityBenefitSharingFundCostPlan[year] = 0;
      }
    }
    // TODO: This needs RevenueProfitCalculator to be implemented

    // const estimatedRevenue: { [year: number]: number } =
    //   this.revenueProfitCalculator?.calculateEstRevenue() || {};
    //
    // for (const year in communityBenefitSharingFundCostPlan) {
    //   if (+year <= this.projectLength) {
    //     communityBenefitSharingFundCostPlan[+year] =
    //       (estimatedRevenue[+year] || 0) * baseCost;
    //   }
    // }

    return communityBenefitSharingFundCostPlan;
  }

  private calculateCarbonStandardFees(): { [year: number]: number } {
    const baseCost = this.project.costInputs.carbonStandardFees;
    const carbonStandardFeesCostPlan: { [year: number]: number } = {};

    for (let year = -4; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        carbonStandardFeesCostPlan[year] = 0;
      }
    }

    // TODO: This needs SequestrationCreditsCalculator to be implemented
    // const estimatedCreditsIssued: { [year: number]: number } =
    //   this.sequestrationCreditsCalculator?.calculateEstCreditsIssued() || {};
    //
    // for (let year = 1; year <= this.conservationProjectLength; year++) {
    //   carbonStandardFeesCostPlan[year] =
    //     (estimatedCreditsIssued[year] || 0) * baseCost;
    // }

    return carbonStandardFeesCostPlan;
  }

  private calculateBaselineReassessment(): { [year: number]: number } {
    const baseCost = this.project.costInputs.baselineReassessment;
    const baselineReassessmentCostPlan: { [year: number]: number } = {};

    for (let year = -4; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        baselineReassessmentCostPlan[year] = 0;
      }
    }

    for (let year = 1; year <= this.conservationProjectLength; year++) {
      if (year % this.baselineReassessmentFrequency === 0) {
        baselineReassessmentCostPlan[year] = baseCost;
      }
    }

    return baselineReassessmentCostPlan;
  }

  private calculateMRV(): { [year: number]: number } {
    const baseCost = this.project.costInputs.mrv;
    const mrvCostPlan: { [year: number]: number } = {};

    for (let year = -4; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        mrvCostPlan[year] = 0;
      }
    }

    for (let year = 1; year <= this.conservationProjectLength; year++) {
      if (year % this.project.verificationFrequency === 0) {
        mrvCostPlan[year] = baseCost;
      }
    }

    return mrvCostPlan;
  }

  private calculateLongTermProjectOperating(): { [year: number]: number } {
    const baseCost = this.project.costInputs.longTermProjectOperating;
    const longTermProjectOperatingCostPlan: { [year: number]: number } = {};

    for (let year = -4; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        longTermProjectOperatingCostPlan[year] = 0;
      }
    }

    for (let year = 1; year <= this.conservationProjectLength; year++) {
      longTermProjectOperatingCostPlan[year] = baseCost;
    }

    return longTermProjectOperatingCostPlan;
  }

  private aggregateCosts(
    costPlan: { [year: number]: number },
    totalCostPlan: { [year: number]: number },
  ): void {
    for (const yearStr of Object.keys(costPlan)) {
      const year = Number(yearStr);
      totalCostPlan[year] += costPlan[year];
    }
  }

  private calculateCostPlan(baseKey: any): number {
    const increasedBy: number = parseFloat(this.baseIncrease[baseKey]);
    const baseCostValue: number = parseFloat(this.baseSize[baseKey]);
    const sizeDifference =
      this.project.projectSizeHa - this.startingPointScaling;
    const value = Math.max(Math.round(sizeDifference / baseCostValue), 0);

    const totalBaseCost = baseCostValue + increasedBy * value * baseCostValue;
    return totalBaseCost;
  }

  private createSimplePlan(
    totalBaseCost: number,
    years?: number[],
  ): { [year: number]: number } {
    if (!years) {
      years = [-4, -3, -2, -1];
    }
    const plan: { [year: number]: number } = {};
    for (const year of years) {
      plan[year] = totalBaseCost;
    }
    return plan;
  }

  private calculateNPV(
    costPlan: { [year: number]: number },
    discountRate: number,
    actualYear: number = -4,
  ): number {
    let npv = 0;

    for (const [yearStr, cost] of Object.entries(costPlan)) {
      const year = Number(yearStr);

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
}
