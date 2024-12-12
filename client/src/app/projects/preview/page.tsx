import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import mockResponse from "@/app/projects/preview/mock-response";

import CustomProject from "@/containers/projects/custom-project";

export const CUSTOM_PROJECT_MOCK_QUERYKEY = ["custom-project-mock-data"];
export default function CustomProjectPreviewPage() {
  /**
   *
   * Mimic queryCache from createCustomProject response
   *
   * This is only for testing purpose with the current mock data,
   * and should be replaced when the complete user flow is done
   */

  const queryClient = new QueryClient();
  queryClient.setQueryData(CUSTOM_PROJECT_MOCK_QUERYKEY, mockResponse);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CustomProject />
    </HydrationBoundary>
  );
}
