import AssumptionsProjectForm from "@/containers/projects/form/assumptions";
import CostInputsOverridesProjectForm from "@/containers/projects/form/cost-inputs-overrides";
import SetupProjectForm from "@/containers/projects/form/setup";

import { Card } from "@/components/ui/card";

export default function ProjectForm({ onSubmit }: { onSubmit: () => void }) {
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
      </div>
    </form>
  );
}
