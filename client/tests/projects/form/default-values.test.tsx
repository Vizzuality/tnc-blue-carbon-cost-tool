import { renderHook } from "@testing-library/react";

import { useDefaultFormValues } from "@/containers/projects/form/utils";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { ACTIVITY } from "@shared/entities/activity.enum";
import {
  CARBON_REVENUES_TO_COVER,
  PROJECT_SPECIFIC_EMISSION,
} from "@shared/entities/custom-project.entity";
import { LOSS_RATE_USED } from "@shared/schemas/custom-projects/create-custom-project.schema";
import { EMISSION_FACTORS_TIER_TYPES } from "@shared/entities/carbon-inputs/emission-factors.entity";
import { COUNTRY_LIST, DEFAULT_ASSUMPTIONS, FAKE_PROJECT } from "./constants";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { queryKeys } from "@/lib/query-keys";

const queryClient = new QueryClient();

const { queryKey: countriesQueryKey } = queryKeys.customProjects.countries;
const { queryKey: assumptionsQueryKey } = queryKeys.customProjects.assumptions({
  ecosystem: ECOSYSTEM.SEAGRASS,
  activity: ACTIVITY.CONSERVATION,
});
queryClient.setQueryData(countriesQueryKey, {
  status: 200,
  body: { data: COUNTRY_LIST },
});
queryClient.setQueryData(assumptionsQueryKey, {
  status: 200,
  body: {
    data: DEFAULT_ASSUMPTIONS,
  },
});

const wrapper = (queryClient: QueryClient) => {
  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      accessToken: "accessToken",
    },
  }),
}));

describe("projects/form/default-values", () => {
  it("returns correctly inputs for default CONSERVATION form", () => {
    const { result: defaultValues } = renderHook(() => useDefaultFormValues(), {
      wrapper: wrapper(queryClient),
    });

    expect(defaultValues.current.projectName).equal("");
    expect(defaultValues.current.activity).equal(ACTIVITY.CONSERVATION);
    expect(defaultValues.current.ecosystem).equal(ECOSYSTEM.SEAGRASS);
    expect(defaultValues.current.projectSizeHa).equal(10000);
    expect(defaultValues.current.initialCarbonPriceAssumption).equal(30);
    expect(defaultValues.current.countryCode).equal("IND");
    expect(defaultValues.current.carbonRevenuesToCover).equal(
      CARBON_REVENUES_TO_COVER.OPEX,
    );
    expect(defaultValues.current.assumptions).toMatchObject({
      baselineReassessmentFrequency: undefined,
      buffer: undefined,
      carbonPriceIncrease: undefined,
      discountRate: undefined,
      projectLength: undefined,
      restorationRate: undefined,
      verificationFrequency: undefined,
    });
    expect(defaultValues.current.parameters).toMatchObject({
      projectSpecificLossRate: -0.003,
      projectSpecificEmissionFactor: 15,
      emissionFactorAGB: 200,
      emissionFactorSOC: 15,
      lossRateUsed: LOSS_RATE_USED.PROJECT_SPECIFIC,
      emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_1,
      projectSpecificEmission: PROJECT_SPECIFIC_EMISSION.ONE_EMISSION_FACTOR,
    });
  });

  it("returns correctly inputs from an existing project", () => {
    const projectId = "fake-project-id";
    const { queryKey } = queryKeys.customProjects.one(projectId);

    queryClient.setQueryData(queryKey, {
      status: 200,
      body: { data: FAKE_PROJECT },
    });

    const { result: defaultValues } = renderHook(
      () => useDefaultFormValues(projectId),
      { wrapper: wrapper(queryClient) },
    );

    expect(defaultValues.current.projectName).equal(FAKE_PROJECT.projectName);
    expect(defaultValues.current.activity).equal(FAKE_PROJECT.activity);
    expect(defaultValues.current.ecosystem).equal(FAKE_PROJECT.ecosystem);
    expect(defaultValues.current.projectSizeHa).equal(FAKE_PROJECT.projectSize);
    expect(defaultValues.current.initialCarbonPriceAssumption).equal(
      FAKE_PROJECT.input.initialCarbonPriceAssumption,
    );
    expect(defaultValues.current.countryCode).equal(
      FAKE_PROJECT.input.countryCode,
    );
    expect(defaultValues.current.carbonRevenuesToCover).equal(
      FAKE_PROJECT.input.carbonRevenuesToCover,
    );
    expect(defaultValues.current.assumptions).toMatchObject(
      FAKE_PROJECT.input.assumptions,
    );
    expect(defaultValues.current.parameters).toMatchObject(
      FAKE_PROJECT.input.parameters,
    );
  });
});
