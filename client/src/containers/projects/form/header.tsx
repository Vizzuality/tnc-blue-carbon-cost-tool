import { useCallback } from "react";

import { useFormContext } from "react-hook-form";

import { useRouter } from "next/navigation";

import { CreateCustomProjectSchema } from "@shared/schemas/custom-projects/create-custom-project.schema";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { queryKeys } from "@/lib/query-keys";
import { getAuthHeader } from "@/lib/utils";

import { CustomProjectForm } from "@/containers/projects/form/setup";
import {
  createCustomProject,
  updateCustomProject,
} from "@/containers/projects/form/utils";
import parseFormValues from "@/containers/projects/form/utils/parse-form-values";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/components/ui/toast/use-toast";

interface HeaderProps {
  name: string;
  id?: string;
}

export default function Header({ name, id }: HeaderProps) {
  const methods = useFormContext<CustomProjectForm>();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = !!id;
  const handleSubmit = useCallback(
    async (data: CustomProjectForm) => {
      try {
        const formValues = parseFormValues(data);
        const result = CreateCustomProjectSchema.safeParse(formValues);

        if (!result.success) {
          // Set errors for each field that failed validation
          result.error.errors.forEach((error) => {
            methods.setError(error.path.join(".") as keyof CustomProjectForm, {
              type: "custom",
              message: error.message,
            });
          });
          return;
        }

        if (isEdit) {
          await updateCustomProject({
            body: formValues,
            params: { id: id as string },
            extraHeaders: {
              ...getAuthHeader(session?.accessToken as string),
            },
          });
          router.push(`/projects/${id}`);
        } else {
          const result = await createCustomProject({
            body: formValues,
          });

          queryClient.setQueryData(
            queryKeys.customProjects.cached.queryKey,
            result,
          );
          router.push("/projects/preview");
        }
      } catch (e) {
        toast({
          variant: "destructive",
          description:
            e instanceof Error
              ? e.message
              : "Something went wrong saving the project",
        });
      }
    },
    [id, session, router, queryClient, isEdit, toast, methods],
  );

  return (
    <div className="flex h-16 items-center justify-between py-3 pr-6">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <h2 className="text-2xl font-medium">
          {isEdit ? `Edit ${name}` : "Custom project"}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary">Cancel</Button>
        <Button
          disabled={!methods.formState.isValid}
          onClick={methods.handleSubmit(handleSubmit)}
        >
          {isEdit ? "Save" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
