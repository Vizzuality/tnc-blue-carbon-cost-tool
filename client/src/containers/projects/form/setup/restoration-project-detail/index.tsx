import { useAtom } from "jotai/index";

import { projectFormState } from "@/app/projects/store";

import { Card } from "@/components/ui/card";

export default function RestorationProjectDetails() {
  const [formStore] = useAtom(projectFormState);

  return <Card className="bg-transparent">RestorationProjectDetails TBD</Card>;
}
