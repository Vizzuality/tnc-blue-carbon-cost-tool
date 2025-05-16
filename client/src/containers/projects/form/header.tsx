import { useCallback } from "react";

import { useFormContext } from "react-hook-form";

import { useRouter } from "next/navigation";

import {
  CreateCustomProjectSchema,
  CustomProjectForm,
  LOSS_RATE_USED,
  RestorationPlanDTOSchema,
} from "@shared/schemas/custom-projects/create-custom-project.schema";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { queryKeys } from "@/lib/query-keys";
import { getAuthHeader } from "@/lib/utils";

import {
  createCustomProject,
  updateCustomProject,
} from "@/containers/projects/form/utils";
import { parseFormValues } from "@/containers/projects/form/utils/parse-form-values";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/components/ui/toast/use-toast";
import { ACTIVITY } from "@shared/entities/activity.enum";
import { getRestorationPlanDTO } from "@shared/lib/transform-create-custom-project-payload";
import { z } from "zod";

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
    async (formValues: CustomProjectForm) => {
      try {
        const data = parseFormValues(formValues);
        const customProjectValidation =
          CreateCustomProjectSchema.safeParse(data);

        let restorationPlanValidation: ReturnType<
          typeof RestorationPlanDTOSchema.safeParse
        > = {
          success: true,
          data: [],
          error: z.NEVER,
        };

        if (data.activity === ACTIVITY.RESTORATION) {
          restorationPlanValidation = RestorationPlanDTOSchema.safeParse(
            getRestorationPlanDTO(
              data.parameters.restorationYearlyBreakdown || [],
            ),
          );

          if (restorationPlanValidation.success) {
            delete data.parameters.restorationYearlyBreakdown;
            data.parameters.customRestorationPlan =
              restorationPlanValidation.data;
          }
        }

        if (
          !customProjectValidation.success ||
          !restorationPlanValidation.success
        ) {
          // Set errors for each field that failed validation
          [
            ...(customProjectValidation.error?.errors || []),
            ...(restorationPlanValidation.error?.errors || []),
          ].forEach((error) => {
            methods.setError(error.path.join(".") as keyof CustomProjectForm, {
              type: "custom",
              message: error.message,
            });
          });
          return;
        }

        if (isEdit) {
          await updateCustomProject({
            body: data,
            params: { id: id as string },
            extraHeaders: {
              ...getAuthHeader(session?.accessToken as string),
            },
          });
          router.push(`/projects/${id}`);
        } else {
          const result = await createCustomProject({
            body: data,
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
          onClick={() => {
            // Making sure only the necessary fields are included:
            if (
              methods.getValues("parameters.lossRateUsed") ===
                LOSS_RATE_USED.NATIONAL_AVERAGE &&
              methods.getValues("parameters.projectSpecificLossRate")
            ) {
              methods.unregister("parameters.projectSpecificLossRate");
            }
            methods.handleSubmit(handleSubmit)();
          }}
        >
          {isEdit ? "Save" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
