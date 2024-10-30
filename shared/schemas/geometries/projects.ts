import { z } from "zod";

export const ProjectGeoPropertiesSchema = z.object({
  abatementPotential: z.number(),
  cost: z.number(),
  country: z.string(),
});

export const ProjectMapQuerySchema = z.object({
  countryCode: z.string().array(),
  totalCost: z.number().array(),
  abatementPotential: z.number().array(),
  activity: z.string().array(),
  activitySubtype: z.string().array(),
  ecosystem: z.string().array(),
  projectSizeFilter: z.number().array(),
  priceType: z.string().array(),
});
