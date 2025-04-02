import { COST_INPUTS_KEYS } from "@shared/dtos/custom-projects/custom-projects.constants";
import { ModelAssumptions } from "@shared/entities/model-assumptions.entity";
import { ASSUMPTIONS_NAME_TO_DTO_MAP } from "@shared/schemas/assumptions/assumptions.enums";
import { ValidatedCustomProjectForm } from "@shared/schemas/custom-projects/create-custom-project.schema";

/**
 * Transforms model assumptions array to key-value map expected by the API
 *
 * @param data Model assumptions array
 * @returns Key-value map of model assumptions
 */
export function assumptionsArrayToMap(
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
 * Applies user-provided values over defaults giving precedence to user values
 *
 * @param defaults Default values
 * @param userValues User-provided values
 * @returns Merged values with user values taking precedence
 */
export function applyUserValuesOverDefaults<
  T extends Record<string, number | undefined>,
>(defaults: Partial<T>, userValues: Partial<T>) {
  return {
    ...Object.keys(userValues ?? {}).reduce((acc, key) => {
      return {
        ...acc,
        [key]: userValues[key as keyof T] ?? defaults[key as keyof T],
      };
    }, {}),
  };
}

export const applyUserAssumptionsOverDefaults = (
  defaults: Partial<ValidatedCustomProjectForm["assumptions"]>,
  userValues: Partial<ValidatedCustomProjectForm["assumptions"]>,
) => applyUserValuesOverDefaults(defaults, userValues);

export const applyUserCostInputsOverDefaults = (
  defaults: Partial<ValidatedCustomProjectForm["costInputs"]>,
  userValues: Partial<ValidatedCustomProjectForm["costInputs"]>,
) => applyUserValuesOverDefaults(defaults, userValues);

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

type costInputKeyType = "capex" | "opex";

type CapexKeys = (typeof COST_INPUTS_KEYS)["capex"][number];
type OpexKeys = (typeof COST_INPUTS_KEYS)["opex"][number];

function isCostInputKey(
  key: string,
  type: costInputKeyType,
): key is (typeof COST_INPUTS_KEYS)[costInputKeyType][number] {
  if (type === "capex") {
    return COST_INPUTS_KEYS.capex.includes(key as CapexKeys);
  }
  return COST_INPUTS_KEYS.opex.includes(key as OpexKeys);
}

export function getCostInputsKeysByType(
  data: Partial<ValidatedCustomProjectForm["costInputs"]>,
  type: costInputKeyType,
): string[] {
  return Object.keys(data).filter((key) => isCostInputKey(key, type));
}

export function getCapexCostInputsKeys(
  data: Partial<ValidatedCustomProjectForm["costInputs"]>,
): string[] {
  return getCostInputsKeysByType(data, "capex");
}

export const getOpexCostInputsKeys = (
  data: Partial<ValidatedCustomProjectForm["costInputs"]>,
): string[] => {
  return getCostInputsKeysByType(data, "opex");
};
