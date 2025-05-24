import { z } from "zod";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";

// Schema to get the restoration plan that will be used to create the custom project

export const GetRestorationPlanSchema = z.object({
    projectSizeHa: z.preprocess(Number, z.number().positive()),
    restorationProjectLength: z.preprocess(Number, z.number().positive()),
    restorationRate: z.preprocess(Number, z.number().positive())
});
