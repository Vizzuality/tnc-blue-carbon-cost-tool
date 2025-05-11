import { Injectable } from '@nestjs/common';
import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from '@shared/entities/activity.enum';
import { NonOverridableModelAssumptions } from '@api/modules/calculations/assumptions.repository';
import { AdditionalBaseData } from '@api/modules/calculations/data.repository';
import { CostPlanMap } from '@shared/dtos/custom-projects/custom-project-output.dto';
import { OverridableAssumptionsDto } from '@api/modules/custom-projects/dto/create-custom-project.dto';
import { RestorationProjectInput } from '@api/modules/custom-projects/input-factory/restoration-project.input';
import { CalculationException } from '@api/modules/calculations/calculators/error';
import { ProjectInput } from '@api/modules/calculations/types';

@Injectable()
export class SequestrationRateCalculator {
  projectInput: ProjectInput;
  activity: ACTIVITY;
  defaultProjectLength: number;
  projectLength: number;
  buffer: OverridableAssumptionsDto['buffer'];
  plantingSuccessRate: NonOverridableModelAssumptions['plantingSuccessRate'];
  // Tier1 sequestration rate value is required regardless of the Tier selected for Restoration projects
  tier1SequestrationRate: AdditionalBaseData['tier1SequestrationRate'];
  sequestrationRate: RestorationProjectInput['sequestrationRate'];
  restorationRate: OverridableAssumptionsDto['restorationRate'];
  soilOrganicCarbonReleaseLength: NonOverridableModelAssumptions['soilOrganicCarbonReleaseLength'];
  cumulativeLoss: CostPlanMap;
  projectedLoss: CostPlanMap;
  annualAvoidedLoss: CostPlanMap;
  restorationPlan: CostPlanMap;
  constructor(projectInput: ProjectInput) {
    this.projectInput = projectInput;
    this.activity = projectInput.activity;
    this.defaultProjectLength = projectInput.assumptions.defaultProjectLength;
    this.projectLength = projectInput.assumptions.projectLength;
    this.buffer = projectInput.assumptions.buffer;
    this.plantingSuccessRate = projectInput.assumptions.plantingSuccessRate;
    this.tier1SequestrationRate =
      projectInput.costAndCarbonInputs.tier1SequestrationRate;
    this.restorationRate = projectInput.assumptions.restorationRate;
    if (projectInput instanceof RestorationProjectInput) {
      this.sequestrationRate = projectInput.sequestrationRate;
      this.restorationPlan = this.initializeRestorationPlan(
        projectInput.projectSizeHa,
        this.restorationRate,
        this.projectLength,
      );
      this.restorationPlan = this.updateRestorationPlan(projectInput);
    }
    this.soilOrganicCarbonReleaseLength =
      projectInput.assumptions.soilOrganicCarbonReleaseLength;

    if (this.activity === ACTIVITY.CONSERVATION) {
      this.projectedLoss = this.calculateProjectedLoss();
      this.annualAvoidedLoss = this.calculateAnnualAvoidedLoss();
      this.cumulativeLoss = this.calculateCumulativeLossRate();
    }
  }

  calculateEstimatedCreditsIssuedPlan(): CostPlanMap {
    const estCreditsIssuedPlan: CostPlanMap = {};

    for (let year = -1; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        estCreditsIssuedPlan[year] = 0;
      }
    }

    const netEmissionsReductions: CostPlanMap =
      this.calculateNetEmissionsReductions();

    for (const yearStr in estCreditsIssuedPlan) {
      const year = Number(yearStr);
      if (year <= this.defaultProjectLength) {
        estCreditsIssuedPlan[year] =
          netEmissionsReductions[year] * (1 - this.buffer);
      } else {
        estCreditsIssuedPlan[year] = 0;
      }
    }

    return estCreditsIssuedPlan;
  }

  calculateNetEmissionsReductions(): CostPlanMap {
    let netEmissionReductionsPlan: { [year: number]: number } = {};

    for (let year = -1; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        netEmissionReductionsPlan[year] = 0;
      }
    }

    if (this.activity === ACTIVITY.CONSERVATION) {
      netEmissionReductionsPlan = this._calculateConservationEmissions(
        netEmissionReductionsPlan,
      );
    }

    if (this.activity === ACTIVITY.RESTORATION) {
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

      if (year <= this.projectLength) {
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

  private _calculateRestorationEmissions(
    netEmissionReductionsPlan: CostPlanMap,
  ): CostPlanMap {
    const areaRestoredOrConservedPlan: CostPlanMap =
      this.calculateAreaRestoredOrConserved();
    const sequestrationRate: number = this.sequestrationRate;
    let restorationActivity: RESTORATION_ACTIVITY_SUBTYPE;
    if (this.projectInput instanceof RestorationProjectInput) {
      restorationActivity = this.projectInput.restorationActivity;
    }

    const sortedYears = Object.keys(netEmissionReductionsPlan)
      .map(Number)
      .sort((a, b) => a - b);

    for (const year of sortedYears) {
      if (year <= this.projectLength) {
        if (year === -1) {
          netEmissionReductionsPlan[year] = 0;
        } else if (
          restorationActivity === RESTORATION_ACTIVITY_SUBTYPE.PLANTING
        ) {
          netEmissionReductionsPlan[year] = this._calculatePlantingEmissions(
            areaRestoredOrConservedPlan,
            sequestrationRate,
            year,
          );
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
    const plantingSuccessRate: number = this.plantingSuccessRate;

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
    if (this.activity !== ACTIVITY.CONSERVATION) {
      console.error('Baseline emissions cannot be calculated for restoration.');
    }

    const { emissionFactorAgb, emissionFactorSoc, emissionFactor } =
      this.projectInput;
    const tier1SequestrationRate = this.tier1SequestrationRate;

    const baselineEmissionPlan: { [year: number]: number } = {};
    for (let year = 1; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        baselineEmissionPlan[year] = 0;
      }
    }

    const cumulativeLoss = this.calculateCumulativeLossRate();
    const cumulativeLossRateIncorporatingSOC =
      this.calculateCumulativeLossRateIncorporatingSOCReleaseTime();
    const annualAvoidedLoss = this.getAnnualAvoidedLoss();

    for (const yearStr in baselineEmissionPlan) {
      const year = Number(yearStr);
      let value: number = 0;
      if (year <= this.projectLength) {
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

    for (let year = -1; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        cumulativeHaRestoredInYear[year] = 0;
      }
    }
    // TODO: We could use a Map to ensure the order of the years
    //       This applies to all methods/parts that generate a CostPlanMap
    const yearsInOrder = Object.keys(cumulativeHaRestoredInYear)
      .map(Number)
      .sort((a, b) => a - b);

    for (const year of yearsInOrder) {
      if (year > this.projectLength) {
        cumulativeHaRestoredInYear[year] = 0;
      } else if (this.activity === ACTIVITY.RESTORATION) {
        if (year === -1) {
          cumulativeHaRestoredInYear[year] = this.restorationPlan[year];
        } else if (year === 1) {
          cumulativeHaRestoredInYear[year] =
            cumulativeHaRestoredInYear[-1] + this.restorationPlan[year];
        } else {
          cumulativeHaRestoredInYear[year] =
            cumulativeHaRestoredInYear[year - 1] + this.restorationPlan[year];
        }
        if (
          cumulativeHaRestoredInYear[year] > this.projectInput.projectSizeHa
        ) {
          cumulativeHaRestoredInYear[year] = this.projectInput.projectSizeHa;
        }
      } else {
        // Project is CONSERVATION
        cumulativeHaRestoredInYear[year] = this.projectInput.projectSizeHa;
      }
    }
    return cumulativeHaRestoredInYear;
  }

  calculateCumulativeLossRate(): CostPlanMap {
    if (this.activity !== ACTIVITY.CONSERVATION) {
      console.error(
        'Cumulative loss rate cannot be calculated for restoration.',
      );
      throw new Error(
        'Cumulative loss rate cannot be calculated for restoration.',
      );
    }

    const cumulativeLossRate: CostPlanMap = {};

    for (let year = 1; year <= this.defaultProjectLength; year++) {
      cumulativeLossRate[year] = 0;
    }

    const annualAvoidedLoss = this.getAnnualAvoidedLoss();

    for (const yearStr in cumulativeLossRate) {
      const year = Number(yearStr);

      if (year <= this.projectLength) {
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
    if (this.activity !== ACTIVITY.CONSERVATION) {
      throw new Error(
        'Cumulative loss rate incorporating SOC cannot be calculated for restoration projects.',
      );
    }

    const cumulativeLossRateIncorporatingSOC: CostPlanMap = {};

    for (let year = 1; year <= this.defaultProjectLength; year++) {
      cumulativeLossRateIncorporatingSOC[year] = 0;
    }

    const cumulativeLoss = this.cumulativeLoss;

    for (const yearStr in cumulativeLossRateIncorporatingSOC) {
      const year = Number(yearStr);

      if (year <= this.projectLength) {
        if (year > this.soilOrganicCarbonReleaseLength) {
          const offsetYear = year - this.soilOrganicCarbonReleaseLength;
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
    if (this.activity !== ACTIVITY.CONSERVATION) {
      // Annual avoided loss can only be calculated for conservation projects.
      return;
    }

    const projectedLoss = this.projectedLoss;

    const annualAvoidedLoss: { [year: number]: number } = {};
    for (let year = 1; year <= this.defaultProjectLength; year++) {
      annualAvoidedLoss[year] = 0;
    }

    for (const yearStr in annualAvoidedLoss) {
      const year = Number(yearStr);

      if (year <= this.projectLength) {
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

    this.annualAvoidedLoss = annualAvoidedLoss;

    return annualAvoidedLoss;
  }

  calculateProjectedLoss(): { [year: number]: number } {
    if (this.activity !== ACTIVITY.CONSERVATION) {
      throw new Error(
        'Projected loss can only be calculated for conservation projects.',
      );
    }

    const lossRate = this.projectInput.lossRate;
    const projectSizeHa = this.projectInput.projectSizeHa;

    const annualProjectedLoss: { [year: number]: number } = {};

    for (let year = -1; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        annualProjectedLoss[year] = 0;
      }
    }

    for (const yearStr in annualProjectedLoss) {
      const year = Number(yearStr);

      if (year <= this.projectLength) {
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

  getAnnualAvoidedLoss(): CostPlanMap {
    if (!this.annualAvoidedLoss) {
      throw new CalculationException(
        `Could not retrieve annual avoided loss as it is not computed yet`,
      );
    }
    return this.annualAvoidedLoss;
  }

  /**
   * @description: Initializes a restoration plan
   * @param projectSizeHa
   * @param restorationRate
   * @param projectLength
   */

  initializeRestorationPlan(
    projectSizeHa: number,
    restorationRate: number,
    // TODO: Since the restoration plan seems to be used for conservation as well, we should apply the conservation project length here>?
    projectLength: number,
  ): CostPlanMap {
    const restorationPlan: CostPlanMap = {};

    restorationPlan[-1] =
      projectSizeHa > restorationRate ? restorationRate : projectSizeHa;

    let remainingHa = projectSizeHa - restorationPlan[-1];

    for (let year = 1; year <= projectLength; year++) {
      if (remainingHa > 0) {
        if (remainingHa >= restorationRate) {
          restorationPlan[year] = restorationRate;
          remainingHa -= restorationRate;
        } else {
          restorationPlan[year] = remainingHa;
          remainingHa = 0;
        }
      } else {
        restorationPlan[year] = 0;
      }
    }

    return restorationPlan;
  }

  /**
   * @description: If the project is restoration, the user can provide a custom plan to have more control over how many hectares are restored each year.
   *               if provided, updates the plan, otherwise it leaves the default plan.
   * @param restorationProjectInput
   */
  updateRestorationPlan(
    restorationProjectInput: RestorationProjectInput,
  ): CostPlanMap {
    const { customRestorationPlan } = restorationProjectInput;

    if (customRestorationPlan) {
      // If a custom restoration plan is provided, update it
      const originalPlanToModify = structuredClone(this.restorationPlan);
      for (const [yearStr, hectares] of Object.entries(customRestorationPlan)) {
        const year = Number(yearStr);

        if (year in originalPlanToModify) {
          originalPlanToModify[year] = hectares;
        } else {
          // This should not happen as the number of years are limited by the project length which cannot be modified by the user, but just in case
          throw new CalculationException(
            `Year ${year} is out of bounds for the restoration plan`,
          );
        }
      }
      return originalPlanToModify;
    }
    // If no custom plan is provided, return the default plan
    return this.restorationPlan;
  }
}
