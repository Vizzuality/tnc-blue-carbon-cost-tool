import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import CustomProject from "@/containers/projects/custom-project";

export default function CustomProjectPreviewPage() {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CustomProject />
    </HydrationBoundary>
  );
}
