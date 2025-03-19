import { FC, useCallback, useEffect } from "react";

import Link from "next/link";

import { type CustomProjectSummary } from "@shared/dtos/custom-projects/custom-project-output.dto";
import { useAtomValue, useSetAtom } from "jotai";
import { FileEdit, XIcon } from "lucide-react";

import { FEATURE_FLAGS } from "@/lib/feature-flags";

import { projectsUIState } from "@/app/projects/store";

import { PROJECT_SUMMARY } from "@/constants/tooltip";

import { SUMMARY_SIDEBAR_WIDTH } from "@/containers/projects/custom-project";
import { customProjectIdAtom } from "@/containers/projects/custom-project/store";

import { Button } from "@/components/ui/button";
import InfoButton from "@/components/ui/info-button";
import Metric from "@/components/ui/metric";
import { ScrollArea } from "@/components/ui/scroll-area";

const customProjectSummaryUnitMap: Record<keyof CustomProjectSummary, string> =
  {
    "$/tCO2e (total cost, NPV)": "$",
    "$/ha": "$",
    "Net revenue after OPEX": "$",
    "Net revenue after Total cost": "$",
    "IRR when priced to cover OpEx": "%",
    "IRR when priced to cover total cost": "%",
    "Total cost (NPV)": "$",
    "Capital expenditure (NPV)": "$",
    "Operating expenditure (NPV)": "$",
    "Credits issued": "",
    "Total revenue (NPV)": "$",
    "Total revenue (non-discounted)": "$",
    "Financing cost": "$",
    "Funding gap (NPV)": "$",
    "Funding gap per tCO2e (NPV)": "$",
    "Landowner/community benefit share": "%",
  } as const;
interface ProjectSummaryProps {
  id?: string;
  data: CustomProjectSummary;
}
const ProjectSummary: FC<ProjectSummaryProps> = ({ id, data }) => {
  const setProjectSummaryOpen = useSetAtom(projectsUIState);
  const idAtom = useAtomValue(customProjectIdAtom);
  const projectId = id || idAtom;
  const showEditButton = FEATURE_FLAGS["edit-project"] && projectId;
  const closeProjectSummary = useCallback(() => {
    setProjectSummaryOpen((prev) => ({
      ...prev,
      projectSummaryOpen: false,
    }));
  }, [setProjectSummaryOpen]);

  useEffect(() => {
    // Make sure to close the project summary when the component unmounts
    return () => {
      closeProjectSummary();
    };
  }, [closeProjectSummary]);

  return (
    <div
      className={"relative flex h-full flex-col gap-8 bg-big-stone-950 py-6"}
      style={{ width: SUMMARY_SIDEBAR_WIDTH }}
    >
      <Button
        type="button"
        variant="ghost"
        className="absolute right-2 top-2 p-3 hover:bg-transparent"
        onClick={closeProjectSummary}
      >
        <XIcon className="h-4 w-4 text-foreground hover:text-muted-foreground" />
      </Button>
      <header className="px-6">
        <h2 className="text-xl font-semibold">Summary</h2>
      </header>
      <ScrollArea className="flex-1 px-6">
        <ul className="space-y-1">
          {(Object.keys(data) as Array<keyof CustomProjectSummary>).map(
            (key) => (
              <div
                key={key}
                className="flex justify-between border-b border-dashed py-1.5"
              >
                <div className="flex items-center gap-2">
                  <div className="text-sm font-normal">{key}</div>
                  <InfoButton title={key}>{PROJECT_SUMMARY[key]}</InfoButton>
                </div>
                <div className="text-base font-medium">
                  <Metric
                    value={data[key]}
                    unit={customProjectSummaryUnitMap[key]}
                    unitBeforeValue
                  />
                </div>
              </div>
            ),
          )}
        </ul>
      </ScrollArea>
      <div className="flex px-6">
        <p className="flex-1 text-xs text-muted-foreground">
          Calculations based on project setup parameters. For new calculations,
          edit project details.
        </p>
        {showEditButton && (
          <Button type="button" variant="outline" asChild>
            <Link href={`/projects/${projectId}/edit`}>
              <FileEdit />
              <span>Edit Project</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectSummary;
