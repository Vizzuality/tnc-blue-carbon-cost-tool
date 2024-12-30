import { QueryClient, dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";

import { getServerSession } from "@/lib/auth/server";
import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import Profile from "@/containers/profile";

export default async function ProfilePage() {
  const queryClient = new QueryClient();
  const session = await getServerSession();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.user.me(session?.user.id as string).queryKey,
    queryFn: () =>
      client.user.findMe.query({
        extraHeaders: {
          authorization: `Bearer ${session?.accessToken as string}`,
        },
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Profile />
    </HydrationBoundary>
  );
}
