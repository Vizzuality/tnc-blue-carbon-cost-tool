import { useAtom } from "jotai";
import { ChevronDown, ChevronUp } from "lucide-react";

import { projectDetailsAtom } from "@/app/(overview)/store";

import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [projectDetails, setProjectDetails] = useAtom(projectDetailsAtom);
  const currentProjectNavigationIndex =
    projectDetails.visibleProjectIds.indexOf(projectDetails.id);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        disabled={
          projectDetails.id ===
          projectDetails.visibleProjectIds[
            projectDetails.visibleProjectIds.length - 1
          ]
        }
        onClick={() => {
          setProjectDetails({
            ...projectDetails,
            id: projectDetails.visibleProjectIds[
              currentProjectNavigationIndex + 1
            ],
          });
        }}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        disabled={projectDetails.id === projectDetails.visibleProjectIds[0]}
        onClick={() => {
          setProjectDetails({
            ...projectDetails,
            id: projectDetails.visibleProjectIds[
              currentProjectNavigationIndex - 1
            ],
          });
        }}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Navigation;
