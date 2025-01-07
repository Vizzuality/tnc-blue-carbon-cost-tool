"use client";

import * as React from "react";

import { useFormContext } from "react-hook-form";

import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from "@shared/entities/activity.enum";
import { EMISSION_FACTORS_TIER_TYPES } from "@shared/entities/carbon-inputs/emission-factors.entity";
import { SEQUESTRATION_RATE_TIER_TYPES } from "@shared/entities/carbon-inputs/sequestration-rate.entity";
import { CARBON_REVENUES_TO_COVER } from "@shared/entities/custom-project.entity";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { CreateCustomProjectSchema } from "@shared/schemas/custom-projects/create-custom-project.schema";
import { z } from "zod";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { ACTIVITIES } from "@/containers/overview/filters/constants";
import ConservationProjectDetails from "@/containers/projects/form/setup/conservation-project-details";
import { CARBON_REVENUES_TO_COVER_DESCRIPTIONS } from "@/containers/projects/form/setup/constants";
import RestorationProjectDetails from "@/containers/projects/form/setup/restoration-project-detail";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FormControl,
  FormDescription,
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

export type CreateCustomProjectForm = z.infer<typeof CreateCustomProjectSchema>;

export default function SetupProjectForm() {
  const { queryKey } = queryKeys.countries.all;
  const { data: countryOptions } = client.projects.getProjectCountries.useQuery(
    queryKey,
    {},
    {
      queryKey,
      select: (data) =>
        data.body.data.map(({ name, code }) => ({ label: name, value: code })),
    },
  );

  const form = useFormContext<CreateCustomProjectForm>();

  const {
    activity,
    // @ts-expect-error fix later
    parameters: { emissionFactorUsed, tierSelector, restorationActivity },
  } = form.getValues();

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
              render={({ field, fieldState }) => (
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
                  {fieldState.invalid && (
                    <FormDescription>
                      Name must contain at least 3 characters.
                    </FormDescription>
                  )}
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
                        content: "Select a country",
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
                control={form.control}
                name="projectSizeHa"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      tooltip={{
                        title: "Project Size",
                        content: "Insert number of hectares",
                      }}
                    >
                      Project Size
                    </FormLabel>
                    <FormControl className="relative after:absolute after:right-6 after:inline-block after:text-sm after:text-muted-foreground after:content-['ha']">
                      <div className="relative flex items-center">
                        <Input
                          placeholder="Insert number of hectares"
                          className="pr-12"
                          type="number"
                          min={0}
                          {...field}
                          onChange={async (e) => {
                            form.setValue(
                              "projectSizeHa",
                              Number(e.target.value),
                            );
                            await form.trigger("projectSizeHa");
                          }}
                        />
                      </div>
                    </FormControl>
                    {fieldState.invalid && (
                      <FormDescription>
                        Size must be a positive number.
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
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
                      content: "Select the ecosystem",
                    }}
                  >
                    Ecosystem
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="flex gap-4"
                      defaultValue={form.getValues("ecosystem") as ECOSYSTEM}
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
                      content: "Select an activity",
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

                        // form.setValue(
                        //   "parameters.restorationActivity",
                        //   RESTORATION_ACTIVITY_SUBTYPE.HYBRID,
                        // );
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
                      content: "[TBD]",
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
              control={form.control}
              name="initialCarbonPriceAssumption"
              render={({ field }) => (
                <FormItem className="flex justify-between gap-4">
                  <FormLabel
                    tooltip={{
                      title: "Initial carbon price assumption",
                      content: "TBD",
                    }}
                  >
                    Initial carbon price assumption in $
                  </FormLabel>
                  <FormControl className="relative after:absolute after:right-9 after:inline-block after:text-sm after:text-muted-foreground after:content-['$']">
                    <div className="relative flex items-center">
                      <Input
                        type="number"
                        placeholder="Insert project name"
                        className="min-w-[225px]"
                        min={0}
                        {...field}
                        onChange={async (v) => {
                          form.setValue(
                            "initialCarbonPriceAssumption",
                            Number(v.target.value),
                          );
                          await form.trigger("initialCarbonPriceAssumption");
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
