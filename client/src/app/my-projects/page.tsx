import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { auth } from "@/app/auth/api/[...nextauth]/config";

import MyProjectsView from "@/containers/my-projects";

export default async function MyProjects() {
  const queryClient = new QueryClient();
  const session = await auth();

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
