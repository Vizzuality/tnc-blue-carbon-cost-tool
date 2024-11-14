import { ACTIVITY } from "@shared/entities/activity.enum";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
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
    queryKey: queryKeys.customProjects.countries.queryKey,
    queryFn: () => client.customProjects.getAvailableCountries.query(),
  });

  const defaultActivity = ACTIVITY.CONSERVATION;
  const defaultEcosystem = ECOSYSTEM.SEAGRASS;

  await queryClient.prefetchQuery({
    queryKey: queryKeys.customProjects.assumptions({
      ecosystem: defaultEcosystem,
      activity: defaultActivity,
    }).queryKey,
    queryFn: () =>
      client.customProjects.getDefaultAssumptions.query({
        query: { ecosystem: defaultEcosystem, activity: defaultActivity },
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CreateCustomProject />
    </HydrationBoundary>
  );
}
