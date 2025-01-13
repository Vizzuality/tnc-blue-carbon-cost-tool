import { ACTIVITY } from "@shared/entities/activity.enum";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { QueryClient } from "@tanstack/react-query";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { getAuthHeader } from "@/lib/utils";

import { auth } from "@/app/auth/api/[...nextauth]/config";

const defaultActivity = ACTIVITY.CONSERVATION;
const defaultEcosystem = ECOSYSTEM.SEAGRASS;

/**
 * Prefetches the default project data, and the project data if the given project ID is provided.
 *
 * @param queryClient - The query client to prefetch the data.
 * @param projectId - The ID of the project to prefetch the data for.
 * @returns A promise that resolves when the data is prefetched.
 */
export async function prefetchProjectData(
  queryClient: QueryClient,
  projectId?: string,
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.customProjects.countries.queryKey,
    queryFn: () => client.customProjects.getAvailableCountries.query(),
  });

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

  if (projectId) {
    const session = await auth();

    await queryClient.prefetchQuery({
      queryKey: queryKeys.customProjects.one(projectId).queryKey,
      queryFn: () =>
        client.customProjects.getCustomProject.query({
          params: { id: projectId },
          query: {},
          extraHeaders: {
            ...getAuthHeader(session?.accessToken),
          },
        }),
    });
  }
}
