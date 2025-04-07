import { useCallback, useEffect } from "react";

import { useFormContext } from "react-hook-form";

import { ACTIVITY } from "@shared/entities/activity.enum";
import {
  ConservationCustomProjectSchema,
  CustomProjectForm,
  RestorationCustomProjectSchema,
} from "@shared/schemas/custom-projects/create-custom-project.schema";
import {
  DEFAULT_CONSERVATION_FORM_VALUES,
  DEFAULT_RESTORATION_FORM_VALUES,
} from "@shared/schemas/custom-projects/custom-project-form.constants";
import { z } from "zod";

type RestorationParameters = z.infer<typeof RestorationCustomProjectSchema>;
type ConservationParameters = z.infer<typeof ConservationCustomProjectSchema>;

function useActivityConstraints(enabled: boolean) {
  const form = useFormContext<CustomProjectForm>();
  const activity = form.watch("activity");
  const { assumptions, parameters } = form.getValues();

  const handleRestorationConstraints = useCallback(() => {
    const restorationParams = parameters as RestorationParameters;
    if (restorationParams.plantingSuccessRate === undefined) {
      form.setValue(
        "parameters.plantingSuccessRate",
        DEFAULT_RESTORATION_FORM_VALUES.parameters.plantingSuccessRate,
      );
      form.trigger("parameters.plantingSuccessRate");
    }
  }, [form, parameters]);
  const handleConservationConstraints = useCallback(() => {
    if (assumptions?.restorationRate !== undefined) {
      form.setValue("assumptions.restorationRate", undefined);
      form.trigger("assumptions.restorationRate");
    }

    const conservationParams = parameters as ConservationParameters;
    if (conservationParams.projectSpecificEmission === undefined) {
      form.setValue(
        "parameters.projectSpecificEmission",
        DEFAULT_CONSERVATION_FORM_VALUES.parameters.projectSpecificEmission,
      );
      form.trigger("parameters.projectSpecificEmission");
    }
  }, [form, parameters, assumptions?.restorationRate]);

  useEffect(() => {
    if (!enabled) return;

    const activityHandlers = {
      [ACTIVITY.RESTORATION]: handleRestorationConstraints,
      [ACTIVITY.CONSERVATION]: handleConservationConstraints,
    };

    const handler = activityHandlers[activity];
    if (handler) {
      handler();
    }
  }, [
    activity,
    enabled,
    handleRestorationConstraints,
    handleConservationConstraints,
  ]);
}

export { useActivityConstraints };
