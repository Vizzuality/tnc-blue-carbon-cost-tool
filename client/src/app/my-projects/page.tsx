import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getServerSession } from "@/lib/auth/server";
import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import MyProjectsView from "@/containers/my-projects";

export default async function MyProjects() {
  const queryClient = new QueryClient();
  const session = await getServerSession();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.customProjects.all().queryKey,
    queryFn: () =>
      client.customProjects.getCustomProjects.query({
        query: {
          include: ["country"],
        },
        extraHeaders: {
          authorization: `Bearer ${session?.accessToken as string}`,
        },
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyProjectsView />
    </HydrationBoundary>
  );
}
