import InfoDownloadProjectsTable from "@/containers/projects/table/toolbar/info-download";
import SearchProjectsTable from "@/containers/projects/table/toolbar/search";
import TabsProjectsTable from "@/containers/projects/table/toolbar/table-selector";

export default function ToolbarProjectsTable() {
  return (
    <div className="flex items-center justify-between px-5 py-3">
      <SearchProjectsTable />
      <TabsProjectsTable />
      <InfoDownloadProjectsTable />
    </div>
  );
}
