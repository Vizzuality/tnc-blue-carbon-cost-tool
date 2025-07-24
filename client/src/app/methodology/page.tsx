import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import Methodology from "@/containers/methodology";

export default async function MethodologyPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.methodology.sources.queryKey,
    queryFn: () => client.methodology.getMethodologySources.query(),
  });

  await queryClient.prefetchQuery({
    queryKey: queryKeys.methodology.modelAssumptions.queryKey,
    queryFn: () => client.methodology.getAllModelAssumptions.query(),
  });

  await queryClient.prefetchQuery({
    queryKey: queryKeys.methodology.changelogs.queryKey,
    queryFn: () => client.methodology.getChangeLogs.query(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Methodology />
    </HydrationBoundary>
  );
}
