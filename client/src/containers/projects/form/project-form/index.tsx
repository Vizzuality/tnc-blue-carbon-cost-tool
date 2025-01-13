import { useFormContext, useWatch } from "react-hook-form";

import { ACTIVITY } from "@shared/entities/activity.enum";

import AssumptionsProjectForm from "@/containers/projects/form/assumptions";
import CostInputsOverridesProjectForm from "@/containers/projects/form/cost-inputs-overrides";
import RestorationPlanProjectForm from "@/containers/projects/form/restoration-plan";
import SetupProjectForm, {
  CreateCustomProjectForm,
} from "@/containers/projects/form/setup";
import {
  PROJECT_SETUP_STEPS,
  RESTORATION_STEPS,
} from "@/containers/projects/form/sidebar";

import { Card } from "@/components/ui/card";

export const useFormValues = () => {
  const { getValues } = useFormContext<CreateCustomProjectForm>();

  return {
    ...getValues(),
    ...useWatch(),
  };
};

export default function ProjectForm({ onSubmit }: { onSubmit: () => void }) {
  const form = useFormContext<CreateCustomProjectForm>();
  const { activity } = form.getValues();

  return (
    <form className="w-full space-y-8" onSubmit={onSubmit}>
      <div className="flex flex-col gap-3" id="custom-project-steps-container">
        <Card
          className="flex flex-1 flex-col"
          variant="secondary"
          id={PROJECT_SETUP_STEPS[0].slug}
        >
          <SetupProjectForm />
        </Card>
        <Card
          className="flex flex-1 flex-col"
          variant="secondary"
          id={PROJECT_SETUP_STEPS[1].slug}
        >
          <AssumptionsProjectForm />
        </Card>
        <Card
          className="flex flex-1 flex-col"
          variant="secondary"
          id={PROJECT_SETUP_STEPS[2].slug}
        >
          <CostInputsOverridesProjectForm />
        </Card>
        {activity === ACTIVITY.RESTORATION && (
          <Card
            className="flex flex-1 flex-col"
            variant="secondary"
            id={RESTORATION_STEPS[0].slug}
          >
            <RestorationPlanProjectForm />
          </Card>
        )}
      </div>
    </form>
  );
}
