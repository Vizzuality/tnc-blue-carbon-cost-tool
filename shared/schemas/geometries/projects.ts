import { z } from "zod";
import { COST_TYPE_SELECTOR } from "@shared/entities/projects.entity";

export const ProjectGeoPropertiesSchema = z.object({
  abatementPotential: z.number(),
  cost: z.number(),
  country: z.string(),
});

export const ProjectMapQuerySchema = z.object({
  countryCode: z.string().array(),
  costRangeSelector: z.nativeEnum(COST_TYPE_SELECTOR),
  totalCost: z.number().array(),
  abatementPotentialRange: z.number().array(),
  activity: z.string().array(),
  activitySubtype: z.string().array(),
  ecosystem: z.string().array(),
  projectSizeFilter: z.number().array(),
  priceType: z.string().array(),
});
