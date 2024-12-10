"use client";
import { FC } from "react";

import { CustomProject as CustomProjectEntity } from "@shared/entities/custom-project.entity";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";

import { LAYOUT_TRANSITIONS } from "@/app/(overview)/constants";
import { costDetailsFilterAtom, projectsUIState } from "@/app/projects/store";

import AnnualProjectCashFlow from "@/containers/projects/custom-project/annual-project-cash-flow";
import {
  getBreakdownYears,
  parseYearlyBreakdownForChart,
} from "@/containers/projects/custom-project/annual-project-cash-flow/utils";
import ProjectCost from "@/containers/projects/custom-project/cost";
import CostDetails from "@/containers/projects/custom-project/cost-details";
import { parseCostDetailsForTable } from "@/containers/projects/custom-project/cost-details/table/utils";
import ProjectDetails from "@/containers/projects/custom-project/details";
import CustomProjectHeader from "@/containers/projects/custom-project/header";
import LeftOver from "@/containers/projects/custom-project/left-over";
import mockData from "@/containers/projects/custom-project/mock-data";
import ProjectSummary from "@/containers/projects/custom-project/summary";
import { useCustomProjectFilters } from "@/containers/projects/url-store";

import { useSidebar } from "@/components/ui/sidebar";

// Temporary use of mock data until response from API is ready
const { costDetails, leftover } = mockData.data;
const costDetailsData = {
  total: parseCostDetailsForTable(costDetails.total),
  npv: parseCostDetailsForTable(costDetails.npv),
};

export const SUMMARY_SIDEBAR_WIDTH = 460;

interface CustomProjectProps {
  data: InstanceType<typeof CustomProjectEntity>;
}

const CustomProject: FC<CustomProjectProps> = ({ data }) => {
  const [{ costRangeSelector }] = useCustomProjectFilters();
  const costDetailsRangeSelector = useAtomValue(costDetailsFilterAtom);
  const { projectSummaryOpen } = useAtomValue(projectsUIState);
  const { open: navOpen } = useSidebar();
  // TODO: should be replaced with correct type when available;
  const output = data.output as any;
  const projectCostProps = output.totalProjectCost[costRangeSelector];
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
        <ProjectSummary data={output.summary} />
      </motion.aside>
      <div className="mx-3 flex flex-1 flex-col">
        <CustomProjectHeader />
        <div className="mb-4 mt-2 flex gap-4">
          <ProjectDetails
            country={data.country}
            projectSize={data.projectSize}
            projectLength={data.projectLength}
            ecosystem={data.ecosystem}
            activity={data.activity}
            lossRate={output.lossRate}
            carbonRevenuesToCover={output.carbonRevenuesToCover}
            initialCarbonPrice={output.initialCarbonPrice}
            emissionFactors={output.emissionFactors}
          />
          <ProjectCost {...projectCostProps} />
          <LeftOver {...leftOverProps} />
          <CostDetails data={costDetailsProps} />
        </div>
        <AnnualProjectCashFlow
          tableData={output.yearlyBreakdown}
          chartData={parseYearlyBreakdownForChart(
            output.yearlyBreakdown,
            getBreakdownYears(output.yearlyBreakdown),
          )}
        />
      </div>
    </motion.div>
  );
};

export default CustomProject;
