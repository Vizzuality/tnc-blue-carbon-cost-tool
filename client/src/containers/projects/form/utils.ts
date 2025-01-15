import { ApiResponse } from "@shared/dtos/global/api-response.dto";
import { ACTIVITY } from "@shared/entities/activity.enum";
import { EMISSION_FACTORS_TIER_TYPES } from "@shared/entities/carbon-inputs/emission-factors.entity";
import {
  CARBON_REVENUES_TO_COVER,
  CustomProject,
  PROJECT_SPECIFIC_EMISSION,
} from "@shared/entities/custom-project.entity";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { ASSUMPTIONS_NAME_TO_DTO_MAP } from "@shared/schemas/assumptions/assumptions.enums";
import { LOSS_RATE_USED } from "@shared/schemas/custom-projects/custom-project.schema";
import { useSession } from "next-auth/react";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { getAuthHeader } from "@/lib/utils";

import { getQueryClient } from "@/app/providers";

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
        select: (data) =>
          data.body.data.map(({ name, code }) => ({
            label: name,
            value: code,
          })),
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

  // @ts-expect-error fix later
  return {
    projectName: project?.projectName || "",
    activity: project?.activity || ACTIVITY.CONSERVATION,
    ecosystem: project?.ecosystem || ECOSYSTEM.SEAGRASS,
    countryCode:
      (project?.input.countryCode || countryOptions?.[0]?.value) ?? "",
    projectSizeHa: project?.input.projectSizeHa || 20,
    carbonRevenuesToCover:
      project?.input.carbonRevenuesToCover || CARBON_REVENUES_TO_COVER.OPEX,
    initialCarbonPriceAssumption:
      project?.input.initialCarbonPriceAssumption || 1000,
    parameters: {
      emissionFactorUsed:
        project?.input.parameters.emissionFactorUsed ||
        EMISSION_FACTORS_TIER_TYPES.TIER_1,
      lossRateUsed:
        project?.input.parameters.lossRateUsed ||
        LOSS_RATE_USED.PROJECT_SPECIFIC,
      projectSpecificLossRate:
        project?.input.parameters.projectSpecificLossRate || -0.35,
      projectSpecificEmission:
        project?.input.parameters.projectSpecificEmission ||
        PROJECT_SPECIFIC_EMISSION.ONE_EMISSION_FACTOR,
      projectSpecificEmissionFactor:
        project?.input.parameters.projectSpecificEmissionFactor || 0,
      emissionFactorSOC: project?.input.parameters.emissionFactorSOC || 0,
      emissionFactorAGB: project?.input.parameters.emissionFactorAGB || 0,
      // where can i find this?
      plantingSuccessRate: 0.8,
    },
    assumptions: {
      baselineReassessmentFrequency:
        project?.input.assumptions.baselineReassessmentFrequency || undefined,
      buffer: project?.input.assumptions.buffer || undefined,
      carbonPriceIncrease:
        project?.input.assumptions.carbonPriceIncrease || undefined,
      discountRate: project?.input.assumptions.discountRate || undefined,
      projectLength: project?.input.assumptions.projectLength || undefined,
      restorationRate: project?.input.assumptions.restorationRate || undefined,
      verificationFrequency:
        project?.input.assumptions.verificationFrequency || undefined,
    },
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
