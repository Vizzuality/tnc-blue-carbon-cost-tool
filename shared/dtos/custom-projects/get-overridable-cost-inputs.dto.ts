import { z } from "zod";
import { GetDefaultCostInputsSchema } from "@shared/schemas/custom-projects/get-cost-inputs.schema";

export type GetOverridableCostInputs = z.infer<
  typeof GetDefaultCostInputsSchema
>;
