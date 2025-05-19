import { FC } from "react";

import Link from "next/link";

import { type CustomProjectSummary } from "@shared/dtos/custom-projects/custom-project-output.dto";
import { useAtomValue } from "jotai";
import { FileEdit } from "lucide-react";

import { FEATURE_FLAGS } from "@/lib/feature-flags";

import { PROJECT_SUMMARY } from "@/constants/tooltip";
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
  const idAtom = useAtomValue(customProjectIdAtom);
  const projectId = id || idAtom;
  const showEditButton = FEATURE_FLAGS["edit-project"] && projectId;

  return (
    <div className={"relative flex h-full flex-col gap-8 bg-big-stone-950"}>
      <ScrollArea className="flex-1">
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
      <div className="flex items-center gap-6">
        <p className="flex-1 text-xs text-muted-foreground">
          Calculations based on project setup parameters. For new calculations,
          edit project details.
        </p>
        {showEditButton && (
          <Button type="button" variant="secondary" asChild>
            <Link href={`/projects/${projectId}/edit`}>
              <FileEdit />
              <span>Edit project</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectSummary;
