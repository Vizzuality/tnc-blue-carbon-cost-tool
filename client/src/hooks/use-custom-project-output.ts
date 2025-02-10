import { useMemo } from "react";

import { ConservationProjectOutput } from "@shared/dtos/custom-projects/custom-project-output.dto";
import { CUSTOM_PROJECT_PRICE_TYPE } from "@shared/dtos/custom-projects/custom-projects.enums";
import {
  CARBON_REVENUES_TO_COVER,
  CustomProject,
} from "@shared/entities/custom-project.entity";

import { toPercentageValue } from "@/lib/format";

import { CUSTOM_PROJECT_OUTPUTS } from "@/constants/tooltip";

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
        lossRate:
          output instanceof ConservationProjectOutput
            ? parseFloat(toPercentageValue(output?.lossRate ?? 0))
            : 0,
        emissionFactors:
          output instanceof ConservationProjectOutput
            ? output.emissionFactors
            : undefined,
        sequestrationRate:
          output instanceof ConservationProjectOutput
            ? undefined
            : output?.sequestrationRate,
      },
    }),
    [data, output],
  );

  const costDetailsProps = useMemo(
    () =>
      ({
        total: parseCostDetailsForTable(output?.costDetails.total),
        npv: parseCostDetailsForTable(output?.costDetails.npv),
      })[costRangeSelector],
    [costRangeSelector, output?.costDetails.total, output?.costDetails.npv],
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
  const leftOverProps = useMemo(() => {
    const tooltipContent =
      data.input.carbonRevenuesToCover === CARBON_REVENUES_TO_COVER.OPEX
        ? CUSTOM_PROJECT_OUTPUTS.NET_REVENUE_AFTER_OPEX_TOTAL_COST
        : CUSTOM_PROJECT_OUTPUTS.NET_REVENUE_AFTER_CAPEX_OPEX_TOTAL_COST;
    return {
      title: `Net revenue after ${data.input.carbonRevenuesToCover}/Total cost`,
      tooltip: {
        title: `Net revenue after ${data.input.carbonRevenuesToCover}/Total cost`,
        content: tooltipContent,
      },
      data: output?.leftover[costRangeSelector],
    };
  }, [output?.leftover, costRangeSelector, data.input.carbonRevenuesToCover]);
  const annualProjectCashFlowProps = useMemo(
    () => ({
      tableData,
      chartData,
      carbonRevenuesToCover: output?.carbonRevenuesToCover,
      breakevenPoint:
        chartData.find((item) => item.cumulativeNetIncomePlan >= 0)?.year ||
        null,
    }),
    [tableData, chartData, output?.carbonRevenuesToCover],
  );

  return {
    projectCostProps: output?.totalProjectCost[costRangeSelector],
    leftOverProps,
    projectDetailsProps,
    costDetailsProps,
    annualProjectCashFlowProps,
    summaryData,
    output,
  };
};
