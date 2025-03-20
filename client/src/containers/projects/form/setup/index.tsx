"use client";

import * as React from "react";

import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from "@shared/entities/activity.enum";
import { EMISSION_FACTORS_TIER_TYPES } from "@shared/entities/carbon-inputs/emission-factors.entity";
import { SEQUESTRATION_RATE_TIER_TYPES } from "@shared/entities/carbon-inputs/sequestration-rate.entity";
import { CARBON_REVENUES_TO_COVER } from "@shared/entities/custom-project.entity";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { ValidatedCustomProjectForm } from "@shared/schemas/custom-projects/create-custom-project.schema";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { CUSTOM_PROJECT, GENERAL_ASSUMPTIONS } from "@/constants/tooltip";

import { ACTIVITIES } from "@/containers/overview/filters/constants";
import NumberFormItem from "@/containers/projects/form/number-form-item";
import { useFormValues } from "@/containers/projects/form/project-form";
import ConservationProjectDetails from "@/containers/projects/form/setup/conservation-project-details";
import { CARBON_REVENUES_TO_COVER_DESCRIPTIONS } from "@/containers/projects/form/setup/constants";
import RestorationProjectDetails from "@/containers/projects/form/setup/restoration-project-detail";
import { useCustomProjectForm } from "@/containers/projects/form/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItemBox } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CustomProjectForm = Omit<
  ValidatedCustomProjectForm,
  "costInputs" | "assumptions"
> & {
  costInputs?: {
    [K in keyof ValidatedCustomProjectForm["costInputs"]]: number | undefined;
  };
  assumptions?: {
    [K in keyof ValidatedCustomProjectForm["assumptions"]]: number | undefined;
  };
};

export default function SetupProjectForm() {
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

  const { form, handleFormChange } = useCustomProjectForm();

  const {
    activity,
    parameters: {
      // @ts-expect-error fix later
      emissionFactorUsed,
      // @ts-expect-error fix later
      tierSelector,
      // @ts-expect-error fix later
      restorationActivity,
    },
  } = useFormValues();

  const isDisabled = (ecosystem: ECOSYSTEM) => {
    if (activity === ACTIVITY.CONSERVATION) {
      return (
        emissionFactorUsed === EMISSION_FACTORS_TIER_TYPES.TIER_2 &&
        ecosystem !== ECOSYSTEM.MANGROVE
      );
    }

    if (activity === ACTIVITY.RESTORATION) {
      return (
        tierSelector === SEQUESTRATION_RATE_TIER_TYPES.TIER_2 &&
        [ECOSYSTEM.SEAGRASS, ECOSYSTEM.SALT_MARSH].includes(ecosystem)
      );
    }

    return false;
  };

  const ECOSYSTEM_OPTIONS = Object.values(ECOSYSTEM).map((ecosystem) => ({
    label: ecosystem,
    value: ecosystem,
    disabled: isDisabled(ecosystem),
  }));

  return (
    <Accordion type="single" collapsible defaultValue="assumptions">
      <AccordionItem value="assumptions" className="border-b-0">
        <AccordionTrigger className="pt-0">
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-medium">Project setup</h2>
            </div>
            <p className="font-normal text-muted-foreground">
              General setup of the project
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-0">
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Input
                        placeholder="Insert project name"
                        type="text"
                        {...field}
                        onChange={async (v) => {
                          form.setValue("projectName", v.target.value);
                          await form.trigger("projectName");
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-start gap-3">
              <FormField
                control={form.control}
                name="countryCode"
                render={() => (
                  <FormItem className="flex-1">
                    <FormLabel
                      tooltip={{
                        title: "Country",
                        content: CUSTOM_PROJECT.COUNTRY,
                      }}
                    >
                      Country
                    </FormLabel>
                    <FormControl>
                      <Select
                        name="countryCode"
                        value={form.getValues("countryCode")}
                        onValueChange={async (v) => {
                          form.setValue("countryCode", v);
                          await form.trigger("countryCode");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countryOptions?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="projectSizeHa"
                render={() => (
                  <NumberFormItem
                    label="Project Size"
                    tooltip={{
                      title: "Project Size",
                      content: CUSTOM_PROJECT.PROJECT_SIZE,
                    }}
                    min={0}
                    formItemClassName="flex-1"
                    formControlClassName="after:content-['ha']"
                    initialValue={form.getValues("projectSizeHa")}
                    onValueChange={async (v) =>
                      handleFormChange("projectSizeHa", v)
                    }
                  />
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="ecosystem"
              render={() => (
                <FormItem className="flex-1">
                  <FormLabel
                    tooltip={{
                      title: "Ecosystem",
                      content: CUSTOM_PROJECT.ECOSYSTEM,
                    }}
                  >
                    Ecosystem
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="flex gap-4"
                      value={form.getValues("ecosystem") as ECOSYSTEM}
                      onValueChange={async (v) => {
                        form.setValue("ecosystem", v as ECOSYSTEM);
                        await form.trigger("ecosystem");

                        if (activity === ACTIVITY.CONSERVATION) {
                          form.resetField("parameters.emissionFactorUsed");
                        }

                        if (activity === ACTIVITY.RESTORATION) {
                          if (
                            [
                              RESTORATION_ACTIVITY_SUBTYPE.HYDROLOGY,
                              RESTORATION_ACTIVITY_SUBTYPE.HYBRID,
                            ].includes(restorationActivity)
                          ) {
                            form.setValue(
                              "parameters.restorationActivity",
                              RESTORATION_ACTIVITY_SUBTYPE.PLANTING,
                            );
                          }
                        }
                      }}
                    >
                      {ECOSYSTEM_OPTIONS.map((ecosystem) => (
                        <RadioGroupItemBox
                          key={ecosystem.value}
                          className="flex-1"
                          label={ecosystem.label}
                          value={ecosystem.value}
                          checked={
                            form.getValues("ecosystem") === ecosystem.value
                          }
                          disabled={ecosystem.disabled}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                  {emissionFactorUsed ===
                    EMISSION_FACTORS_TIER_TYPES.TIER_2 && (
                    <p className="text-sm text-muted-foreground">
                      Only Mangrove ecosystem can be used with Tier 2.
                    </p>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="activity"
              render={() => (
                <FormItem className="flex-1">
                  <FormLabel
                    tooltip={{
                      title: "Activity",
                      content: CUSTOM_PROJECT.ACTIVITY_TYPE,
                    }}
                  >
                    Activity type
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="flex gap-4"
                      onValueChange={async (v) => {
                        form.setValue("activity", v as ACTIVITY);
                        await form.trigger("activity");

                        // ? we default to a restoration activity ensuring costs are always calculated
                        if (
                          v === ACTIVITY.RESTORATION &&
                          !restorationActivity
                        ) {
                          form.setValue(
                            "parameters.restorationActivity",
                            RESTORATION_ACTIVITY_SUBTYPE.PLANTING,
                          );
                        }
                      }}
                    >
                      {ACTIVITIES.map((activity) => (
                        <RadioGroupItemBox
                          key={activity.value}
                          className="flex-1"
                          label={activity.label}
                          value={activity.value}
                          defaultChecked={
                            form.formState.defaultValues?.activity ===
                            activity.value
                          }
                          checked={
                            form.getValues("activity") === activity.value
                          }
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.getValues("activity") === ACTIVITY.CONSERVATION && (
              <ConservationProjectDetails />
            )}

            {form.getValues("activity") === ACTIVITY.RESTORATION && (
              <RestorationProjectDetails />
            )}

            <FormField
              control={form.control}
              name="carbonRevenuesToCover"
              render={() => (
                <FormItem className="flex-1">
                  <FormLabel
                    tooltip={{
                      title: "Carbon Revenues to cover",
                      content: GENERAL_ASSUMPTIONS.CARBON_REVENUES_TO_COVER,
                    }}
                  >
                    Carbon Revenues to cover
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="flex gap-4"
                      onValueChange={async (v) => {
                        form.setValue(
                          "carbonRevenuesToCover",
                          v as CARBON_REVENUES_TO_COVER,
                        );
                        await form.trigger("carbonRevenuesToCover");
                      }}
                    >
                      {Object.values(CARBON_REVENUES_TO_COVER).map(
                        (revenue) => (
                          <RadioGroupItemBox
                            key={revenue}
                            className="flex-1"
                            label={revenue}
                            value={revenue}
                            description={
                              CARBON_REVENUES_TO_COVER_DESCRIPTIONS[revenue]
                            }
                            checked={
                              form.getValues("carbonRevenuesToCover") ===
                              revenue
                            }
                            defaultChecked={
                              form.formState.defaultValues
                                ?.carbonRevenuesToCover === revenue
                            }
                          />
                        ),
                      )}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="initialCarbonPriceAssumption"
              render={() => (
                <>
                  <NumberFormItem
                    label="Initial carbon price assumption"
                    tooltip={{
                      title: "Initial carbon price assumptions in $",
                      content:
                        GENERAL_ASSUMPTIONS.INITIAL_CARBON_PRICE_ASSUMPTIONS,
                    }}
                    value={form.getValues("initialCarbonPriceAssumption")}
                    formItemClassName="flex items-center justify-between gap-4"
                    formControlClassName="after:content-['$']"
                    onValueChange={async (v) =>
                      handleFormChange("initialCarbonPriceAssumption", v)
                    }
                  />
                  <FormMessage className="text-right" />
                </>
              )}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
