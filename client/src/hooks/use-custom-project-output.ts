import { useMemo } from "react";

import { CUSTOM_PROJECT_PRICE_TYPE } from "@shared/dtos/custom-projects/custom-projects.enums";
import { CustomProject } from "@shared/entities/custom-project.entity";
import { useAtomValue } from "jotai";

import { toPercentageValue } from "@/lib/format";

import { costDetailsFilterAtom } from "@/app/projects/store";

import {
  getBreakdownYears,
  parseYearlyBreakdownForChart,
  parseYearlyBreakdownForTable,
} from "@/containers/projects/custom-project/annual-project-cash-flow/utils";
import { parseCostDetailsForTable } from "@/containers/projects/custom-project/cost-details/table/utils";
import { useCustomProjectFilters } from "@/containers/projects/url-store";

export const useCustomProjectOutput = (
  data: InstanceType<typeof CustomProject>,
) => {
  const [{ costRangeSelector, priceType }] = useCustomProjectFilters();
  const costDetailsRangeSelector = useAtomValue(costDetailsFilterAtom);
  const key =
    priceType === CUSTOM_PROJECT_PRICE_TYPE.INITIAL_CARBON_PRICE_ASSUMPTION
      ? "initialCarbonPriceComputationOutput"
      : "breakevenPriceComputationOutput";
  const output = data.output[key];

  const projectDetailsProps = useMemo(
    () => ({
      data: {
        country: data.country,
        projectSize: data.projectSize,
        projectLength: data.projectLength,
        ecosystem: data.ecosystem,
        activity: data.activity,
        carbonRevenuesToCover: output?.carbonRevenuesToCover,
        initialCarbonPrice: output?.initialCarbonPrice,
        lossRate: output?.lossRate,
        emissionFactors: output?.emissionFactors,
      },
    }),
    [data, output],
  );

  const costDetailsProps = useMemo(
    () =>
      ({
        total: parseCostDetailsForTable(output?.costDetails.total),
        npv: parseCostDetailsForTable(output?.costDetails.npv),
      })[costDetailsRangeSelector],
    [
      costDetailsRangeSelector,
      output?.costDetails.total,
      output?.costDetails.npv,
    ],
  );

  const chartData = useMemo(
    () =>
      parseYearlyBreakdownForChart(
        output?.yearlyBreakdown || [],
        getBreakdownYears(output?.yearlyBreakdown || []),
      ),
    [output?.yearlyBreakdown],
  );

  const tableData = useMemo(
    () => parseYearlyBreakdownForTable(output?.yearlyBreakdown || []),
    [output?.yearlyBreakdown],
  );

  const summaryData = useMemo(
    () =>
      output?.summary
        ? {
            ...output.summary,
            "IRR when priced to cover OpEx": parseFloat(
              toPercentageValue(
                output.summary["IRR when priced to cover OpEx"],
              ),
            ),
            "Community benefit sharing fund": parseFloat(
              toPercentageValue(
                output.summary["Community benefit sharing fund"],
              ),
            ),
          }
        : null,
    [output?.summary],
  );

  return {
    projectCostProps: output?.totalProjectCost[costRangeSelector],
    leftOverProps: output?.leftover[costRangeSelector],
    projectDetailsProps,
    costDetailsProps,
    chartData,
    tableData,
    summaryData,
    output,
  };
};
