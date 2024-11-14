import * as React from "react";

import { useFormContext } from "react-hook-form";

import { ACTIVITY } from "@shared/entities/activity.enum";
import { LOSS_RATE_USED } from "@shared/schemas/custom-projects/create-custom-project.schema";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { CreateCustomProjectForm } from "@/containers/projects/form/setup";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function LossRate() {
  const form = useFormContext<CreateCustomProjectForm>();

  const {
    ecosystem,
    countryCode,
    activity,
    parameters: { lossRateUsed },
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
      enabled:
        !!ecosystem &&
        !!countryCode &&
        lossRateUsed === LOSS_RATE_USED.NATIONAL_AVERAGE,
      select: (response) => {
        const { data } = response.body;
        return data[activity as ACTIVITY.CONSERVATION].ecosystemLossRate;
      },
    },
  );

  if (lossRateUsed === LOSS_RATE_USED.NATIONAL_AVERAGE) {
    return (
      <div className="flex justify-between gap-3">
        <FormLabel
          className="grow basis-1/2 flex-nowrap"
          tooltip={{
            title: "National loss rate",
            content: "TBD",
          }}
        >
          National loss rate
        </FormLabel>
        <div className="relative flex basis-1/2 items-center after:absolute after:right-6 after:inline-block after:text-sm after:text-muted-foreground after:content-['%']">
          <Input
            className="w-full pr-32 text-muted-foreground"
            disabled
            readOnly
            value={data}
          />
        </div>
      </div>
    );
  }

  return (
    <FormField
      control={form?.control}
      name="parameters.projectSpecificLossRate"
      render={() => (
        <FormItem className="flex items-center justify-between gap-4 space-y-0">
          <div className="flex-1">
            <FormLabel
              tooltip={{
                title: "Project-specific loss rate",
                content: "TBD",
              }}
            >
              Project-specific loss rate
            </FormLabel>
          </div>
          <FormControl className="relative after:absolute after:right-6 after:inline-block after:text-sm after:text-muted-foreground after:content-['%']">
            <div className="relative flex flex-1 items-center">
              <Input
                {...form.register("parameters.projectSpecificLossRate")}
                className="w-full pr-12"
                type="number"
                max={0}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
