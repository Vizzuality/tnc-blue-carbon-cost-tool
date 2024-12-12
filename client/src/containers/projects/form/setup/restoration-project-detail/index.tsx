import * as React from "react";

import { useFormContext } from "react-hook-form";

import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from "@shared/entities/activity.enum";
import { SEQUESTRATION_RATE_TIER_TYPES } from "@shared/entities/carbon-inputs/sequestration-rate.entity";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { CreateCustomProjectForm } from "@/containers/projects/form/setup";

import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RestorationProjectDetails() {
  const form = useFormContext<CreateCustomProjectForm>();

  const {
    ecosystem,
    countryCode,
    activity,
    // @ts-expect-error fix later
    parameters: { tierSelector },
  } = form.getValues();

  const queryKey = queryKeys.customProjects.defaultActivityTypes({
    ecosystem,
    countryCode,
  }).queryKey;

  const { data } = client.customProjects.getActivityTypesDefaults.useQuery(
    queryKey,
    { query: { ecosystem, countryCode } },
    {
      queryKey,
      enabled: !!ecosystem && !!countryCode,
      select: (response) => {
        const { data } = response.body;
        return data[activity as ACTIVITY.RESTORATION].sequestrationRate;
      },
    },
  );

  const RESTORATION_ACTIVITY_OPTIONS = Object.values(
    RESTORATION_ACTIVITY_SUBTYPE,
  ).map((activity) => ({
    value: activity,
    label: activity,
    disabled:
      ecosystem === ECOSYSTEM.SEAGRASS &&
      [
        RESTORATION_ACTIVITY_SUBTYPE.HYBRID,
        RESTORATION_ACTIVITY_SUBTYPE.HYDROLOGY,
      ].includes(activity),
  }));

  return (
    <Card variant="secondary">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="basis-1/2 space-y-2">
            <FormField
              control={form.control}
              name="parameters.restorationActivity"
              render={() => (
                <FormItem className="basis-1/2">
                  <FormLabel
                    tooltip={{
                      title: "Project-specific emissions type",
                      content: "TBD",
                    }}
                  >
                    Restoration Activity type
                  </FormLabel>
                  <FormControl>
                    <Select
                      name="parameters.restorationActivity"
                      value={form.getValues("parameters.restorationActivity")}
                      onValueChange={async (v) => {
                        form.setValue(
                          "parameters.restorationActivity",
                          v as RESTORATION_ACTIVITY_SUBTYPE,
                        );
                        await form.trigger("parameters.restorationActivity");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select restoration activity type" />
                      </SelectTrigger>
                      <SelectContent>
                        {RESTORATION_ACTIVITY_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                          >
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
          </div>
          <div className="basis-1/2 space-y-2">
            <FormField
              control={form.control}
              name="parameters.restorationActivity"
              render={() => (
                <FormItem className="basis-1/2">
                  <FormLabel
                    tooltip={{
                      title: "Project-specific emissions type",
                      content: "TBD",
                    }}
                  >
                    Sequestration Factor Used
                  </FormLabel>
                  <FormControl>
                    <Select
                      name="parameters.tierSelector"
                      value={form.getValues("parameters.tierSelector")}
                      onValueChange={async (v) => {
                        form.setValue(
                          "parameters.tierSelector",
                          v as SEQUESTRATION_RATE_TIER_TYPES,
                        );
                        await form.trigger("parameters.tierSelector");

                        if (v === SEQUESTRATION_RATE_TIER_TYPES.TIER_2) {
                          form.setValue("ecosystem", ECOSYSTEM.MANGROVE);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sequestration tier" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(SEQUESTRATION_RATE_TIER_TYPES)?.map(
                          (option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <FormField
            control={form?.control}
            name="parameters.plantingSuccessRate"
            render={({ field }) => (
              <FormItem className="basis-1/2 space-y-2">
                <FormLabel
                  tooltip={{
                    title: "Project Specific Emission Factor",
                    content: "TBD",
                  }}
                >
                  Project Specific Emission Factor
                </FormLabel>
                <FormControl className="relative after:absolute after:right-6 after:inline-block after:text-sm after:text-muted-foreground after:content-['%']">
                  <div className="relative flex flex-1 items-center">
                    <Input
                      {...field}
                      className="w-full pr-12"
                      type="number"
                      min={0}
                      onChange={(v) => {
                        form.setValue(
                          "parameters.plantingSuccessRate",
                          Number(v.target.value),
                        );
                        // await form.trigger("parameters.plantingSuccessRate");
                      }}
                      readOnly
                      disabled
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <>
            {tierSelector === SEQUESTRATION_RATE_TIER_TYPES.TIER_1 && (
              <div className="basis-1/2 space-y-2">
                <FormLabel
                  tooltip={{
                    title: "IPCC default value",
                    content: "TBD",
                  }}
                >
                  IPCC default value
                </FormLabel>
                <div className="relative flex flex-1 items-center after:absolute after:right-6 after:inline-block after:text-sm after:text-muted-foreground after:content-['??']">
                  <Input
                    className="w-full pr-32 text-muted-foreground"
                    disabled
                    readOnly
                    value={data?.tier1}
                  />
                </div>
              </div>
            )}
            {tierSelector === SEQUESTRATION_RATE_TIER_TYPES.TIER_2 && (
              <div className="basis-1/2 space-y-2">
                <FormLabel
                  tooltip={{
                    title: "Country-specific rate",
                    content: "TBD",
                  }}
                >
                  Country-specific rate
                </FormLabel>
                <div className="relative flex flex-1 items-center after:absolute after:right-6 after:inline-block after:text-sm after:text-muted-foreground after:content-['??']">
                  <Input
                    className="w-full pr-32 text-muted-foreground"
                    disabled
                    readOnly
                    value={data?.tier2}
                  />
                </div>
              </div>
            )}
            {tierSelector === SEQUESTRATION_RATE_TIER_TYPES.TIER_3 && (
              <FormField
                control={form?.control}
                name="parameters.projectSpecificSequestrationRate"
                render={({ field }) => (
                  <FormItem className="basis-1/2 space-y-2">
                    <FormLabel
                      tooltip={{
                        title: "Project-specific sequestration rate",
                        content: "TBD",
                      }}
                    >
                      Project-specific sequestration rate
                    </FormLabel>
                    <FormControl className="relative after:absolute after:right-6 after:inline-block after:text-sm after:text-muted-foreground after:content-['%']">
                      <div className="relative flex flex-1 items-center">
                        <Input
                          {...field}
                          className="w-full pr-12"
                          type="number"
                          onChange={(v) => {
                            field.onChange(Number(v.target.value));
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </>
        </div>
      </div>
    </Card>
  );
}
