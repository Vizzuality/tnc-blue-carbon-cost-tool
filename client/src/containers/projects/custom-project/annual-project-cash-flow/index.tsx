import { FC } from "react";

import { useProjectCashFlowTab } from "@/app/projects/[id]/url-store";

import CashflowChart from "@/containers/projects/custom-project/annual-project-cash-flow/chart";
import Header from "@/containers/projects/custom-project/annual-project-cash-flow/header";
import CashFlowTable from "@/containers/projects/custom-project/annual-project-cash-flow/table";

import { Card } from "@/components/ui/card";

const AnnualProjectCashFlow: FC = () => {
  const [tab] = useProjectCashFlowTab();

  return (
    <Card variant="secondary" className="flex flex-col overflow-hidden p-0">
      <Header />
      {tab === "table" ? <CashFlowTable /> : <CashflowChart />}
    </Card>
  );
};

export default AnnualProjectCashFlow;
