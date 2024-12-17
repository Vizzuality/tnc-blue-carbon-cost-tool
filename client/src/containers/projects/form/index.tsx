import { useFormContext } from "react-hook-form";

import { ACTIVITY } from "@shared/entities/activity.enum";

import AssumptionsProjectForm from "@/containers/projects/form/assumptions";
import CostInputsOverridesProjectForm from "@/containers/projects/form/cost-inputs-overrides";
import RestorationPlanProjectForm from "@/containers/projects/form/restoration-plan";
import SetupProjectForm, {
  CreateCustomProjectForm,
} from "@/containers/projects/form/setup";

import { Card } from "@/components/ui/card";

export default function ProjectForm({ onSubmit }: { onSubmit: () => void }) {
  const form = useFormContext<CreateCustomProjectForm>();
  const { activity } = form.getValues();

  return (
    <form className="w-full space-y-8" onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        <Card className="flex flex-1 flex-col" variant="secondary">
          <SetupProjectForm />
        </Card>
        <Card className="flex flex-1 flex-col" variant="secondary">
          <AssumptionsProjectForm />
        </Card>
        <Card className="flex flex-1 flex-col" variant="secondary">
          <CostInputsOverridesProjectForm />
        </Card>
        {activity === ACTIVITY.RESTORATION && (
          <Card className="flex flex-1 flex-col" variant="secondary">
            <RestorationPlanProjectForm />
          </Card>
        )}
      </div>
    </form>
  );
}
