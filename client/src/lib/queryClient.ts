import { router } from "@shared/contracts";
import { QueryClient } from "@tanstack/react-query";
import { initQueryClient } from "@ts-rest/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    },
  });
}

// TODO: We need to get the baseUrl from the environment, pending to decide where to store this data. Right now the API
//       is getting all the conf from the shared folder

const client = initQueryClient(router, {
  validateResponse: true,
  baseUrl: process.env.NEXT_PUBLIC_API_URL as string,
});

export { client, makeQueryClient };
