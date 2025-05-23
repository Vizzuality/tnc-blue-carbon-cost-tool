import { z } from "zod";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";

// Schema to get the restoration plan that will be used to create the custom project

// TODO: This is the simplest approach, but we are forcing the FE to always send
//       the size, length, and rate that will be used. If we agree on this, ecosystem won't be requird

export const GetRestorationPlanSchema = z.object({
    projectSizeHa: z.preprocess(Number, z.number().positive()),
    ecosystem: z.nativeEnum(ECOSYSTEM).optional(),
    restorationProjectLength: z.preprocess(Number, z.number().positive()),
    restorationRate: z.preprocess(Number, z.number().positive())
});
