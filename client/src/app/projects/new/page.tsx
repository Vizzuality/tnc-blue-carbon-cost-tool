import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import CreateCustomProject from "@/containers/projects/new";

export default async function CreateCustomProjectPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.projects.countries.queryKey,
    queryFn: () => client.projects.getProjectCountries.query(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CreateCustomProject />
    </HydrationBoundary>
  );
}
