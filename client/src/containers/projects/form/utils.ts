import { useCallback } from "react";

import { Path, useFormContext } from "react-hook-form";

import { AssumptionsResponse } from "@shared/contracts/custom-projects.contract";
import { ApiResponse } from "@shared/dtos/global/api-response.dto";
import { ACTIVITY } from "@shared/entities/activity.enum";
import { CustomProject } from "@shared/entities/custom-project.entity";
import { MAX_PROJECT_LENGTH } from "@shared/schemas/custom-projects/create-custom-project.schema";
import { ValidatedCustomProjectForm } from "@shared/schemas/custom-projects/create-custom-project.schema";
import { CustomProjectForm } from "@shared/schemas/custom-projects/create-custom-project.schema";
import {
  DEFAULT_COMMON_FORM_VALUES,
  DEFAULT_CONSERVATION_FORM_VALUES,
  DEFAULT_RESTORATION_FORM_VALUES,
} from "@shared/schemas/custom-projects/custom-project-form.constants";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { getAuthHeader } from "@/lib/utils";

import { getQueryClient } from "@/app/providers";

import { RestorationPlanFormProperty } from "@/containers/projects/form/restoration-plan/columns";
/**
 * Note: All percentage values are kept in decimal form,
 * formatting to whole percentage values (for UI display) is done at input component level
 *
 * @returns initial values for the form
 */
export const useDefaultFormValues = (
  useCache: boolean,
  id?: string,
): CustomProjectForm => {
  const { data: session } = useSession();
  const { queryKey } = queryKeys.customProjects.countries;
  const { data: countryOptions } =
    client.customProjects.getAvailableCountries.useQuery(
      queryKey,
      {},
      {
        queryKey,
        select: (data) => {
          return data.body.data.map(({ name, code }) => ({
            label: name,
            value: code,
          }));
        },
      },
    );
  const getCustomProjectQuery = client.customProjects.getCustomProject.useQuery(
    queryKeys.customProjects.one(id).queryKey,
    {
      params: { id: id as string },
      query: {},
      extraHeaders: {
        ...getAuthHeader(session?.accessToken),
      },
    },
    {
      queryKey: queryKeys.customProjects.one(id).queryKey,
      enabled: !!id,
      select: (data) => data.body.data,
    },
  );

  const queryClient = useQueryClient();

  const assumptionsResponse = queryClient.getQueryData<AssumptionsResponse>(
    queryKeys.customProjects.assumptions({
      ecosystem: DEFAULT_COMMON_FORM_VALUES.ecosystem,
      activity: DEFAULT_CONSERVATION_FORM_VALUES.activity,
    }).queryKey,
  );

  const initialCarbonPriceAssumption =
    assumptionsResponse?.status === 200
      ? Number(
          assumptionsResponse?.body.data.find(
            ({ name }) => name === "Carbon price",
          )?.value,
        )
      : 0;

  const queryCache = queryClient.getQueryData<{
    data: InstanceType<typeof CustomProject>;
  }>(queryKeys.customProjects.cached.queryKey);

  const project: CustomProject | null =
    getCustomProjectQuery.data || (useCache && queryCache?.data) || null;

  if (project) {
    const commonAttributes: Pick<
      CustomProjectForm,
      | "projectName"
      | "ecosystem"
      | "countryCode"
      | "projectSizeHa"
      | "carbonRevenuesToCover"
      | "initialCarbonPriceAssumption"
      | "assumptions"
      | "costInputs"
    > = {
      projectName: project.projectName,
      ecosystem: project.ecosystem,
      countryCode: project.input.countryCode,
      projectSizeHa: project.input.projectSizeHa,
      carbonRevenuesToCover: project.input.carbonRevenuesToCover,
      initialCarbonPriceAssumption: project.input.initialCarbonPriceAssumption,
      assumptions: {
        baselineReassessmentFrequency:
          project?.input.assumptions.baselineReassessmentFrequency,
        buffer: project?.input.assumptions.buffer,
        carbonPriceIncrease: project?.input.assumptions.carbonPriceIncrease,
        discountRate: project?.input.assumptions.discountRate,
        projectLength: project?.input.assumptions.projectLength,
        restorationRate: project?.input.assumptions.restorationRate,
        verificationFrequency: project?.input.assumptions.verificationFrequency,
      },
      costInputs: project?.input.costInputs,
    };

    if (project.activity === ACTIVITY.RESTORATION) {
      return {
        activity: project.activity,
        ...commonAttributes,
        parameters: {
          tierSelector: project.input.parameters.tierSelector,
          plantingSuccessRate: project.input.parameters.plantingSuccessRate,
          restorationActivity: project.input.parameters.restorationActivity,
          restorationYearlyBreakdown:
            project.input.parameters.restorationYearlyBreakdown,
          projectSpecificSequestrationRate:
            project.input.parameters.projectSpecificSequestrationRate,
        },
      };
    }

    if (project.activity === ACTIVITY.CONSERVATION) {
      return {
        activity: project.activity,
        ...commonAttributes,
        parameters: {
          emissionFactorUsed: project.input.parameters.emissionFactorUsed,
          lossRateUsed: project.input.parameters.lossRateUsed,
          projectSpecificLossRate:
            project.input.parameters.projectSpecificLossRate,
          projectSpecificEmission:
            project.input.parameters.projectSpecificEmission,
          projectSpecificEmissionFactor:
            project.input.parameters.projectSpecificEmissionFactor,
          emissionFactorSOC: project.input.parameters.emissionFactorSOC,
          emissionFactorAGB: project.input.parameters.emissionFactorAGB,
        },
      };
    }
  }

  return {
    ...DEFAULT_COMMON_FORM_VALUES,
    ...DEFAULT_CONSERVATION_FORM_VALUES,
    activity: ACTIVITY.CONSERVATION,
    countryCode: countryOptions?.[0]?.value ?? "",
    initialCarbonPriceAssumption,
    parameters: {
      ...DEFAULT_CONSERVATION_FORM_VALUES.parameters,
      ...DEFAULT_RESTORATION_FORM_VALUES.parameters,
    },
  };
};

export const updateCustomProject = async (options: {
  body: ValidatedCustomProjectForm;
  params: { id: string };
  extraHeaders:
    | {
        Authorization?: undefined;
      }
    | {
        Authorization: string;
      };
}): Promise<void> => {
  try {
    const { status, body } =
      await client.customProjects.updateCustomProject.mutation(options);

    if (status !== 200) {
      throw new Error(
        body?.errors?.[0].title || "Something went wrong updating the project",
      );
    }

    const queryClient = getQueryClient();
    queryClient.invalidateQueries({
      queryKey: queryKeys.customProjects.one(options.params.id, {
        include: ["country"],
      }).queryKey,
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.customProjects.one(options.params.id).queryKey,
    });
  } catch (e) {
    throw new Error("Something went wrong updating the project");
  }
};

export const createCustomProject = async (options: {
  body: ValidatedCustomProjectForm;
}): Promise<ApiResponse<CustomProject>> => {
  try {
    const { status, body } =
      await client.customProjects.createCustomProject.mutation(options);

    if (status !== 201) {
      throw new Error(
        body?.errors?.[0].title || "Something went wrong creating the project",
      );
    }

    return body;
  } catch (e) {
    throw new Error("Something went wrong creating the project");
  }
};

export const useCustomProjectForm = () => {
  const form = useFormContext<CustomProjectForm>();
  const handleFormChange = useCallback(
    async (fieldName: Path<CustomProjectForm>, value: number | null) => {
      const newValue = value === null ? undefined : Number(value);
      form.setValue(fieldName, newValue);
      await form.trigger(fieldName);
    },
    [form],
  );

  return {
    form,
    handleFormChange,
  };
};

/**
 *
 * @param projectLength - The number of years the restoration project will run
 *
 * @param defaultLength - Fallback length to use if projectLength is not provided
 *
 * @param maxProjectLength - The maximum number of years the restoration project can run
 *
 * @returns An array of yearly restoration data where:
 *          - First entry is year -1
 *          - Followed by years 1 through projectLength
 */
export function getRestorationPlanTableData(
  projectLength?: number | null,
  defaultLength?: number,
  maxProjectLength?: number,
): RestorationPlanFormProperty[] {
  const totalYears = projectLength ? Number(projectLength) : defaultLength;
  let maxYears = MAX_PROJECT_LENGTH;

  if (typeof maxProjectLength === "number" && maxProjectLength > 0) {
    maxYears = maxProjectLength;
  }

  if (!totalYears || totalYears <= 0 || totalYears > maxYears) {
    return [];
  }

  return [
    { year: -1, annualHectaresRestored: 0 },
    ...Array.from({ length: totalYears }, (_, i) => ({
      year: i + 1,
      annualHectaresRestored: 0,
    })),
  ];
}
