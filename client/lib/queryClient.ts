import { router } from "@shared/contracts";
import { initQueryClient } from "@ts-rest/react-query";

// TODO: We need to get the baseUrl from the environment, pending to decide where to store this data. Right now the API
//       is getting all the conf from the shared folder

export const client = initQueryClient(router, {
  validateResponse: true,
  baseUrl: "localhost:4000",
});
