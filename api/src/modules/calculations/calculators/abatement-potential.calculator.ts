import { ACTIVITY } from '@shared/entities/activity.enum';
import { sum } from 'lodash';
import { RestorationProjectInput } from '@api/modules/custom-projects/input-factory/restoration-project.input';
import { AbatementPotentialInput } from '@api/modules/calculations/types';

export class AbatementPotentialCalculator {
  activity: ACTIVITY;
  projectLength: number;
  sequestrationRate: number;
  restorableLand: number;
  annualAvoidedLossSum: number;
  netEmissionsReductionSum: number;
  constructor(input: AbatementPotentialInput) {
    this.activity = input.projectInput.activity;
    this.projectLength = input.projectInput.assumptions.projectLength;
    if (input instanceof RestorationProjectInput) {
      this.sequestrationRate = input.sequestrationRate;
    }
    this.restorableLand = input.projectInput.costAndCarbonInputs.restorableLand;
    if (this.activity === ACTIVITY.CONSERVATION) {
      this.annualAvoidedLossSum = sum(Object.values(input.annualAvoidedLoss));
    }
    this.netEmissionsReductionSum = sum(
      Object.values(input.netEmissionsReduction),
    );
  }

  /**
   * Calculate the country level abatement potential based on the activity type.
   * @returns The calculated abatement potential.
   */

  calculateCountryLevelAbatementPotential(): number {
    switch (this.activity) {
      case ACTIVITY.RESTORATION:
        return this.calculateRestorationAbatementPotential({
          restorableLand: this.restorableLand,
          sequestrationRate: this.sequestrationRate,
        });
      case ACTIVITY.CONSERVATION:
        return this.calculateConservationAbatementPotential({
          projectLength: this.projectLength,
          annualAvoidedEmissionsSum: this.annualAvoidedLossSum,
        });
    }
  }

  calculateRestorationAbatementPotential(params: {
    restorableLand: number;
    sequestrationRate: number;
  }): number {
    const abatementPotential = params.sequestrationRate * params.restorableLand;
    return abatementPotential;
  }

  // TODO: Check if we should use project length or default project length to compute abatement potential, and if there is any difference
  //       between regular projects and custom projects when computing abatement potential

  calculateConservationAbatementPotential(params: {
    projectLength: number;
    annualAvoidedEmissionsSum: number;
  }): number {
    const abatementPotential =
      params.annualAvoidedEmissionsSum * params.projectLength;
    return abatementPotential;
  }

  /**
   * Calculate the project level abatement potential based on the activity type.
   * @returns The calculated abatement potential, which is the sum of net emissions reductions.
   */
  calculateProjectLevelAbatementPotential(): number {
    return this.netEmissionsReductionSum;
  }
}
