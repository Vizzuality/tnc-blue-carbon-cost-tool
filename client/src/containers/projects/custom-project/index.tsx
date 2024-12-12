"use client";
import { FC, useMemo } from "react";

import { ConservationProjectOutput } from "@shared/dtos/custom-projects/custom-project-output.dto";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";

import { LAYOUT_TRANSITIONS } from "@/app/(overview)/constants";
import { costDetailsFilterAtom, projectsUIState } from "@/app/projects/store";

import { useGetCustomProject } from "@/hooks/use-get-custom-project";

import AnnualProjectCashFlow from "@/containers/projects/custom-project/annual-project-cash-flow";
import {
  getBreakdownYears,
  parseYearlyBreakdownForChart,
  parseYearlyBreakdownForTable,
} from "@/containers/projects/custom-project/annual-project-cash-flow/utils";
import ProjectCost from "@/containers/projects/custom-project/cost";
import CostDetails from "@/containers/projects/custom-project/cost-details";
import { parseCostDetailsForTable } from "@/containers/projects/custom-project/cost-details/table/utils";
import ProjectDetails from "@/containers/projects/custom-project/details";
import CustomProjectHeader from "@/containers/projects/custom-project/header";
import LeftOver from "@/containers/projects/custom-project/left-over";
import ProjectSummary from "@/containers/projects/custom-project/summary";
import { useCustomProjectFilters } from "@/containers/projects/url-store";

import { useSidebar } from "@/components/ui/sidebar";

export const SUMMARY_SIDEBAR_WIDTH = 460;

interface CustomProjectProps {
  id?: string;
}

const CustomProject: FC<CustomProjectProps> = ({ id }) => {
  const [{ costRangeSelector }] = useCustomProjectFilters();
  const costDetailsRangeSelector = useAtomValue(costDetailsFilterAtom);
  const { projectSummaryOpen } = useAtomValue(projectsUIState);
  const { open: navOpen } = useSidebar();
  const data = useGetCustomProject(id);
  // TODO: should be replaced with correct type when available;
  const output = data.output as ConservationProjectOutput;
  const projectCostProps = output.totalProjectCost[costRangeSelector];
  const leftOverProps = output.leftover[costRangeSelector];
  const costDetailsProps = useMemo(
    () =>
      ({
        total: parseCostDetailsForTable(output.costDetails.total),
        npv: parseCostDetailsForTable(output.costDetails.npv),
      })[costDetailsRangeSelector],
    [
      costDetailsRangeSelector,
      output.costDetails.total,
      output.costDetails.npv,
    ],
  );
  const chartData = useMemo(
    () =>
      parseYearlyBreakdownForChart(
        output.yearlyBreakdown,
        getBreakdownYears(output.yearlyBreakdown),
      ),
    [output.yearlyBreakdown],
  );
  const tableData = useMemo(
    () => parseYearlyBreakdownForTable(output.yearlyBreakdown),
    [output.yearlyBreakdown],
  );

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
        <CustomProjectHeader data={data} />
        <div className="mb-4 mt-2 flex gap-4">
          <ProjectDetails
            data={{
              country: data.country,
              projectSize: data.projectSize,
              projectLength: data.projectLength,
              ecosystem: data.ecosystem,
              carbonRevenuesToCover: output.carbonRevenuesToCover,
              activity: data.activity,
              initialCarbonPrice: output.initialCarbonPrice,
              lossRate: output.lossRate,
              emissionFactors: output.emissionFactors,
            }}
          />
          <ProjectCost {...projectCostProps} />
          <LeftOver {...leftOverProps} />
          <CostDetails data={costDetailsProps} />
        </div>
        <AnnualProjectCashFlow tableData={tableData} chartData={chartData} />
      </div>
    </motion.div>
  );
};

export default CustomProject;
