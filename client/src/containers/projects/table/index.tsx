import { useTableView } from "@/app/(overview)/url-store";

import ToolbarProjectsTable from "@/containers/projects/table/toolbar";
import { KeyCostsTable } from "@/containers/projects/table/view/key-costs";
import { OverviewTable } from "@/containers/projects/table/view/overview";
import { ScoredCardPrioritizationTable } from "@/containers/projects/table/view/scorecard-prioritization";

export default function TableVisualization() {
  const [tableView] = useTableView();

  return (
    <div className="flex h-full flex-1 flex-col rounded-b-md border border-t-0 border-border">
      <ToolbarProjectsTable />
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        {tableView === "overview" && <OverviewTable />}
        {tableView === "scorecard-prioritization" && (
          <ScoredCardPrioritizationTable />
        )}
        {tableView === "key-costs" && <KeyCostsTable />}
      </div>
    </div>
  );
}
