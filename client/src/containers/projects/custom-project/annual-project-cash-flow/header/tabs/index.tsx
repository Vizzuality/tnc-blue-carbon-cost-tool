import { ChartNoAxesColumnIcon, Table2Icon } from "lucide-react";

import { useProjectCashFlowView } from "@/app/projects/[id]/store";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const CASH_FLOW_VIEWS = ["chart", "table"] as const;

export const CASH_FLOW_TABS = [
  {
    Icon: <ChartNoAxesColumnIcon className="h-4 w-4" />,
    value: CASH_FLOW_VIEWS[0],
  },
  {
    Icon: <Table2Icon className="h-4 w-4" />,
    value: CASH_FLOW_VIEWS[1],
  },
] as const;

export default function CashFlowTabs() {
  const [view, setView] = useProjectCashFlowView();

  return (
    <Tabs
      defaultValue={view}
      onValueChange={async (v) => {
        await setView(v as typeof view);
      }}
    >
      <TabsList>
        {CASH_FLOW_TABS.map(({ Icon, value }) => (
          <TabsTrigger key={value} value={value}>
            {Icon}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
