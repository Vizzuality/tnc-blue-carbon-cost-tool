"use client";
import { FC } from "react";

import { motion } from "framer-motion";
import { useAtomValue } from "jotai";

import { LAYOUT_TRANSITIONS } from "@/app/(overview)/constants";
import {
  costDetailsFilterAtom,
  projectsUIState,
} from "@/app/projects/[id]/store";

import AnnualProjectCashFlow from "@/containers/projects/custom-project/annual-project-cash-flow";
import ProjectCost from "@/containers/projects/custom-project/cost";
import CostDetails from "@/containers/projects/custom-project/cost-details";
import ProjectDetails from "@/containers/projects/custom-project/details";
import CustomProjectHeader from "@/containers/projects/custom-project/header";
import LeftOver from "@/containers/projects/custom-project/left-over";
import mockData from "@/containers/projects/custom-project/mock-data";
import ProjectSummary from "@/containers/projects/custom-project/summary";
import { useCustomProjectFilters } from "@/containers/projects/url-store";

import { useSidebar } from "@/components/ui/sidebar";
import { formatCurrency } from "@/lib/format";

const {
  country,
  projectSize,
  projectLength,
  ecosystem,
  activity,
  lossRate,
  carbonRevenuesToCover,
  initialCarbonPrice,
  emissionFactors,
  totalProjectCost,
  summary,
  costDetails,
  leftover,
} = mockData.data;
const costDetailsData = {
  total: Object.keys(costDetails.total).map((k) => ({
    costName: k,
    label: k,
    value: formatCurrency(
      costDetails.total[k as keyof typeof costDetails.total],
      { maximumFractionDigits: 0 },
    ),
  })),
  npv: Object.keys(costDetails.npv).map((k) => ({
    costName: k,
    label: k,
    value: formatCurrency(costDetails.npv[k as keyof typeof costDetails.npv], {
      maximumFractionDigits: 0,
    }),
  })),
};
export const SUMMARY_SIDEBAR_WIDTH = 460;
const CustomProject: FC = () => {
  const [{ costRangeSelector }] = useCustomProjectFilters();
  const costDetailsRangeSelector = useAtomValue(costDetailsFilterAtom);
  const { projectSummaryOpen } = useAtomValue(projectsUIState);
  const { open: navOpen } = useSidebar();
  const projectCostProps = totalProjectCost[costRangeSelector];
  const costDetailsProps = costDetailsData[costDetailsRangeSelector];
  const leftOverProps = leftover[costRangeSelector];

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
        <ProjectSummary data={summary} />
      </motion.aside>
      <div className="mx-3 flex flex-1 flex-col">
        <CustomProjectHeader />
        <div className="mb-4 mt-2 flex gap-4">
          <ProjectDetails
            country={country}
            projectSize={projectSize}
            projectLength={projectLength}
            ecosystem={ecosystem}
            activity={activity}
            lossRate={lossRate}
            carbonRevenuesToCover={carbonRevenuesToCover}
            initialCarbonPrice={initialCarbonPrice}
            emissionFactors={emissionFactors}
          />
          <ProjectCost {...projectCostProps} />
          <LeftOver {...leftOverProps} />
          <CostDetails data={costDetailsProps} />
        </div>
        <AnnualProjectCashFlow />
      </div>
    </motion.div>
  );
};

export default CustomProject;
