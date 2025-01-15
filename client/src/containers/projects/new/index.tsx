"use client";

import { useEffect, useRef } from "react";

import { FormProvider, useForm } from "react-hook-form";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

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
import { ExtractAtomValue, useSetAtom } from "jotai";

import { toDecimalPercentageValue, toPercentageValue } from "@/lib/format";
import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { getQueryClient } from "@/app/providers";

import ProjectForm from "@/containers/projects/form";
import { CreateCustomProjectForm } from "@/containers/projects/form/setup";
import Header from "@/containers/projects/new/header";
import ProjectSidebar from "@/containers/projects/new/sidebar";
import { formStepAtom } from "@/containers/projects/store";

import { ScrollArea } from "@/components/ui/scroll-area";

export const onSubmit = async (
  data: CreateCustomProjectForm,
  router: AppRouterInstance,
) => {
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

  data = {
    ...originalValues,
    parameters: {
      ...restParameters,
      // @ts-expect-error fix later
      ...(restParameters?.projectSpecificLossRate && {
        projectSpecificLossRate: toDecimalPercentageValue(
          // @ts-expect-error fix later
          restParameters.projectSpecificLossRate,
        ),
      }),
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

  const { status, body } =
    await client.customProjects.createCustomProject.mutation({ body: data });

  if (status === 201) {
    queryClient.setQueryData(queryKeys.customProjects.cached.queryKey, body);
    router.push("/projects/preview");
  }
};

export default function CreateCustomProject() {
  const ref = useRef<HTMLDivElement>(null);
  const setIntersecting = useSetAtom(formStepAtom);
  const router = useRouter();
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
      projectName: "",
      activity: ACTIVITY.CONSERVATION,
      ecosystem: ECOSYSTEM.SEAGRASS,
      countryCode: countryOptions?.[0]?.value,
      projectSizeHa: 20,
      carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
      initialCarbonPriceAssumption: 1000,
      parameters: {
        emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_1,
        lossRateUsed: LOSS_RATE_USED.PROJECT_SPECIFIC,
        // This is an exception, we need to convert the decimal value to a percentage value at this place
        // instead of in the input field. TODO: We should fix this for a cleaner solution.
        projectSpecificLossRate: parseFloat(toPercentageValue(-0.35)),
        projectSpecificEmission: PROJECT_SPECIFIC_EMISSION.ONE_EMISSION_FACTOR,
        projectSpecificEmissionFactor: 0,
        emissionFactorSOC: 0,
        emissionFactorAGB: 0,
        // @ts-expect-error fix later
        plantingSuccessRate: 0.8,
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
  const activity = methods.watch("activity");

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionSlug = entry.target.id as ExtractAtomValue<
              typeof formStepAtom
            >;

            setIntersecting(sectionSlug);
          }
        });
      },
      {
        root: ref.current,
        threshold: 0.4,
      },
    );

    const sections = Array.from(
      ref.current.querySelector("#custom-project-steps-container")?.children ||
        [],
    );
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [setIntersecting, activity]);

  return (
    <FormProvider {...methods}>
      <div className="ml-4 flex flex-1 flex-col">
        <Header />
        <div className="flex flex-1 gap-3 overflow-hidden" ref={ref}>
          <ProjectSidebar />
          <div className="mb-4 flex-1">
            <ScrollArea className="flex h-full gap-3 pr-6">
              <ProjectForm
                onSubmit={methods.handleSubmit((data) =>
                  onSubmit(data, router),
                )}
              />
            </ScrollArea>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
