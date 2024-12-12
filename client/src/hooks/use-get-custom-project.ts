import { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

import { CustomProject as CustomProjectEntity } from "@shared/entities/custom-project.entity";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { getAuthHeader } from "@/lib/utils";

import { CUSTOM_PROJECT_MOCK_QUERYKEY } from "@/app/projects/preview/page";

export function useGetCustomProject(id?: string) {
  const { data: session } = useSession();
  const queryCache = useQueryClient().getQueryData<{
    data: InstanceType<typeof CustomProjectEntity>;
  }>(CUSTOM_PROJECT_MOCK_QUERYKEY);
  const getCustomProjectQuery = client.customProjects.getCustomProject.useQuery(
    queryKeys.customProjects.one(id || "").queryKey,
    {
      params: { id: id || "" },
      extraHeaders: {
        ...getAuthHeader(session?.accessToken as string),
      },
      query: {
        include: ["country"],
      },
    },
    {
      queryKey: queryKeys.customProjects.one(id || "").queryKey,
      enabled: !!id,
    },
  );
  const pathname = usePathname();
  const router = useRouter();
  const data = queryCache?.data || getCustomProjectQuery.data?.body.data;

  useEffect(() => {
    if (pathname === "/projects/preview" && !queryCache) {
      router.push("/projects/new");
    }
  }, [queryCache, pathname, router]);

  return data as CustomProjectEntity;
}
