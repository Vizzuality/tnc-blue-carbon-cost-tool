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

  private _calculateConservationEmissions(
    netEmissionReductionsPlan: CostPlanMap,
  ): CostPlanMap {
    const baselineEmissions: CostPlanMap = this.calculateBaselineEmissions();

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

  calculateBaselineEmissions(): CostPlanMap {
    // TODO: This is validated previously, but letting it here until we understand what value should we provide for Restoration,
    //       as all costs are calculated for both types. Maybe this is an internal method and the value is set in another place.
    if (this.projectInput.activity !== ACTIVITY.CONSERVATION) {
      console.error('Baseline emissions cannot be calculated for restoration.');
    }

    const { emissionFactorAgb, emissionFactorSoc, emissionFactor } =
      this.projectInput;
    const { tier1SequestrationRate } = this.projectInput.costAndCarbonInputs;

    const baselineEmissionPlan: { [year: number]: number } = {};
    for (
      let year = 1;
      year <= this.projectInput.assumptions.defaultProjectLength;
      year++
    ) {
      if (year !== 0) {
        baselineEmissionPlan[year] = 0;
      }
    }

    const cumulativeLoss = this.calculateCumulativeLossRate();
    const cumulativeLossRateIncorporatingSOC =
      this.calculateCumulativeLossRateIncorporatingSOCReleaseTime();
    const annualAvoidedLoss = this.calculateAnnualAvoidedLoss();

    for (const yearStr in baselineEmissionPlan) {
      const year = Number(yearStr);
      let value: number = 0;
      if (year <= this.projectInput.assumptions.projectLength) {
        if (emissionFactorSoc && emissionFactorAgb) {
          value =
            emissionFactorAgb * annualAvoidedLoss[year] +
            cumulativeLossRateIncorporatingSOC[year] * emissionFactorSoc +
            tier1SequestrationRate * cumulativeLoss[year];
        } else {
          value =
            cumulativeLoss[year] * emissionFactor +
            tier1SequestrationRate * cumulativeLoss[year];
        }
        baselineEmissionPlan[year] = value;
      } else {
        baselineEmissionPlan[year] = 0;
      }
    }

    return baselineEmissionPlan;
  }

  calculateAreaRestoredOrConserved(): CostPlanMap {
    const cumulativeHaRestoredInYear: CostPlanMap = {};

    for (
      let year = -1;
      year <= this.projectInput.assumptions.defaultProjectLength;
      year++
    ) {
      if (year !== 0) {
        cumulativeHaRestoredInYear[year] = 0;
      }
    }

    for (const yearStr in cumulativeHaRestoredInYear) {
      const year = Number(yearStr);

      if (year > this.projectInput.assumptions.projectLength) {
        cumulativeHaRestoredInYear[year] = 0;
      } else if (this.projectInput.activity === ACTIVITY.RESTORATION) {
        if (
          this.projectInput.assumptions.restorationRate <
          this.projectInput.projectSizeHa
        ) {
          cumulativeHaRestoredInYear[year] =
            this.projectInput.assumptions.restorationRate;
        } else {
          cumulativeHaRestoredInYear[year] = this.projectInput.projectSizeHa;
        }
      } else {
        cumulativeHaRestoredInYear[year] = this.projectInput.projectSizeHa;
      }
    }

    return cumulativeHaRestoredInYear;
  }

  calculateCumulativeLossRate(): CostPlanMap {
    if (this.projectInput.activity !== ACTIVITY.CONSERVATION) {
      console.error(
        'Cumulative loss rate cannot be calculated for restoration.',
      );
      throw new Error(
        'Cumulative loss rate cannot be calculated for restoration.',
      );
    }

    const cumulativeLossRate: CostPlanMap = {};

    for (
      let year = 1;
      year <= this.projectInput.assumptions.defaultProjectLength;
      year++
    ) {
      cumulativeLossRate[year] = 0;
    }

    const annualAvoidedLoss: { [year: number]: number } =
      this.calculateAnnualAvoidedLoss();

    for (const yearStr in cumulativeLossRate) {
      const year = Number(yearStr);

      if (year <= this.projectInput.assumptions.projectLength) {
        if (year === 1) {
          cumulativeLossRate[year] = annualAvoidedLoss[year];
        } else {
          cumulativeLossRate[year] =
            annualAvoidedLoss[year] + cumulativeLossRate[year - 1];
        }
      } else {
        cumulativeLossRate[year] = 0;
      }
    }

    return cumulativeLossRate;
  }

  calculateCumulativeLossRateIncorporatingSOCReleaseTime(): CostPlanMap {
    if (this.projectInput.activity !== ACTIVITY.CONSERVATION) {
      throw new Error(
        'La tasa de pérdida acumulada solo puede calcularse para proyectos de conservación.',
      );
    }

    const cumulativeLossRateIncorporatingSOC: CostPlanMap = {};

    for (
      let year = 1;
      year <= this.projectInput.assumptions.defaultProjectLength;
      year++
    ) {
      cumulativeLossRateIncorporatingSOC[year] = 0;
    }

    const cumulativeLoss = this.calculateCumulativeLossRate();

    for (const yearStr in cumulativeLossRateIncorporatingSOC) {
      const year = Number(yearStr);

      if (year <= this.projectInput.assumptions.projectLength) {
        if (
          year > this.projectInput.assumptions.soilOrganicCarbonReleaseLength
        ) {
          const offsetYear =
            year - this.projectInput.assumptions.soilOrganicCarbonReleaseLength;
          const offsetValue = cumulativeLoss[offsetYear];
          cumulativeLossRateIncorporatingSOC[year] =
            cumulativeLoss[year] - offsetValue;
        } else {
          cumulativeLossRateIncorporatingSOC[year] = cumulativeLoss[year];
        }
      } else {
        cumulativeLossRateIncorporatingSOC[year] = 0;
      }
    }

    return cumulativeLossRateIncorporatingSOC;
  }

  calculateAnnualAvoidedLoss(): CostPlanMap {
    if (this.projectInput.activity !== ACTIVITY.CONSERVATION) {
      throw new Error(
        'Annual avoided loss can only be calculated for conservation projects.',
      );
    }

    const projectedLoss: { [year: number]: number } =
      this.calculateProjectedLoss();

    const annualAvoidedLoss: { [year: number]: number } = {};
    for (
      let year = 1;
      year <= this.projectInput.assumptions.defaultProjectLength;
      year++
    ) {
      annualAvoidedLoss[year] = 0;
    }

    for (const yearStr in annualAvoidedLoss) {
      const year = Number(yearStr);

      if (year <= this.projectInput.assumptions.projectLength) {
        if (year === 1) {
          annualAvoidedLoss[year] =
            (projectedLoss[year] - projectedLoss[-1]) * -1;
        } else {
          annualAvoidedLoss[year] =
            (projectedLoss[year] - projectedLoss[year - 1]) * -1;
        }
      } else {
        annualAvoidedLoss[year] = 0;
      }
    }

    return annualAvoidedLoss;
  }

  calculateProjectedLoss(): { [year: number]: number } {
    if (this.projectInput.activity !== ACTIVITY.CONSERVATION) {
      throw new Error(
        'Projected loss can only be calculated for conservation projects.',
      );
    }

    const lossRate = this.projectInput.lossRate;
    const projectSizeHa = this.projectInput.projectSizeHa;

    const annualProjectedLoss: { [year: number]: number } = {};

    for (
      let year = -1;
      year <= this.projectInput.assumptions.defaultProjectLength;
      year++
    ) {
      if (year !== 0) {
        annualProjectedLoss[year] = 0;
      }
    }

    for (const yearStr in annualProjectedLoss) {
      const year = Number(yearStr);

      if (year <= this.projectInput.assumptions.projectLength) {
        if (year === -1) {
          annualProjectedLoss[year] = projectSizeHa;
        } else {
          annualProjectedLoss[year] =
            projectSizeHa * Math.pow(1 + lossRate, year);
        }
      } else {
        annualProjectedLoss[year] = 0;
      }
    }

    return annualProjectedLoss;
  }
}
