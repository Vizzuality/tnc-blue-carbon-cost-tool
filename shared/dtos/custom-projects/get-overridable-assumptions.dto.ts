import { z } from "zod";
import { GetAssumptionsSchema } from "@shared/schemas/assumptions/get-assumptions.schema";

export type GetOverridableAssumptionsDTO = z.infer<typeof GetAssumptionsSchema>;
