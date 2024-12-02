import { FC } from "react";

import { useSetAtom } from "jotai";
import { XIcon } from "lucide-react";

import { projectsUIState } from "@/app/projects/[id]/store";

import { SUMMARY_SIDEBAR_WIDTH } from "@/containers/projects/custom-project";

import FileEdit from "@/components/icons/file-edit";
import { Button } from "@/components/ui/button";
import InfoButton from "@/components/ui/info-button";
import Metric from "@/components/ui/metric";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectSummaryProps {
  data: {
    [key: string]: number | null;
  };
}
const ProjectSummary: FC<ProjectSummaryProps> = ({ data }) => {
  const setProjectSummaryOpen = useSetAtom(projectsUIState);

  return (
    <div
      className={"relative flex h-full flex-col gap-8 bg-big-stone-950 py-6"}
      style={{ width: SUMMARY_SIDEBAR_WIDTH }}
    >
      <Button
        type="button"
        variant="ghost"
        className="absolute right-2 top-2 p-3 hover:bg-transparent"
        onClick={() => {
          setProjectSummaryOpen((prev) => ({
            ...prev,
            projectSummaryOpen: false,
          }));
        }}
      >
        <XIcon className="h-4 w-4 text-foreground hover:text-muted-foreground" />
      </Button>
      <header className="px-6">
        <h2 className="text-xl font-semibold">Summary</h2>
      </header>
      <ScrollArea className="flex-1 px-6">
        <ul className="space-y-1">
          {Object.keys(data).map((key) => (
            <div
              key={key}
              className="flex justify-between border-b border-dashed py-1.5"
            >
              <div className="flex items-center gap-2">
                <div className="text-sm font-normal">{key}</div>
                <InfoButton title="{tooltip.title}">tooltip.content</InfoButton>
              </div>
              <div className="text-base font-medium">
                <Metric value={data[key]} unit="$" unitBeforeValue />
              </div>
            </div>
          ))}
        </ul>
      </ScrollArea>
      <div className="flex px-6">
        <p className="flex-1 text-xs text-muted-foreground">
          Calculations based on project setup parameters. For new calculations,
          edit project details.
        </p>
        <Button type="button" variant="outline">
          <FileEdit />
          <span>Edit Project</span>
        </Button>
      </div>
    </div>
  );
};

export default ProjectSummary;
