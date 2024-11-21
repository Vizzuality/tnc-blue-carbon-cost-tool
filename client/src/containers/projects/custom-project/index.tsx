"use client";
import { FC } from "react";

import { motion } from "framer-motion";
import { useAtomValue } from "jotai";

import { LAYOUT_TRANSITIONS } from "@/app/(overview)/constants";
import { projectsUIState } from "@/app/(overview)/store";

import CustomProjectDetails from "@/containers/projects/custom-project/details";
import CustomProjectHeader from "@/containers/projects/custom-project/header";
import CustomProjectSummary from "@/containers/projects/custom-project/summary";

import { useSidebar } from "@/components/ui/sidebar";

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
            width: 460,
          },
          closed: {
            width: 0,
          },
        }}
        transition={LAYOUT_TRANSITIONS}
        className="overflow-hidden"
      >
        <CustomProjectSummary />
      </motion.aside>
      <div className="mx-3 flex flex-1 flex-col">
        <CustomProjectHeader />
        <div className="flex gap-4">
          <CustomProjectDetails />
        </div>
      </div>
    </motion.div>
  );
};

export default CustomProject;
