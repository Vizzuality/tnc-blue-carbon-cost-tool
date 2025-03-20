import { ModelAssumptions } from "@shared/entities/model-assumptions.entity";
import { ASSUMPTIONS_NAME_TO_DTO_MAP } from "@shared/schemas/assumptions/assumptions.enums";
import { ValidatedCustomProjectForm } from "@shared/schemas/custom-projects/create-custom-project.schema";

/**
 * Transforms raw assumption data into a structured format
 *
 * @param data Raw assumption data
 * @returns Structured assumption data
 */
export function transformAssumptionsData(
  data: Partial<ModelAssumptions>[],
): Partial<ValidatedCustomProjectForm["assumptions"]> {
  return data.reduce<Partial<ValidatedCustomProjectForm["assumptions"]>>(
    (acc, { name, value }) => {
      if (name && value !== undefined) {
        const validName = name as keyof typeof ASSUMPTIONS_NAME_TO_DTO_MAP;
        const mappedKey = ASSUMPTIONS_NAME_TO_DTO_MAP[validName];

        if (mappedKey) {
          return {
            ...acc,
            [mappedKey]: Number(value),
          };
        }
      }
      return acc;
    },
    {},
  );
}

/**
 * Applies user-provided assumptions over default values
 * giving precedence to user values when available
 *
 * @param defaultAssumptions Default assumption values
 * @param userAssumptions User-provided assumption values
 * @returns Merged assumptions with user values taking precedence
 */
export function applyUserAssumptionsOverDefaults(
  defaultAssumptions: Partial<ValidatedCustomProjectForm["assumptions"]>,
  userAssumptions: Partial<ValidatedCustomProjectForm["assumptions"]>,
) {
  return {
    ...Object.keys(userAssumptions ?? {}).reduce((acc, assumptionKey) => {
      return {
        ...acc,
        [assumptionKey]:
          userAssumptions[assumptionKey as keyof typeof userAssumptions] ??
          defaultAssumptions?.[
            assumptionKey as keyof typeof defaultAssumptions
          ],
      };
    }, {}),
  };
}

/**
 * Applies user-provided cost inputs over default values
 * giving precedence to user values when available
 *
 * @param defaultCostInputs Default cost input values
 * @param userCostInputs User-provided cost input values
 * @returns Merged cost inputs with user values taking precedence
 */
export function applyUserCostInputsOverDefaults(
  defaultCostInputs: Record<string, number | undefined>,
  userCostInputs: Partial<ValidatedCustomProjectForm["costInputs"]>,
) {
  return {
    ...Object.keys(userCostInputs ?? {}).reduce((acc, costKey) => {
      return {
        ...acc,
        [costKey]:
          userCostInputs[costKey as keyof typeof userCostInputs] ??
          defaultCostInputs?.[costKey as keyof typeof defaultCostInputs],
      };
    }, {}),
  };
}

export function getRestorationYearlyBreakdown(
  data: number[],
): { year: number; annualHectaresRestored: number }[] {
  return data
    .map((value, index) => ({
      year: index == 0 ? -1 : index,
      annualHectaresRestored: value,
    }))
    .filter((v) => v.annualHectaresRestored > 0);
}
