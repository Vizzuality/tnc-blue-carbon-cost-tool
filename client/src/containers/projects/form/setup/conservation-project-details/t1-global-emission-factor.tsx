import * as React from "react";

import { useFormContext } from "react-hook-form";

import { ACTIVITY } from "@shared/entities/activity.enum";
import { CustomProjectForm } from "@shared/schemas/custom-projects/create-custom-project.schema";

import { formatNumber } from "@/lib/format";
import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import ReadonlyInput from "@/containers/projects/form/readonly-input";

import { FormLabel } from "@/components/ui/form";

// ? this input is read-only as it is informative to the user. It is not meant to be sent to the API.
export default function T1GlobalEmissionFactor() {
  const form = useFormContext<CustomProjectForm>();

  const { ecosystem, countryCode, activity } = form.getValues();

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
        enabled: !!ecosystem && !!countryCode,
        select: (response) => {
          const { data } = response.body;
          return data[activity as ACTIVITY.CONSERVATION].emissionFactor.tier1;
        },
      },
    );

  if (!isSuccess) return null;

  return (
    <div className="flex">
      <div className="basis-1/2 space-y-2">
        <FormLabel
          tooltip={{
            title: "T1 Global Emission Factor",
            content:
              "Tier 1 Global Emission Factor: utilizes global default emission factors, offering a general yearly estimate per hectaure, suitable when local data is unavailable.",
          }}
        >
          T1 Global Emission Factor
        </FormLabel>
        <div className="relative flex flex-1 items-center after:absolute after:right-6 after:inline-block after:text-sm after:text-muted-foreground after:content-['tCO2e/ha/year']">
          <ReadonlyInput value={formatNumber(data)} />
        </div>
      </div>
    </div>
  );
}
