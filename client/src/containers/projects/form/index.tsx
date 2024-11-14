import AssumptionsProjectForm from "@/containers/projects/form/assumptions";
import CostInputsOverridesProjectForm from "@/containers/projects/form/cost-inputs-overrides";
import SetupProjectForm from "@/containers/projects/form/setup";

import { Card } from "@/components/ui/card";

export default function ProjectForm() {
  return (
    <div className="flex flex-col gap-3">
      <Card className="flex flex-1 flex-col bg-transparent">
        <SetupProjectForm />
      </Card>
      <Card className="flex flex-1 flex-col bg-transparent">
        <AssumptionsProjectForm />
      </Card>
      <Card className="flex flex-1 flex-col bg-transparent">
        <CostInputsOverridesProjectForm />
      </Card>
    </div>
  );
}
