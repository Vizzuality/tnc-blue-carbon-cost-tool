import { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

import { CustomProject as CustomProjectEntity } from "@shared/entities/custom-project.entity";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { getAuthHeader } from "@/lib/utils";

export function useGetCustomProject(id?: string) {
  const { data: session } = useSession();
  const queryCache = useQueryClient().getQueryData<{
    data: InstanceType<typeof CustomProjectEntity>;
  }>(queryKeys.customProjects.cached.queryKey);
  const { queryKey } = queryKeys.customProjects.one(id, {
    include: ["country"],
  });
  const getCustomProjectQuery = client.customProjects.getCustomProject.useQuery(
    queryKey,
    {
      params: { id: id! },
      extraHeaders: {
        ...getAuthHeader(session?.accessToken as string),
      },
      query: {
        include: ["country"],
      },
    },
    {
      queryKey: queryKey,
      enabled: !!id,
    },
  );
  const pathname = usePathname();
  const router = useRouter();
  const data = getCustomProjectQuery.data?.body.data || queryCache?.data;

  useEffect(() => {
    if (pathname === "/projects/preview" && !queryCache) {
      router.push("/projects/new");
    }
  }, [queryCache, pathname, router]);

  return { data, isFetching: getCustomProjectQuery.isFetching };
}
