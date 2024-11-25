"use client";
import { FC } from "react";

import { motion } from "framer-motion";
import { useAtomValue } from "jotai";

import { LAYOUT_TRANSITIONS } from "@/app/(overview)/constants";
import { projectsUIState } from "@/app/(overview)/store";

import AnnualProjectCashFlow from "@/containers/projects/custom-project/annual-project-cash-flow";
import ProjectCost from "@/containers/projects/custom-project/cost";
import CostDetails from "@/containers/projects/custom-project/cost-details";
import ProjectDetails from "@/containers/projects/custom-project/details";
import CustomProjectHeader from "@/containers/projects/custom-project/header";
import LeftOver from "@/containers/projects/custom-project/left-over";
import ProjectSummary from "@/containers/projects/custom-project/summary";

import { useSidebar } from "@/components/ui/sidebar";

export const SUMMARY_SIDEBAR_WIDTH = 460;
const CustomProject: FC = () => {
  const { projectSummaryOpen } = useAtomValue(projectsUIState);
  const { open: navOpen } = useSidebar();

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
        <ProjectSummary />
      </motion.aside>
      <div className="mx-3 flex flex-1 flex-col">
        <CustomProjectHeader />
        <div className="mb-4 mt-2 flex gap-4">
          <ProjectDetails />
          <ProjectCost />
          <LeftOver />
          <CostDetails />
        </div>
        <AnnualProjectCashFlow />
      </div>
    </motion.div>
  );
};

export default CustomProject;
