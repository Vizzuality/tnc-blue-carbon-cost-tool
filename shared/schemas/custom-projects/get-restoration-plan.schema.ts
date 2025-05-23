import { z } from "zod";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";

// Schema to get the restoration plan that will be used to create the custom project

export const GetRestorationPlanSchema = z.object({
    projectSizeHa: z.number(),
    ecosystem: z.nativeEnum(ECOSYSTEM),
    restorationProjectLength: z.number().optional(),
    restorationRate: z.number().optional(),
});
