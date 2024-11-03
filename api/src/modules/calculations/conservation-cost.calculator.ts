import { ConservationProject } from '@api/modules/custom-projects/conservation.project';
import { DEFAULT_STUFF } from '@api/modules/custom-projects/project-config.interface';
import { CostCalculator } from '@api/modules/calculations/cost.calculator';

export class ConservationCostCalculator extends CostCalculator {
  project: ConservationProject;
  // TODO: Project length depends on the activity and it seems to only be used in the calculation, so we can probably remove it from project instantiation
  conservationProjectLength: number = DEFAULT_STUFF.CONSERVATION_PROJECT_LENGTH;
  defaultProjectLength: number = DEFAULT_STUFF.DEFAULT_PROJECT_LENGTH;
  // TODO: Maybe instead of using capexTotal and opexTotal, we can use just totalCostPlan if the only difference is the type of cost
  capexTotalCostPlan: { [year: number]: number } = {};
  opexTotalCostPlan: { [year: number]: number } = {};
  totalCostPlan: { [year: number]: number } = {};
  constructor(project: ConservationProject) {
    super();
    this.project = project;
    this.capexTotalCostPlan = this.initializeCostPlan();
    this.opexTotalCostPlan = this.initializeCostPlan();
    this.totalCostPlan = this.initializeCostPlan();
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
      // this.calculateFeasibilityAnalysisCost,
      // this.calculateConservationPlanningAndAdmin,
      // this.calculateDataCollectionAndFieldCost,
      // this.calculateCommunityRepresentation,
      // this.calculateBlueCarbonProjectPlanning,
      // this.calculateEstablishingCarbonRights,
      // this.calculateValidation,
      // this.calculateImplementationLabor,
    ];

    for (const costFunc of costFunctions) {
      const costPlan = costFunc.call(this);
      this.aggregateCosts(costPlan, this.capexTotalCostPlan);
    }

    return this.capexTotalCostPlan;
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
}
