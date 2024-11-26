import { FC } from "react";

import Header from "@/containers/projects/custom-project/annual-project-cash-flow/header";

import { Card } from "@/components/ui/card";

const AnnualProjectCashFlow: FC = () => {
  return (
    <Card variant="secondary" className="p-0">
      <Header />
    </Card>
  );
};

export default AnnualProjectCashFlow;
