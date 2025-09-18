import { getProjectsQuerySchema } from "@shared/contracts/projects.contract";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { z } from "zod";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import {
  filtersSchema,
  INITIAL_FILTERS_STATE,
} from "@/app/(overview)/constants";

import Overview from "@/containers/overview";
import { TABLE_VIEWS } from "@/containers/overview/table/toolbar/table-selector";
import { filtersToQueryParams } from "@/containers/overview/utils";

export default async function OverviewPage({
  searchParams,
}: {
  searchParams?: Promise<{
    filters: string;
    table: (typeof TABLE_VIEWS)[number];
  }>;
}) {
  const queryClient = new QueryClient();
  const sp = await searchParams;
  const parsedFilters = filtersSchema.safeParse(
    JSON.parse(sp?.filters || "{}"),
  );

  const queryParams: z.infer<typeof getProjectsQuerySchema> = {
    ...filtersToQueryParams(
      parsedFilters.success ? parsedFilters.data : INITIAL_FILTERS_STATE,
    ),
    costRangeSelector: parsedFilters.success
      ? parsedFilters.data.costRangeSelector
      : INITIAL_FILTERS_STATE.costRangeSelector,
    partialProjectName: parsedFilters.success
      ? parsedFilters.data.keyword
      : INITIAL_FILTERS_STATE.keyword,
  };

  await queryClient.prefetchQuery({
    queryKey: queryKeys.projects.bounds(queryParams).queryKey,
    queryFn: () =>
      client.projects.getProjectsFiltersBounds.query({
        query: queryParams,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Overview />
    </HydrationBoundary>
  );
}
