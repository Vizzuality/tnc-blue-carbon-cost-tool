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
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  if (!FEATURE_FLAGS["edit-project"]) {
    redirect(`/projects/${p.id}`);
  }

  const queryClient = new QueryClient();

  await prefetchProjectData(queryClient, p.id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CustomProjectForm id={p.id} />
    </HydrationBoundary>
  );
}
