"use client";
import { FC } from "react";

import { CustomProject as CustomProjectEntity } from "@shared/entities/custom-project.entity";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";

import { toPercentageValue } from "@/lib/format";

import { LAYOUT_TRANSITIONS } from "@/app/(overview)/constants";
import { projectsUIState } from "@/app/projects/store";

import { useCustomProjectOutput } from "@/hooks/use-custom-project-output";
import { useGetCustomProject } from "@/hooks/use-get-custom-project";

import AnnualProjectCashFlow from "@/containers/projects/custom-project/annual-project-cash-flow";
import ProjectCost from "@/containers/projects/custom-project/cost";
import CostDetails from "@/containers/projects/custom-project/cost-details";
import ProjectDetails from "@/containers/projects/custom-project/details";
import CustomProjectHeader from "@/containers/projects/custom-project/header";
import LeftOver from "@/containers/projects/custom-project/left-over";
import ProjectSummary from "@/containers/projects/custom-project/summary";

import { useSidebar } from "@/components/ui/sidebar";

export const SUMMARY_SIDEBAR_WIDTH = 460;

interface CustomProjectProps {
  id?: string;
}

const CustomProject: FC<CustomProjectProps> = ({ id }) => {
  const data = useGetCustomProject(id);

  // TODO: Maybe add a spinner/skeleton?
  if (!data) return null;

  return <CustomProjectView data={data} />;
};

const CustomProjectView: FC<{
  data: InstanceType<typeof CustomProjectEntity>;
}> = ({ data }) => {
  const { projectSummaryOpen } = useAtomValue(projectsUIState);
  const { open: navOpen } = useSidebar();
  const {
    projectCostProps,
    projectDetailsProps,
    leftOverProps,
    costDetailsProps,
    chartData,
    tableData,
    summaryData,
  } = useCustomProjectOutput(data);

  return (
    <motion.div
      layout
      layoutDependency={navOpen}
      className="flex flex-1"
      transition={LAYOUT_TRANSITIONS}
    >
      <motion.aside
        layout
        initial={projectSummaryOpen ? "open" : "closed"}
        animate={projectSummaryOpen ? "open" : "closed"}
        variants={{
          open: {
            width: SUMMARY_SIDEBAR_WIDTH,
          },
          closed: {
            width: 0,
          },
        }}
        transition={LAYOUT_TRANSITIONS}
        className="overflow-hidden"
      >
        {summaryData && (
          <ProjectSummary
            data={{
              ...summaryData,
              "IRR when priced to cover OpEx": parseFloat(
                toPercentageValue(summaryData["IRR when priced to cover OpEx"]),
              ),
              "Community benefit sharing fund": parseFloat(
                toPercentageValue(
                  summaryData["Community benefit sharing fund"],
                ),
              ),
            }}
          />
        )}
      </motion.aside>
      <div className="mx-4 flex flex-1 flex-col">
        <CustomProjectHeader data={data} />
        <div className="mb-4 mt-2 flex gap-4">
          <ProjectDetails {...projectDetailsProps} />
          {projectCostProps && <ProjectCost {...projectCostProps} />}
          {leftOverProps && <LeftOver {...leftOverProps} />}
          {costDetailsProps && (
            <CostDetails
              data={costDetailsProps}
              hasOpenBreakEvenPrice={
                data.output?.breakevenPriceComputationOutput !== null
              }
            />
          )}
        </div>
        <AnnualProjectCashFlow tableData={tableData} chartData={chartData} />
      </div>
    </motion.div>
  );
};

export default CustomProject;
