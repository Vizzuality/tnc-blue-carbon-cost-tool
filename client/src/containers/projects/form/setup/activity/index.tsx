import { useCallback } from "react";

import { useParams } from "next/navigation";

import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from "@shared/entities/activity.enum";
import {
  ConservationCustomProjectSchema,
  RestorationCustomProjectSchema,
} from "@shared/schemas/custom-projects/create-custom-project.schema";
import { DEFAULT_CONSERVATION_FORM_VALUES } from "@shared/schemas/custom-projects/custom-project-form.constants";
import { z } from "zod";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { CUSTOM_PROJECT } from "@/constants/tooltip";

import { ACTIVITIES } from "@/containers/overview/filters/constants";
import { useFormValues } from "@/containers/projects/form/project-form";
import { useCustomProjectForm } from "@/containers/projects/form/utils";

import { FormItem, FormLabel } from "@/components/ui/form";
import { FormControl } from "@/components/ui/form";
import { FormField, FormMessage } from "@/components/ui/form";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItemBox } from "@/components/ui/radio-group";

type RestorationParameters = z.infer<typeof RestorationCustomProjectSchema>;
type ConservationParameters = z.infer<typeof ConservationCustomProjectSchema>;

export default function Activity() {
  const { id } = useParams();
  const isEdit = !!id;
  const { form } = useCustomProjectForm();
  const { parameters, assumptions } = useFormValues();
  const { ecosystem, countryCode } = form.getValues();

  const queryKey = queryKeys.customProjects.defaultActivityTypes({
    ecosystem,
    countryCode,
  }).queryKey;

  const { data: plantingSuccessRate } =
    client.customProjects.getActivityTypesDefaults.useQuery(
      queryKey,
      { query: { ecosystem, countryCode } },
      {
        queryKey,
        enabled: !!ecosystem && !!countryCode,
        select: (response) =>
          response.body.data.Restoration.plantingSuccessRate,
      },
    );
  const handleRestorationConstraints = useCallback(() => {
    if (
      (parameters as RestorationParameters).plantingSuccessRate === undefined &&
      plantingSuccessRate
    ) {
      form.setValue("parameters.plantingSuccessRate", plantingSuccessRate);
      form.trigger("parameters.plantingSuccessRate");
    }

    if (
      (parameters as RestorationParameters)?.restorationActivity === undefined
    ) {
      // ? we default to a restoration activity ensuring costs are always calculated
      form.setValue(
        "parameters.restorationActivity",
        RESTORATION_ACTIVITY_SUBTYPE.PLANTING,
      );
      form.trigger("parameters.restorationActivity");
    }
  }, [form, parameters, plantingSuccessRate]);
  const handleConservationConstraints = useCallback(() => {
    if (assumptions?.restorationRate !== undefined) {
      form.setValue("assumptions.restorationRate", undefined);
      form.trigger("assumptions.restorationRate");
    }

    if (
      (parameters as ConservationParameters).projectSpecificEmission ===
      undefined
    ) {
      form.setValue(
        "parameters.projectSpecificEmission",
        DEFAULT_CONSERVATION_FORM_VALUES.parameters.projectSpecificEmission,
      );
      form.trigger("parameters.projectSpecificEmission");
    }
  }, [form, parameters, assumptions?.restorationRate]);
  const handleOnValueChange = async (v: string) => {
    form.setValue("activity", v as ACTIVITY);
    await form.trigger("activity");

    if (isEdit && v === ACTIVITY.CONSERVATION) {
      handleConservationConstraints();
    }

    if (v === ACTIVITY.RESTORATION) {
      handleRestorationConstraints();
    }
  };

  return (
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
              onValueChange={handleOnValueChange}
            >
              {ACTIVITIES.map((activity) => (
                <RadioGroupItemBox
                  key={activity.value}
                  className="flex-1"
                  label={activity.label}
                  value={activity.value}
                  defaultChecked={
                    form.formState.defaultValues?.activity === activity.value
                  }
                  checked={form.getValues("activity") === activity.value}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
