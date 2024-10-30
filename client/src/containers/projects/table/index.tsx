import { useTableView } from "@/app/(projects)/url-store";

import ToolbarProjectsTable from "@/containers/projects/table/toolbar";
import { KeyCostsTable } from "@/containers/projects/table/view/key-costs";
import { OverviewTable } from "@/containers/projects/table/view/overview";
import { ScoredCardPrioritizationTable } from "@/containers/projects/table/view/scorecard-prioritization";

export default function TableVisualization() {
  const [tableView] = useTableView();

  return (
    <>
      <ToolbarProjectsTable />
      <div className="mb-4 flex h-full flex-1 flex-col overflow-hidden rounded-md border">
        {tableView === "overview" && <OverviewTable />}
        {tableView === "scorecard-prioritization" && (
          <ScoredCardPrioritizationTable />
        )}
        {tableView === "key-costs" && <KeyCostsTable />}
      </div>
    </>
  );
}
