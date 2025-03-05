// Default values to satisfy TypeScript requirements for form validation

import { ACTIVITY } from "@shared/entities/activity.enum";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { ASSUMPTIONS_NAME_TO_DTO_MAP } from "@shared/schemas/assumptions/assumptions.enums";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { getQueryClient } from "@/app/providers";

import {
  CustomProjectForm,
  ValidatedCustomProjectForm,
} from "@/containers/projects/form/setup";

// These will be overridden by actual values from the API or user input
const DEFAULT_COST_INPUTS = {
  validation: 0,
  feasibilityAnalysis: 0,
  conservationPlanningAndAdmin: 0,
  dataCollectionAndFieldCost: 0,
  communityRepresentation: 0,
  blueCarbonProjectPlanning: 0,
  establishingCarbonRights: 0,
  implementationLabor: 0,
  equipmentAndMaterials: 0,
  maintenance: 0,
  monitoring: 0,
  verification: 0,
  certification: 0,
  projectManagement: 0,
  communityBenefitSharingFund: 0,
  registryFees: 0,
  brokerage: 0,
  insuranceCost: 0,
  financingCost: 0,
  carbonStandardFees: 0,
  baselineReassessment: 0,
  mrv: 0,
  longTermProjectOperatingCost: 0,
} as const;

const DEFAULT_ASSUMPTIONS = {
  baselineReassessmentFrequency: 0,
  buffer: 0,
  carbonPriceIncrease: 0,
  discountRate: 0,
  verificationFrequency: 0,
  projectLength: 0,
} as const;

const getDefaultAssumptions = (ecosystem: ECOSYSTEM, activity: ACTIVITY) => {
  const queryClient = getQueryClient();

  return client.customProjects.getDefaultAssumptions
    .getQueryData(
      queryClient,
      queryKeys.customProjects.assumptions({
        ecosystem: ecosystem,
        activity: activity,
      }).queryKey,
    )
    ?.body.data.reduce((acc, { name, value }) => {
      return {
        ...acc,
        [ASSUMPTIONS_NAME_TO_DTO_MAP[
          name as keyof typeof ASSUMPTIONS_NAME_TO_DTO_MAP
        ]]: Number(value as NonNullable<typeof value>),
      };
    }, {});
};

const getDefaultCostInputs = (data: CustomProjectForm) => {
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
  )?.body.data;
};

const parseFormValues = (
  data: CustomProjectForm,
): ValidatedCustomProjectForm => {
  const originalValues = { ...data };
  const defaultAssumptions = getDefaultAssumptions(
    data.ecosystem,
    data.activity,
  );
  const costs = getDefaultCostInputs(data);
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
      ...DEFAULT_ASSUMPTIONS,
      ...Object.keys(originalValues.assumptions ?? {}).reduce(
        (acc, assumptionKey) => {
          return {
            ...acc,
            [assumptionKey]:
              originalValues.assumptions?.[
                assumptionKey as keyof typeof originalValues.assumptions
              ] ??
              defaultAssumptions?.[
                assumptionKey as keyof typeof defaultAssumptions
              ],
          };
        },
        {},
      ),
    },
    costInputs: {
      ...DEFAULT_COST_INPUTS,
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

export default parseFormValues;
