import { ACTIVITY } from '@shared/entities/activity.enum';
import { sum } from 'lodash';
import { ProjectInput } from '@api/modules/calculations/calculators/cost.calculator';
import { SequestrationRateCalculator } from '@api/modules/calculations/calculators/sequestration-rate.calculator';

export class AbatementPotentialCalculator {
  activity: ACTIVITY;
  projectLength: number;
  sequestrationRate: number;
  restorableLand: number;
  annualAvoidedEmissions: number;
  constructor(
    input: ProjectInput,
    sequestrationRateCalculator: SequestrationRateCalculator,
  ) {
    this.activity = input.activity;
    this.projectLength = input.assumptions.projectLength;
    this.sequestrationRate = sequestrationRateCalculator.sequestrationRate;
    this.restorableLand = input.costAndCarbonInputs.restorableLand;
    if (this.activity === ACTIVITY.CONSERVATION) {
      this.annualAvoidedEmissions = sum(
        Object.values(sequestrationRateCalculator.getAnnualAvoidedLoss()),
      );
    }
  }

  calculateAbatementPotential(): number {
    switch (this.activity) {
      case ACTIVITY.RESTORATION:
        return this.calculateRestorationAbatementPotential({
          restorableLand: this.restorableLand,
          sequestrationRate: this.sequestrationRate,
        });
      case ACTIVITY.CONSERVATION:
        return this.calculateConservationAbatementPotential({
          projectLength: this.projectLength,
          annualAvoidedEmissions: this.annualAvoidedEmissions,
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

  calculateConservationAbatementPotential(params: {
    projectLength: number;
    annualAvoidedEmissions: number;
  }): number {
    const annualAvoidedEmissionsTotal = sum(
      Object.values(params.annualAvoidedEmissions),
    );

    const abatementPotential =
      annualAvoidedEmissionsTotal * params.projectLength;
    return abatementPotential;
  }
}
