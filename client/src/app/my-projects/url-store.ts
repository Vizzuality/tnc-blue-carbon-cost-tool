import { ACTIVITY } from "@shared/entities/activity.enum";
import { parseAsJson, useQueryState } from "nuqs";
import { z } from "zod";

export const filtersSchema = z.object({
  activity: z.array(z.nativeEnum(ACTIVITY)),
  keyword: z.string().optional(),
});

export const INITIAL_FILTERS_STATE: z.infer<typeof filtersSchema> = {
  activity: [],
  keyword: "",
};

export function useMyProjectsFilters() {
  return useQueryState(
    "filters",
    parseAsJson(filtersSchema.parse).withDefault(INITIAL_FILTERS_STATE),
  );
}
