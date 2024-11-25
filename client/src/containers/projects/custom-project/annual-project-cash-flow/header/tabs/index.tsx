import { useProjectCashFlowView } from "@/containers/projects/custom-project/store";

import {
  Tabs as ShadcnTabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export const CASH_FLOW_VIEWS = ["chart", "table"] as const;

export const CASH_FLOW_TABS = [
  {
    label: "chart",
    value: CASH_FLOW_VIEWS[0],
  },
  {
    label: "table",
    value: CASH_FLOW_VIEWS[1],
  },
] as const;

export default function Tabs() {
  const [view, setView] = useProjectCashFlowView();
  return (
    <ShadcnTabs
      defaultValue={view}
      onValueChange={async (v) => {
        await setView(v as typeof view);
      }}
    >
      <TabsList>
        {CASH_FLOW_TABS.map(({ label, value }) => (
          <TabsTrigger key={value} value={value}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </ShadcnTabs>
  );
}
