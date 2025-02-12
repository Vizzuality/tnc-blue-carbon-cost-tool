import { useCallback } from "react";

import { Path, useFormContext } from "react-hook-form";

import { AssumptionsResponse } from "@shared/contracts/custom-projects.contract";
import { ApiResponse } from "@shared/dtos/global/api-response.dto";
import { ACTIVITY } from "@shared/entities/activity.enum";
import { CustomProject } from "@shared/entities/custom-project.entity";
import { ASSUMPTIONS_NAME_TO_DTO_MAP } from "@shared/schemas/assumptions/assumptions.enums";
import { MAX_PROJECT_LENGTH } from "@shared/schemas/custom-projects/create-custom-project.schema";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { getAuthHeader } from "@/lib/utils";

import { getQueryClient } from "@/app/providers";

import {
  DEFAULT_COMMON_FORM_VALUES,
  DEFAULT_CONSERVATION_FORM_VALUES,
} from "@/containers/projects/form/constants";
import { RestorationPlanFormProperty } from "@/containers/projects/form/restoration-plan/columns";
import { CustomProjectForm } from "@/containers/projects/form/setup";

export const parseFormValues = (data: CustomProjectForm) => {
  const queryClient = getQueryClient();

  const originalValues = { ...data };

  const assumptionsResponse =
    client.customProjects.getDefaultAssumptions.getQueryData(
      queryClient,
      queryKeys.customProjects.assumptions({
        ecosystem: data.ecosystem,
        activity: data.activity,
      }).queryKey,
    );

  const costsResponse = client.customProjects.getDefaultCostInputs.getQueryData(
    queryClient,
    queryKeys.customProjects.defaultCosts({
      ecosystem: data.ecosystem,
      activity: data.activity,
      countryCode: data.countryCode,
      // @ts-expect-error fix later
      restorationActivity: data.parameters?.restorationActivity,
    }).queryKey,
  );

  const costs = costsResponse?.body.data;

  const defaultAssumptionsToObject = assumptionsResponse?.body.data.reduce(
    (acc, { name, value }) => {
      return {
        ...acc,
        [ASSUMPTIONS_NAME_TO_DTO_MAP[
          name as keyof typeof ASSUMPTIONS_NAME_TO_DTO_MAP
        ]]: Number(value as NonNullable<typeof value>),
      };
    },
    {},
  );

  const isRestoration = data.activity === ACTIVITY.RESTORATION;

  const validYears = isRestoration // @ts-expect-error fix later
    ? (originalValues.parameters.restorationYearlyBreakdown as number[])
        .map((v, index) => ({
          year: index == 0 ? -1 : index,
          hectares: v,
        }))
        .filter((v) => v.hectares > 0)
    : [];

  const {
    // @ts-expect-error fix later
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    restorationYearlyBreakdown,
    ...restParameters
  } = originalValues.parameters;

  return {
    ...originalValues,
    parameters: {
      ...restParameters,
      // @ts-expect-error fix later
      ...(restParameters?.plantingSuccessRate && {
        plantingSuccessRate:
          // @ts-expect-error fix later
          restParameters.plantingSuccessRate / 100,
      }),
      ...(isRestoration && {
        ...(validYears.length > 0 && {
          restorationYearlyBreakdown: validYears.map(({ year, hectares }) => ({
            year,
            annualHectaresRestored: hectares,
          })),
        }),
      }),
    },
    assumptions: {
      ...Object.keys(originalValues.assumptions ?? {}).reduce(
        (acc, assumptionKey) => {
          return {
            ...acc,
            [assumptionKey]:
              originalValues.assumptions?.[
                assumptionKey as keyof typeof originalValues.assumptions
              ] ??
              defaultAssumptionsToObject?.[
                assumptionKey as keyof typeof defaultAssumptionsToObject
              ],
          };
        },
        {},
      ),
    },
    costInputs: {
      ...Object.keys(originalValues.costInputs ?? {}).reduce((acc, costKey) => {
        return {
          ...acc,
          [costKey]:
            originalValues.costInputs?.[
              costKey as keyof typeof originalValues.costInputs
            ] ?? costs?.[costKey as keyof typeof costs],
        };
      }, {}),
    },
  };
};

/**
 * Note: All percentage values are kept in decimal form,
 * formatting to whole percentage values (for UI display) is done at input component level
 *
 * @returns initial values for the form
 */
export const useDefaultFormValues = (id?: string): CustomProjectForm => {
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
  const { data: project } = client.customProjects.getCustomProject.useQuery(
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
  };
};

export const updateCustomProject = async (options: {
  body: CustomProjectForm;
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
  } catch (e) {
    throw new Error("Something went wrong updating the project");
  }
};

export const createCustomProject = async (options: {
  body: CustomProjectForm;
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
 * @returns An array of yearly restoration data where:
 *          - First entry is year -1
 *          - Followed by years 1 through projectLength
 */
export function getRestorationPlanTableData(
  projectLength?: number | null,
  defaultLength?: number,
): RestorationPlanFormProperty[] {
  const totalYears = projectLength ? Number(projectLength) : defaultLength;

  if (!totalYears || totalYears <= 0 || totalYears > MAX_PROJECT_LENGTH) {
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
