import { redirect } from "next/navigation";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { FEATURE_FLAGS } from "@/lib/feature-flags";

import { prefetchProjectData } from "@/app/projects/utils";

import CustomProjectForm from "@/containers/projects/form";

export default async function EditCustomProjectPage({
  params,
}: {
  params: { id: string };
}) {
  if (!FEATURE_FLAGS["edit-project"]) {
    redirect(`/projects/${params.id}`);
  }

  const queryClient = new QueryClient();

  await prefetchProjectData(queryClient, params.id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CustomProjectForm id={params.id} />
    </HydrationBoundary>
  );
}
