import { GetAssumptionsSchema } from "@shared/schemas/custom-projects/get-cost-inputs.schema";
import { z } from "zod";

export type GetOverridableAssumptionsDTO = z.infer<typeof GetAssumptionsSchema>;
