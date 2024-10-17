import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = [
  {
    label: "Overview",
    value: "overview",
  },
  {
    label: "Scorecard Prioritization",
    value: "scorecard-prioritization",
  },
  {
    label: "Key costs",
    value: "key-costs",
  },
];

export default function TabsProjectsTable() {
  return (
    <Tabs defaultValue={TABS[0].value}>
      <TabsList>
        {TABS.map(({ label, value }) => (
          <TabsTrigger key={value} value={value}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
