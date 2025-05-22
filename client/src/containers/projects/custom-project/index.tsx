"use client";
import { FC, useEffect } from "react";

import { CustomProject as CustomProjectEntity } from "@shared/entities/custom-project.entity";
import { useAtom, useSetAtom } from "jotai";

import { toPercentageValue } from "@/lib/format";

import { projectsUIState } from "@/app/projects/store";

import { useCustomProjectOutput } from "@/hooks/use-custom-project-output";
import { useGetCustomProject } from "@/hooks/use-get-custom-project";

import AnnualProjectCashFlow from "@/containers/projects/custom-project/annual-project-cash-flow";
import BreakevenPriceModal from "@/containers/projects/custom-project/breakeven-price-modal";
import ProjectCost from "@/containers/projects/custom-project/cost";
import CostDetails from "@/containers/projects/custom-project/cost-details";
import ProjectDetails from "@/containers/projects/custom-project/details";
import CustomProjectHeader from "@/containers/projects/custom-project/header";
import LeftOver from "@/containers/projects/custom-project/left-over";
import { customProjectIdAtom } from "@/containers/projects/custom-project/store";
import ProjectSummary from "@/containers/projects/custom-project/summary";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const SUMMARY_SIDEBAR_WIDTH = 460;

interface CustomProjectProps {
  id?: string;
}

const CustomProject: FC<CustomProjectProps> = ({ id }) => {
  const { data, isFetching } = useGetCustomProject(id);

  // TODO: Maybe add a spinner/skeleton?
  if (!data) return null;

  return <CustomProjectView data={data} isFetching={isFetching} id={id} />;
};

const CustomProjectView: FC<{
  data: InstanceType<typeof CustomProjectEntity>;
  isFetching: boolean;
  id?: string;
}> = ({ data, isFetching, id }) => {
  const [{ projectSummaryOpen }, setProjectSummaryOpen] =
    useAtom(projectsUIState);
  const {
    projectCostProps,
    projectDetailsProps,
    leftOverProps,
    costDetailsProps,
    annualProjectCashFlowProps,
    summaryData,
  } = useCustomProjectOutput(data);

  const hasOpenBreakEvenPrice =
    data.output.breakevenPriceComputationOutput !== null;
  const redirectPath = id
    ? `/projects/${id}/edit`
    : "/projects/new?useCache=true";
  const setProjectId = useSetAtom(customProjectIdAtom);

  useEffect(() => {
    return () => setProjectId(null);
  }, [setProjectId]);

  return (
    <div className="flex flex-1">
      <Sheet
        open={projectSummaryOpen}
        onOpenChange={(v) => {
          setProjectSummaryOpen((prev) => ({
            ...prev,
            projectSummaryOpen: v,
          }));
        }}
      >
        <SheetContent
          className="flex h-full flex-col gap-4 overflow-hidden bg-big-stone-950"
          style={{
            width: `${SUMMARY_SIDEBAR_WIDTH}px`,
          }}
        >
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Summary</h2>
            </SheetTitle>
          </SheetHeader>
          <ProjectSummary
            id={id}
            data={{
              ...(summaryData as NonNullable<typeof summaryData>),
              ...(summaryData && {
                "IRR when priced to cover OpEx": parseFloat(
                  toPercentageValue(
                    summaryData["IRR when priced to cover OpEx"],
                  ),
                ),
                "Landowner/community benefit share": parseFloat(
                  toPercentageValue(
                    summaryData["Landowner/community benefit share"],
                  ),
                ),
              }),
            }}
          />
        </SheetContent>
      </Sheet>
      <div className="mx-4 flex flex-1 flex-col">
        <BreakevenPriceModal
          open={!isFetching && !hasOpenBreakEvenPrice}
          redirectPath={redirectPath}
        />
        <CustomProjectHeader data={data} />
        <div className="mb-4 mt-2 flex gap-4">
          <ProjectDetails {...projectDetailsProps} />
          {projectCostProps && <ProjectCost {...projectCostProps} />}
          {leftOverProps && <LeftOver {...leftOverProps} />}
          {costDetailsProps && (
            <CostDetails
              data={costDetailsProps}
              hasOpenBreakEvenPrice={!isFetching && hasOpenBreakEvenPrice}
            />
          )}
        </div>
        <AnnualProjectCashFlow {...annualProjectCashFlowProps} />
      </div>
    </div>
  );
};

export default CustomProject;
