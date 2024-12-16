"use client";

import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { ACTIVITY } from "@shared/entities/activity.enum";
import { EMISSION_FACTORS_TIER_TYPES } from "@shared/entities/carbon-inputs/emission-factors.entity";
import {
  CARBON_REVENUES_TO_COVER,
  PROJECT_SPECIFIC_EMISSION,
} from "@shared/entities/custom-project.entity";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { ASSUMPTIONS_NAME_TO_DTO_MAP } from "@shared/schemas/assumptions/assumptions.enums";
import {
  CreateCustomProjectSchema,
  LOSS_RATE_USED,
} from "@shared/schemas/custom-projects/create-custom-project.schema";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { getQueryClient } from "@/app/providers";

import ProjectForm from "@/containers/projects/form";
import { CreateCustomProjectForm } from "@/containers/projects/form/setup";
import Header from "@/containers/projects/new/header";
import ProjectSidebar from "@/containers/projects/new/sidebar";

import { ScrollArea } from "@/components/ui/scroll-area";

export const onSubmit = async (data: CreateCustomProjectForm) => {
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

  data = {
    ...originalValues,
    parameters: {
      ...originalValues.parameters,
      // @ts-expect-error fix later
      ...(originalValues.parameters?.plantingSuccessRate && {
        // @ts-expect-error fix later
        plantingSuccessRate: plantingSuccessRate / 100,
      }),
      ...(originalValues.activity === ACTIVITY.RESTORATION && {
        restorationYearlyBreakdown: [
          ...new Set(originalValues.parameters.restorationYearlyBreakdown),
        ].map((hectareas, index) => ({
          year: index,
          annualHectaresRestored: hectareas,
        })),
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

  const { status, body } =
    await client.customProjects.createCustomProject.mutation({ body: data });

  if (status === 201) {
    queryClient.setQueryData(queryKeys.customProjects.cached.queryKey, body);
  }
};

export default function CreateCustomProject() {
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

  const methods = useForm<CreateCustomProjectForm>({
    resolver: zodResolver(CreateCustomProjectSchema),
    defaultValues: {
      projectName: "test",
      activity: ACTIVITY.RESTORATION,
      ecosystem: ECOSYSTEM.SEAGRASS,
      countryCode: countryOptions?.[0]?.value,
      projectSizeHa: 20,
      carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
      initialCarbonPriceAssumption: 1000,
      parameters: {
        emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_1,
        lossRateUsed: LOSS_RATE_USED.PROJECT_SPECIFIC,
        projectSpecificLossRate: -35,
        projectSpecificEmission: PROJECT_SPECIFIC_EMISSION.ONE_EMISSION_FACTOR,
        projectSpecificEmissionFactor: 0,
        emissionFactorSOC: 0,
        emissionFactorAGB: 0,
        // @ts-expect-error fix later
        plantingSuccessRate: 80,
      },
      assumptions: {
        baselineReassessmentFrequency: undefined,
        buffer: undefined,
        carbonPriceIncrease: undefined,
        discountRate: undefined,
        projectLength: undefined,
        restorationRate: undefined,
        verificationFrequency: undefined,
      },
    },
    mode: "all",
  });

  return (
    <FormProvider {...methods}>
      <div className="flex flex-1 flex-col">
        <Header />
        <div className="flex flex-1 gap-3 overflow-hidden">
          <ProjectSidebar />
          <div className="mb-4 flex-1">
            <ScrollArea className="flex h-full gap-3 pr-6">
              <ProjectForm onSubmit={methods.handleSubmit(onSubmit)} />
            </ScrollArea>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
