import { ACTIVITY } from "@shared/entities/activity.enum";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { assumptionsArrayToMap } from "@shared/lib/transform-create-custom-project-payload";
import {
  CustomProjectBaseSchema,
  CustomProjectForm,
  ValidatedCustomProjectForm,
} from "@shared/schemas/custom-projects/create-custom-project.schema";
import { z } from "zod";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { getQueryClient } from "@/app/providers";

export const getDefaultAssumptions = (
  ecosystem: ECOSYSTEM,
  activity: ACTIVITY,
) => {
  const queryClient = getQueryClient();

  const assumptionsData =
    client.customProjects.getDefaultAssumptions.getQueryData(
      queryClient,
      queryKeys.customProjects.assumptions({
        ecosystem: ecosystem,
        activity: activity,
      }).queryKey,
    )?.body.data;

  return assumptionsData ? assumptionsArrayToMap(assumptionsData) : {};
};

export const getDefaultCostInputs = (data: CustomProjectForm) => {
  const { ecosystem, activity, countryCode } = data;
  const queryClient = getQueryClient();

  return client.customProjects.getDefaultCostInputs.getQueryData(
    queryClient,
    queryKeys.customProjects.defaultCosts({
      ecosystem: ecosystem,
      activity: activity,
      countryCode: countryCode,
      ...(activity === ACTIVITY.RESTORATION && {
        restorationActivity:
          "restorationActivity" in data.parameters
            ? data.parameters.restorationActivity
            : undefined,
      }),
    }).queryKey,
  )?.body.data as z.infer<typeof CustomProjectBaseSchema>["costInputs"];
};

export const parseFormValues = (
  formValues: CustomProjectForm,
  assumptions: z.infer<typeof CustomProjectBaseSchema>["assumptions"],
  costInputs: z.infer<typeof CustomProjectBaseSchema>["costInputs"],
): ValidatedCustomProjectForm => {
  return {
    ...formValues,
    parameters: {
      ...formValues.parameters,
      // @ts-expect-error fix later
      ...(formValues.parameters?.plantingSuccessRate && {
        plantingSuccessRate:
          // @ts-expect-error fix later
          formValues.parameters.plantingSuccessRate,
      }),
    },
    assumptions,
    costInputs,
  };
};

const modules = {
  getDefaultAssumptions,
  getDefaultCostInputs,
  parseFormValues,
};

export default modules;
