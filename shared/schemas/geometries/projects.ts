import { z } from "zod";

export const ProjectGeoPropertiesSchema = z.object({
  abatementPotential: z.number(),
  cost: z.number(),
  country: z.string(),
});

export type ProjectGeoProperties = z.infer<typeof ProjectGeoPropertiesSchema>;

