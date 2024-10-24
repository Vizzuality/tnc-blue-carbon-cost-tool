import { useTableMode } from "@/app/(projects)/url-store";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const TABLE_MODES = [
  "overview",
  "scorecard-prioritization",
  "key-costs",
] as const;

export const TABLE_TABS = [
  {
    label: "Overview",
    value: TABLE_MODES[0],
  },
  {
    label: "Scorecard Prioritization",
    value: TABLE_MODES[1],
  },
  {
    label: "Key costs",
    value: TABLE_MODES[2],
  },
] as const;

export default function TabsProjectsTable() {
  const [tableMode, setTableMode] = useTableMode();
  return (
    <Tabs
      defaultValue={tableMode}
      onValueChange={async (v) => {
        await setTableMode(v as typeof tableMode);
      }}
    >
      <TabsList>
        {TABLE_TABS.map(({ label, value }) => (
          <TabsTrigger key={value} value={value}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
