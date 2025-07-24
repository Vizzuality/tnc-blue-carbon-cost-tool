import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

const useLatestChangelog = () => {
  const queryKey = queryKeys.methodology.changelogs.queryKey;

  return client.methodology.getChangeLogs.useQuery(
    queryKey,
    {},
    {
      queryKey,
      select: (response) => {
        if (response.body.data.length === 0) {
          return null;
        }

        return response.body.data?.sort((a, b) => {
          return (
            new Date(b?.createdAt ?? "").getTime() -
            new Date(a?.createdAt ?? "").getTime()
          );
        })[0];
      },
    },
  );
};

export default useLatestChangelog;
