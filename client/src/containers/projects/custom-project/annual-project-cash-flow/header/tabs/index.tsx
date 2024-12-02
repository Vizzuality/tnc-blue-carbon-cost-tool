import { ChartNoAxesColumnIcon, Table2Icon } from "lucide-react";

import { useProjectCashFlowTab } from "@/app/projects/[id]/store";

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
  const [tab, setTab] = useProjectCashFlowTab();

  return (
    <Tabs
      defaultValue={tab}
      onValueChange={async (v) => {
        await setTab(v as typeof tab);
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
