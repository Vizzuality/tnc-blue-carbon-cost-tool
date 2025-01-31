import * as React from "react";

import { useFormContext } from "react-hook-form";

import { ACTIVITY } from "@shared/entities/activity.enum";
import { LOSS_RATE_USED } from "@shared/schemas/custom-projects/create-custom-project.schema";

import { toPercentageValue } from "@/lib/format";
import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { CustomProjectForm } from "@/containers/projects/form/setup";
import ProjectSpecificLossRate from "@/containers/projects/form/setup/conservation-project-details/project-specific-loss-rate";

import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function LossRate() {
  const form = useFormContext<CustomProjectForm>();

  const {
    ecosystem,
    countryCode,
    activity,
    parameters: {
      // @ts-expect-error fix later
      lossRateUsed,
    },
  } = form.getValues();

  const queryKey = queryKeys.customProjects.defaultActivityTypes({
    ecosystem,
    countryCode,
  }).queryKey;

  const { data, isSuccess } =
    client.customProjects.getActivityTypesDefaults.useQuery(
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

  if (!isSuccess) return null;

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
            value={toPercentageValue(data)}
          />
        </div>
      </div>
    );
  }

  return <ProjectSpecificLossRate />;
}
