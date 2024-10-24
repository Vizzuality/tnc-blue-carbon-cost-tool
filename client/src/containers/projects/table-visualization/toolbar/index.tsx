import InfoDownloadProjectsTable from "@/containers/projects/table-visualization/toolbar/info-download";
import SearchProjectsTable from "@/containers/projects/table-visualization/toolbar/search";
import TabsProjectsTable from "@/containers/projects/table-visualization/toolbar/table-selector";

export default function ToolbarProjectsTable() {
  return (
    <div className="flex items-center justify-between py-3">
      <SearchProjectsTable />
      <TabsProjectsTable />
      <InfoDownloadProjectsTable />
    </div>
  );
}
