"use client";

import { useEffect } from "react";
import * as React from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { ACTIVITY } from "@shared/entities/activity.enum";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import {
  CombinedCustomProjectSchema,
  CreateCustomProjectSchema,
} from "@shared/schemas/custom-projects/create-custom-project.schema";
import { useAtom } from "jotai";
import { z } from "zod";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { projectFormState, setupFormRef } from "@/app/projects/store";

import { ACTIVITIES } from "@/containers/overview/filters/constants";
import ConservationProjectDetails from "@/containers/projects/form/setup/conservation-project-details";
import RestorationProjectDetails from "@/containers/projects/form/setup/restoration-project-detail";

import {
  Form,
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

export type CreateCustomProjectForm = z.infer<
  typeof CombinedCustomProjectSchema
>;

export default function SetupProjectForm() {
  const [formStore, setForm] = useAtom(projectFormState);

  const [, setSetupFormRef] = useAtom(setupFormRef);

  const { queryKey } = queryKeys.projects.countries;
  const { data: countryOptions } = client.projects.getProjectCountries.useQuery(
    queryKey,
    {},
    {
      queryKey,
      select: (data) =>
        data.body.data.map(({ name, code }) => ({ label: name, value: code })),
    },
  );

  const form = useForm<CreateCustomProjectForm>({
    resolver: zodResolver(CombinedCustomProjectSchema),
    defaultValues: {
      name: "",
      activity: ACTIVITY.CONSERVATION,
      ecosystem: ECOSYSTEM.SEAGRASS,
      countryCode: countryOptions?.[0]?.value,
      projectSize: 20,
      // carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.CAPEX_AND_OPEX,
      initialCarbonPriceAssumption: 1000,
    },
  });

  useEffect(() => {
    setForm((prev) => ({ ...prev, setup: form }));
  }, [form, setForm]);

  console.log(form.getValues());

  return (
    <Form {...form}>
      <form className="w-full space-y-8" ref={setSetupFormRef}>
        <FormField
          control={form.control}
          name="name"
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
                      form.setValue("name", v.target.value);
                      await form.trigger("name");
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
            name="projectSize"
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
                        form.setValue("projectSize", Number(e.target.value));
                        await form.trigger("projectSize");
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
                  }}
                >
                  {Object.values(ECOSYSTEM).map((ecosystem) => (
                    <RadioGroupItemBox
                      key={ecosystem}
                      className="flex-1"
                      label={ecosystem}
                      value={ecosystem}
                      checked={form.getValues("ecosystem") === ecosystem}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
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
                  }}
                >
                  {ACTIVITIES.map((activity) => (
                    <RadioGroupItemBox
                      key={activity.value}
                      className="flex-1"
                      label={activity.label}
                      value={activity.value}
                      checked={form.getValues("activity") === activity.value}
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
      </form>
    </Form>
  );
}
