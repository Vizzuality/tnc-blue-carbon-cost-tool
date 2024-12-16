import { ACTIVITY } from "@shared/entities/activity.enum";
import { parseAsJson, useQueryState } from "nuqs";
import { z } from "zod";

import { queryKeys } from "@/lib/query-keys";

import { PAGINATION_SIZE_OPTIONS } from "@/components/ui/table-pagination";

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

const DEFAULT_QUERY_STATE = {
  ...INITIAL_FILTERS_STATE,
  sorting: [],
  pagination: {
    pageIndex: 0,
    pageSize: Number.parseInt(PAGINATION_SIZE_OPTIONS[0]),
  },
};

export const DEFAULT_CUSTOM_PROJECTS_QUERY_KEY =
  queryKeys.customProjects.all(DEFAULT_QUERY_STATE).queryKey;
