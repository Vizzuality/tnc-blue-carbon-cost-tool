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

type CostPlanMap = {
  [year: number]: number;
};

type CostPlans = Record<keyof OverridableCostInputs, CostPlanMap>;

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

type ProjectInput = ConservationProjectInput | RestorationProjectInput;

export class CostCalculator {
  projectInput: ProjectInput;
  defaultProjectLength: number;
  startingPointScaling: number;
  baseSize: BaseSize;
  baseIncrease: BaseIncrease;
  capexTotalCostPlan: CostPlanMap;
  opexTotalCostPlan: CostPlanMap;
  costPlans: CostPlans;
  constructor(
    projectInput: ProjectInput,
    baseSize: BaseSize,
    baseIncrease: BaseIncrease,
  ) {
    this.projectInput = projectInput;
    this.defaultProjectLength = projectInput.assumptions.defaultProjectLength;
    this.startingPointScaling =
      projectInput.assumptions.conservationStartingPointScaling;
    this.baseIncrease = baseIncrease;
    this.baseSize = baseSize;
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
    // TODO: This needs sequestration credits calculator
    // const totalBaseCost = this.getTotalBaseCost(COST_KEYS.IMPLEMENTATION_LABOR);
    // const implementationLaborCostPlan = this.createSimpleCostPlan(
    //   totalBaseCost,
    //   [-1],
    // );
    // return implementationLaborCostPlan;
    console.warn('Implementation labor costs not implemented');
    return this.createSimpleCostPlan(0, [-1]);
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

  private calculateMaintenanceCosts() {
    const totalBaseCost = this.getTotalBaseCost(COST_KEYS.MAINTENANCE);
    console.log('totalBaseCost', totalBaseCost);
    // TODO: We need Maintenance and MaintenanceDuration values, which are present in BaseDataView but not in CostInputs.
    //       Are these actually CostInputs? Can be overriden? If not, we need to change the approach, and have CostInputs and BaseData values as well
    const maintenanceCostPlan: CostPlanMap = {};
    return this.implementationLaborCosts();
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
    // @ts-ignore
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
      maintenance: this.calculateMaintenanceCosts(),
    };
  }
}
