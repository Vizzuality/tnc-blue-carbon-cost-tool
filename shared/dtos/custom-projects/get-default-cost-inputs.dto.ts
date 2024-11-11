import { z } from "zod";
import { GetDefaultCostInputsSchema } from "@shared/schemas/custom-projects/get-cost-inputs.schema";

export type GetDefaultCostInputsDto = z.infer<
  typeof GetDefaultCostInputsSchema
>;
