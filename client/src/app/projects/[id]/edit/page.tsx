import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { prefetchProjectData } from "@/app/projects/utils";

import CustomProjectForm from "@/containers/projects/form";

export default async function EditCustomProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const queryClient = new QueryClient();

  await prefetchProjectData(queryClient, params.id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CustomProjectForm id={params.id} />
    </HydrationBoundary>
  );
}
