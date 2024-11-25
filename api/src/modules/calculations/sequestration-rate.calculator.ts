import { Injectable } from '@nestjs/common';
import {
  CostPlanMap,
  ProjectInput,
} from '@api/modules/calculations/cost.calculator';
import { ACTIVITY } from '@shared/entities/activity.enum';

@Injectable()
export class SequestrationRateCalculator {
  projectInput: ProjectInput;
  constructor(projectInput: ProjectInput) {
    this.projectInput = projectInput;
  }

  calculateEstCreditsIssued(): CostPlanMap {
    const estCreditsIssuedPlan: { [year: number]: number } = {};

    for (
      let year = -1;
      year <= this.projectInput.assumptions.defaultProjectLength;
      year++
    ) {
      if (year !== 0) {
        estCreditsIssuedPlan[year] = 0;
      }
    }

    const netEmissionsReductions: { [year: number]: number } =
      this.calculateNetEmissionsReductions();

    for (const yearStr in estCreditsIssuedPlan) {
      const year = Number(yearStr);
      if (year <= this.projectInput.assumptions.defaultProjectLength) {
        estCreditsIssuedPlan[year] =
          netEmissionsReductions[year] *
          (1 - this.projectInput.assumptions.buffer);
      } else {
        estCreditsIssuedPlan[year] = 0;
      }
    }

    return estCreditsIssuedPlan;
  }

  calculateNetEmissionsReductions(): CostPlanMap {
    let netEmissionReductionsPlan: { [year: number]: number } = {};

    for (
      let year = -1;
      year <= this.projectInput.assumptions.defaultProjectLength;
      year++
    ) {
      if (year !== 0) {
        netEmissionReductionsPlan[year] = 0;
      }
    }

    if (this.projectInput.activity === ACTIVITY.CONSERVATION) {
      netEmissionReductionsPlan = this._calculateConservationEmissions(
        netEmissionReductionsPlan,
      );
    }

    if (this.projectInput.activity === ACTIVITY.RESTORATION) {
      netEmissionReductionsPlan = this._calculateRestorationEmissions(
        netEmissionReductionsPlan,
      );
    }

    return netEmissionReductionsPlan;
  }

  private _calculateConservationEmissions(netEmissionReductionsPlan: {
    [year: number]: number;
  }): { [year: number]: number } {
    // "Calcular reducciones de emisiones para proyectos de conservación."
    const baselineEmissions: { [year: number]: number } =
      this.calculateBaselineEmissions();

    for (const yearStr in netEmissionReductionsPlan) {
      const year = Number(yearStr);

      if (year <= this.projectInput.assumptions.projectLength) {
        if (year === -1) {
          netEmissionReductionsPlan[year] = 0;
        } else {
          netEmissionReductionsPlan[year] = baselineEmissions[year];
        }
      } else {
        netEmissionReductionsPlan[year] = 0;
      }
    }

    return netEmissionReductionsPlan;
  }

  private _calculateRestorationEmissions(netEmissionReductionsPlan: {
    [year: number]: number;
  }): CostPlanMap {
    const areaRestoredOrConservedPlan: { [year: number]: number } =
      this.calculateAreaRestoredOrConserved();
    const sequestrationRate: number = 0;
    // TODO: Sequestration rate is for Restoration projects, still need to implement
    //this.projectInput.assumptions.sequestrationRate;

    for (const yearStr in netEmissionReductionsPlan) {
      const year = Number(yearStr);
      if (year <= this.projectInput.assumptions.projectLength) {
        if (year === -1) {
          netEmissionReductionsPlan[year] = 0;
          // } else if (this.projectInput.restoration_activity === 'Planting') {
          //   netEmissionReductionsPlan[year] = this._calculatePlantingEmissions(
          //     areaRestoredOrConservedPlan,
          //     sequestrationRate,
          //     year,
          //   );
        } else {
          if (year === 1) {
            netEmissionReductionsPlan[year] =
              areaRestoredOrConservedPlan[-1] * sequestrationRate;
          } else {
            netEmissionReductionsPlan[year] =
              areaRestoredOrConservedPlan[year - 1] * sequestrationRate;
          }
        }
      } else {
        netEmissionReductionsPlan[year] = 0;
      }
    }
    return netEmissionReductionsPlan;
  }

  private _calculatePlantingEmissions(
    areaRestoredOrConservedPlan: CostPlanMap,
    sequestrationRate: number,
    year: number,
  ): number {
    const plantingSuccessRate: number =
      this.projectInput.assumptions.plantingSuccessRate;

    if (year === 1) {
      return (
        areaRestoredOrConservedPlan[year - 2] *
        sequestrationRate *
        plantingSuccessRate
      );
    } else {
      return (
        areaRestoredOrConservedPlan[year - 1] *
        sequestrationRate *
        plantingSuccessRate
      );
    }
  }
}
