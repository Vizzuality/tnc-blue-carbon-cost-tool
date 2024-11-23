import { ConservationProject } from '@api/modules/custom-projects/conservation.project';
import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from '@shared/entities/activity.enum';

import { Injectable } from '@nestjs/common';

@Injectable()
export class SequestrationRatesCalculator {
  // TODO: This should accept both Conservation and Restoration
  private project: ConservationProject;
  private projectLength: number;
  private defaultProjectLength: number;
  private activity: ACTIVITY;
  private activitySubType: RESTORATION_ACTIVITY_SUBTYPE;
  // TODO: !!! These only apply for Restoration projects, so we need to somehow pass the value from the project or calculator, not sure yet
  private restorationRate: number = 250;
  private sequestrationRate: number = 0.5;

  constructor(
    project: ConservationProject,
    projectLength: number,
    defaultProjectLength: number,
    activity: ACTIVITY,
    activitySubType: RESTORATION_ACTIVITY_SUBTYPE,
  ) {
    this.project = project;
    // TODO: Project Length comes from constant and is set based on the activity
    this.projectLength = projectLength;
    this.defaultProjectLength = defaultProjectLength;
    this.activity = activity;
    this.activitySubType = activitySubType;
  }

  public calculateProjectedLoss(): { [year: number]: number } {
    if (this.project.activity !== ACTIVITY.CONSERVATION) {
      throw new Error(
        'Cumulative loss rate can only be calculated for conservation projects.',
      );
    }
    const lossRate = this.project.lossRate;
    const projectSizeHa = this.project.projectSizeHa;
    const annualProjectedLoss: { [year: number]: number } = {};

    for (let year = -1; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        annualProjectedLoss[year] = 0;
      }
    }

    for (const year in annualProjectedLoss) {
      const yearNum = Number(year);
      if (yearNum <= this.projectLength) {
        if (yearNum === -1) {
          annualProjectedLoss[yearNum] = projectSizeHa;
        } else {
          annualProjectedLoss[yearNum] =
            projectSizeHa * Math.pow(1 + lossRate, yearNum);
        }
      } else {
        annualProjectedLoss[yearNum] = 0;
      }
    }

    return annualProjectedLoss;
  }

  public calculateAnnualAvoidedLoss(): { [year: number]: number } {
    if (this.project.activity !== ACTIVITY.CONSERVATION) {
      throw new Error(
        'Cumulative loss rate can only be calculated for conservation projects.',
      );
    }

    const projectedLoss = this.calculateProjectedLoss();
    const annualAvoidedLoss: { [year: number]: number } = {};

    for (let year = 1; year <= this.defaultProjectLength; year++) {
      annualAvoidedLoss[year] = 0;
    }

    for (const year in annualAvoidedLoss) {
      const yearNum = Number(year);
      if (yearNum <= this.projectLength) {
        if (yearNum === 1) {
          annualAvoidedLoss[yearNum] =
            (projectedLoss[yearNum] - projectedLoss[-1]) * -1;
        } else {
          annualAvoidedLoss[yearNum] =
            (projectedLoss[yearNum] - projectedLoss[yearNum - 1]) * -1;
        }
      } else {
        annualAvoidedLoss[yearNum] = 0;
      }
    }

    return annualAvoidedLoss;
  }

  public calculateCumulativeLossRate(): { [year: number]: number } {
    if (this.project.activity !== ACTIVITY.CONSERVATION) {
      throw new Error(
        'Cumulative loss rate can only be calculated for conservation projects.',
      );
    }

    const cumulativeLossRate: { [year: number]: number } = {};
    const annualAvoidedLoss = this.calculateAnnualAvoidedLoss();

    for (let year = 1; year <= this.defaultProjectLength; year++) {
      cumulativeLossRate[year] = 0;
    }

    for (const year in cumulativeLossRate) {
      const yearNum = Number(year);
      if (yearNum <= this.projectLength) {
        if (yearNum === 1) {
          cumulativeLossRate[yearNum] = annualAvoidedLoss[yearNum];
        } else {
          cumulativeLossRate[yearNum] =
            annualAvoidedLoss[yearNum] + cumulativeLossRate[yearNum - 1];
        }
      } else {
        cumulativeLossRate[yearNum] = 0;
      }
    }

    return cumulativeLossRate;
  }

  public calculateCumulativeLossRateIncorporatingSOCReleaseTime(): {
    [year: number]: number;
  } {
    if (this.project.activity !== ACTIVITY.CONSERVATION) {
      throw new Error(
        'Cumulative loss rate can only be calculated for conservation projects.',
      );
    }

    const cumulativeLossRateIncorporatingSOC: { [year: number]: number } = {};
    const cumulativeLoss = this.calculateCumulativeLossRate();

    // Inicializamos el plan con años de 1 a defaultProjectLength
    for (let year = 1; year <= this.defaultProjectLength; year++) {
      cumulativeLossRateIncorporatingSOC[year] = 0;
    }

    // Calculamos la tasa de pérdida acumulativa incorporando el tiempo de liberación de SOC
    for (const year in cumulativeLossRateIncorporatingSOC) {
      const yearNum = Number(year);
      if (yearNum <= this.projectLength) {
        if (yearNum > this.project.soilOrganicCarbonReleaseLength) {
          const offsetValue =
            cumulativeLoss[
              yearNum - this.project.soilOrganicCarbonReleaseLength
            ];
          cumulativeLossRateIncorporatingSOC[yearNum] =
            cumulativeLoss[yearNum] - offsetValue;
        } else {
          cumulativeLossRateIncorporatingSOC[yearNum] = cumulativeLoss[yearNum];
        }
      } else {
        cumulativeLossRateIncorporatingSOC[yearNum] = 0;
      }
    }

    return cumulativeLossRateIncorporatingSOC;
  }

  public calculateBaselineEmissions(): { [year: number]: number } {
    if (this.project.activity !== ACTIVITY.CONSERVATION) {
      throw new Error(
        'Baseline emissions can only be calculated for conservation projects.',
      );
    }

    const sequestrationRateTier1 =
      this.project.costInputs.tier1SequestrationRate;
    let emissionFactor: number | undefined;
    let emissionFactorAGB: number | undefined;
    let emissionFactorSOC: number | undefined;

    if (this.project.emissionFactorUsed === 'Tier 1 - Global emission factor') {
      emissionFactor = this.project.emissionFactor;
    } else if (
      this.project.emissionFactorUsed ===
      'Tier 2 - Country-specific emission factor'
    ) {
      emissionFactorAGB = this.project.emissionFactorAGB;
      emissionFactorSOC = this.project.emissionFactorSOC;
    } else {
      emissionFactorAGB = this.project.emissionFactorAGB;
      emissionFactorSOC = this.project.emissionFactorSOC;
    }

    const baselineEmissionPlan: { [year: number]: number } = {};
    const cumulativeLoss = this.calculateCumulativeLossRate();
    const cumulativeLossRateIncorporatingSOC =
      this.calculateCumulativeLossRateIncorporatingSOCReleaseTime();
    const annualAvoidedLoss = this.calculateAnnualAvoidedLoss();

    for (let year = 1; year <= this.defaultProjectLength; year++) {
      baselineEmissionPlan[year] = 0;
    }

    for (const year in baselineEmissionPlan) {
      const yearNum = Number(year);
      if (yearNum <= this.projectLength) {
        if (
          this.project.emissionFactorUsed !== 'Tier 1 - Global emission factor'
        ) {
          baselineEmissionPlan[yearNum] =
            emissionFactorAGB! * annualAvoidedLoss[yearNum] +
            cumulativeLossRateIncorporatingSOC[yearNum] * emissionFactorSOC! +
            sequestrationRateTier1 * cumulativeLoss[yearNum];
        } else {
          baselineEmissionPlan[yearNum] =
            cumulativeLoss[yearNum] * emissionFactor! +
            sequestrationRateTier1 * cumulativeLoss[yearNum];
        }
      } else {
        baselineEmissionPlan[yearNum] = 0;
      }
    }

    return baselineEmissionPlan;
  }

  public calculateNetEmissionsReductions(): { [year: number]: number } {
    const netEmissionReductionsPlan: { [year: number]: number } = {};

    for (let year = -1; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        netEmissionReductionsPlan[year] = 0;
      }
    }

    if (this.project.activity === ACTIVITY.CONSERVATION) {
      return this.calculateConservationEmissions(netEmissionReductionsPlan);
    } else if (this.project.activity === ACTIVITY.RESTORATION) {
      return this.calculateRestorationEmissions(netEmissionReductionsPlan);
    }

    return netEmissionReductionsPlan;
  }

  private calculateRestorationEmissions(netEmissionReductionsPlan: {
    [year: number]: number;
  }): { [year: number]: number } {
    const areaRestoredOrConservedPlan = this.calculateAreaRestoredOrConserved();
    const sequestrationRate = this.sequestrationRate;

    for (const year in netEmissionReductionsPlan) {
      const yearNum = Number(year);
      if (yearNum <= this.projectLength) {
        if (yearNum === -1) {
          netEmissionReductionsPlan[yearNum] = 0;
        } else if (this.activitySubType === 'Planting') {
          netEmissionReductionsPlan[yearNum] = this.calculatePlantingEmissions(
            areaRestoredOrConservedPlan,
            sequestrationRate,
            yearNum,
          );
        } else {
          netEmissionReductionsPlan[yearNum] =
            areaRestoredOrConservedPlan[yearNum - 1] * sequestrationRate;
        }
      } else {
        netEmissionReductionsPlan[yearNum] = 0;
      }
    }

    return netEmissionReductionsPlan;
  }

  private calculatePlantingEmissions(
    areaRestoredOrConservedPlan: { [year: number]: number },
    sequestrationRate: number,
    year: number,
  ): number {
    const plantingSuccessRate = this.project.plantingSuccessRate;

    if (year === 1) {
      return (
        areaRestoredOrConservedPlan[year - 2] *
        sequestrationRate *
        plantingSuccessRate
      );
    }

    return (
      areaRestoredOrConservedPlan[year - 1] *
      sequestrationRate *
      plantingSuccessRate
    );
  }

  public calculateAreaRestoredOrConserved(): { [year: number]: number } {
    const cumulativeHaRestoredInYear: { [year: number]: number } = {};

    for (let year = -1; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        cumulativeHaRestoredInYear[year] = 0;
      }
    }

    for (const year in cumulativeHaRestoredInYear) {
      const yearNum = Number(year);
      if (yearNum > this.projectLength) {
        cumulativeHaRestoredInYear[yearNum] = 0;
      } else if (this.activity === ACTIVITY.RESTORATION) {
        cumulativeHaRestoredInYear[yearNum] = Math.min(
          this.project.restorationRate,
          this.project.projectSizeHa,
        );
      } else {
        cumulativeHaRestoredInYear[yearNum] = this.project.projectSizeHa;
      }
    }

    return cumulativeHaRestoredInYear;
  }

  public calculateImplementationLabor(): { [year: number]: number } {
    const baseCost =
      this.activity === ACTIVITY.RESTORATION
        ? this.project.costInputs.implementationLabor
        : 0;
    const areaRestoredOrConservedPlan = this.calculateAreaRestoredOrConserved();
    const implementationLaborCostPlan: { [year: number]: number } = {};

    for (let year = -4; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        implementationLaborCostPlan[year] = 0;
      }
    }

    for (let year = 1; year <= this.projectLength; year++) {
      const laborCost =
        baseCost *
        (areaRestoredOrConservedPlan[year] -
          (areaRestoredOrConservedPlan[year - 1] || 0));
      implementationLaborCostPlan[year] = laborCost;
    }

    return implementationLaborCostPlan;
  }
  private calculateConservationEmissions(netEmissionReductionsPlan: {
    [year: number]: number;
  }): { [year: number]: number } {
    const baselineEmissions = this.calculateBaselineEmissions();

    for (const year in netEmissionReductionsPlan) {
      const yearNum = Number(year);
      if (yearNum <= this.projectLength) {
        if (yearNum === -1) {
          netEmissionReductionsPlan[yearNum] = 0;
        } else {
          netEmissionReductionsPlan[yearNum] = baselineEmissions[yearNum];
        }
      } else {
        netEmissionReductionsPlan[yearNum] = 0;
      }
    }

    return netEmissionReductionsPlan;
  }

  public calculateEstimatedCreditsIssued(): { [year: number]: number } {
    const estCreditsIssuedPlan: { [year: number]: number } = {};

    for (let year = -1; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        estCreditsIssuedPlan[year] = 0;
      }
    }

    const netEmissionsReductions = this.calculateNetEmissionsReductions();

    for (const year in estCreditsIssuedPlan) {
      const yearNum = Number(year);
      if (yearNum <= this.projectLength) {
        estCreditsIssuedPlan[yearNum] =
          netEmissionsReductions[yearNum] * (1 - this.project.buffer);
      } else {
        estCreditsIssuedPlan[yearNum] = 0;
      }
    }

    return estCreditsIssuedPlan;
  }
}
