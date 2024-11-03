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
  // TODO: Maybe instead of using capexTotal and opexTotal, we can use just totalCostPlan if the only difference is the type of cost
  capexTotalCostPlan: { [year: number]: number } = {};
  opexTotalCostPlan: { [year: number]: number } = {};
  totalCostPlan: { [year: number]: number } = {};
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
}
