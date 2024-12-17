import * as React from "react";

import { useFormContext } from "react-hook-form";

import { ACTIVITY } from "@shared/entities/activity.enum";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { CreateCustomProjectForm } from "@/containers/projects/form/setup";

import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// ? these inputs are read-only as it is informative to the user. They are not meant to be sent to the API.
export default function T2NationalEmissionFactors() {
  const form = useFormContext<CreateCustomProjectForm>();

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
          return data[activity as ACTIVITY.CONSERVATION].emissionFactor.tier2;
        },
      },
    );

  if (!isSuccess) return null;

  return (
    <div className="flex gap-3">
      <div className="basis-1/2 space-y-2">
        <FormLabel
          tooltip={{
            title: "National AGB Emission Factor",
            content: "TBD",
          }}
        >
          National AGB Emission Factor
        </FormLabel>
        <div className="relative flex flex-1 items-center after:absolute after:right-6 after:inline-block after:text-sm after:text-muted-foreground after:content-['tCO2e/ha/year']">
          <Input
            className="w-full pr-32 text-muted-foreground"
            disabled
            readOnly
            value={data?.emissionFactorAgb}
          />
        </div>
      </div>
      <div className="basis-1/2 space-y-2">
        <FormLabel
          tooltip={{
            title: "National SOC Emission Factor",
            content: "TBD",
          }}
        >
          National SOC Emission Factor
        </FormLabel>
        <div className="relative flex flex-1 items-center after:absolute after:right-6 after:inline-block after:text-sm after:text-muted-foreground after:content-['tCO2e/ha/year']">
          <Input
            className="w-full pr-32 text-muted-foreground"
            disabled
            readOnly
            value={data?.emissionFactorSoc}
          />
        </div>
      </div>
    </div>
  );
}
