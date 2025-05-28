import {
    AssumptionsSchema,
    CustomProjectBaseSchema,
} from "@shared/schemas/custom-projects/create-custom-project.schema";
import { z } from "zod";

export const GetRestorationPlanSchema = z.object({
    projectSizeHa: CustomProjectBaseSchema.shape.projectSizeHa,
    restorationProjectLength: AssumptionsSchema.shape.projectLength,
    restorationRate: AssumptionsSchema.shape.restorationRate,
})
