import * as React from "react";

import { ACTIVITY } from "@shared/entities/activity.enum";
import { LOSS_RATE_USED } from "@shared/schemas/custom-projects/create-custom-project.schema";

import { toPercentageValue } from "@/lib/format";
import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import NumberFormItem from "@/containers/projects/form/number-form-item";
import { useCustomProjectForm } from "@/containers/projects/form/utils";

import { FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function LossRate() {
  const { form, handleFormChange } = useCustomProjectForm();

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

  return (
    <FormField
      name="parameters.projectSpecificLossRate"
      render={() => (
        <NumberFormItem
          label="Project Specific Loss Rate"
          tooltip={{
            title: "Project Specific Loss Rate",
            content: "TBD",
          }}
          initialValue={form.getValues("parameters.projectSpecificLossRate")}
          formItemClassName="flex items-center justify-between gap-4"
          formControlClassName="after:content-['%']"
          max={0}
          onValueChange={async (v) =>
            handleFormChange("parameters.projectSpecificLossRate", v)
          }
          isPercentage
        />
      )}
    />
  );
}
