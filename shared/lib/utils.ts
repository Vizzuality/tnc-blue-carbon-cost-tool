import { COST_INPUTS_KEYS } from "@shared/dtos/custom-projects/custom-projects.constants";
import { ValidatedCustomProjectForm } from "@shared/schemas/custom-projects/create-custom-project.schema";

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
