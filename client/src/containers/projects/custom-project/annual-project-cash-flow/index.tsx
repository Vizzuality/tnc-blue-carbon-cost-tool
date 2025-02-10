import { FC } from "react";

import { YearlyBreakdown } from "@shared/dtos/custom-projects/custom-project-output.dto";
import { CARBON_REVENUES_TO_COVER } from "@shared/entities/custom-project.entity";

import { useProjectCashFlowTab } from "@/app/projects/url-store";

import CashflowChart from "@/containers/projects/custom-project/annual-project-cash-flow/chart";
import Header from "@/containers/projects/custom-project/annual-project-cash-flow/header";
import CashFlowTable from "@/containers/projects/custom-project/annual-project-cash-flow/table";
import { YearlyBreakdownChartData } from "@/containers/projects/custom-project/annual-project-cash-flow/utils";

import { Card } from "@/components/ui/card";

interface AnnualProjectCashFlowProps {
  chartData: YearlyBreakdownChartData;
  tableData: YearlyBreakdown[];
  breakevenPoint: number | null;
  carbonRevenuesToCover?: CARBON_REVENUES_TO_COVER;
}
const AnnualProjectCashFlow: FC<AnnualProjectCashFlowProps> = ({
  tableData,
  chartData,
  breakevenPoint,
  carbonRevenuesToCover,
}) => {
  const [tab] = useProjectCashFlowTab();
  return (
    <Card variant="secondary" className="flex flex-col overflow-hidden p-0">
      <Header />
      {tab === "table" ? (
        <CashFlowTable data={tableData} />
      ) : (
        <CashflowChart
          data={chartData}
          carbonRevenuesToCover={carbonRevenuesToCover}
          breakevenPoint={breakevenPoint}
        />
      )}
    </Card>
  );
};

export default AnnualProjectCashFlow;
