import { z } from "zod";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";

export const GetActivityTypesDefaultsSchema = z.object({
  countryCode: z.string().min(3).max(3),
  ecosystem: z.nativeEnum(ECOSYSTEM),
});
