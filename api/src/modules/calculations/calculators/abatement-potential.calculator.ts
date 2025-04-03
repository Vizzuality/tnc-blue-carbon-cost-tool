import { ACTIVITY } from '@shared/entities/activity.enum';
import { sum } from 'lodash';
import { ProjectInput } from '@api/modules/calculations/calculators/cost.calculator';
import { SequestrationRateCalculator } from '@api/modules/calculations/calculators/sequestration-rate.calculator';

export class AbatementPotentialCalculator {
  activity: ACTIVITY;
  projectLength: number;
  sequestrationRate: number;
  restorableLand: number;
  annualAvoidedEmissionsSum: number;
  netEmissionsReductionSum: number;
  constructor(
    input: ProjectInput,
    sequestrationRateCalculator: SequestrationRateCalculator,
  ) {
    this.activity = input.activity;
    this.projectLength = input.assumptions.projectLength;
    this.sequestrationRate = sequestrationRateCalculator.sequestrationRate;
    this.restorableLand = input.costAndCarbonInputs.restorableLand;
    // TODO: This implies recalculating something that can already be calculated, and it will be calculated later on
    //       Taking in account that we probably need to extract the calculations module, it would be best to handle the redundancies in the sequestration calculator,
    //       instead of passing the calculated output from the main calculator to here (probably)
    this.netEmissionsReductionSum = sum(
      Object.values(
        sequestrationRateCalculator.calculateNetEmissionsReductions(),
      ),
    );
    if (this.activity === ACTIVITY.CONSERVATION) {
      this.annualAvoidedEmissionsSum = sum(
        Object.values(sequestrationRateCalculator.getAnnualAvoidedLoss()),
      );
    }
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
          annualAvoidedEmissionsSum: this.annualAvoidedEmissionsSum,
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
