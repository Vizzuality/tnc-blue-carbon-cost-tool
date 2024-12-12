import { notFound } from "next/navigation";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { getAuthHeader } from "@/lib/utils";

import { auth } from "@/app/auth/api/[...nextauth]/config";

import CustomProject from "@/containers/projects/custom-project";

async function getCustomProject(id: string, accessToken: string) {
  const response = await client.customProjects.getCustomProject.query({
    params: { id },
    query: {
      include: ["country"],
    },
    extraHeaders: {
      ...getAuthHeader(accessToken),
    },
  });

  if (response.status !== 200) {
    throw new Error(`Failed to fetch project: ${response.status}`);
  }

  return response;
}

export default async function CustomProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const queryClient = new QueryClient();

  try {
    const id = (await params).id;
    const session = await auth();

    if (!session?.accessToken) {
      throw new Error("Unauthorized");
    }

    // Using fetchQuery because prefetchQuery will not throw or return any data
    // https://tanstack.com/query/latest/docs/reference/QueryClient#queryclientprefetchquery
    await queryClient.fetchQuery({
      queryKey: queryKeys.customProjects.one(id).queryKey,
      queryFn: async () => getCustomProject(id, session.accessToken),
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CustomProject id={id} />
      </HydrationBoundary>
    );
  } catch (e) {
    notFound();
  }
}
