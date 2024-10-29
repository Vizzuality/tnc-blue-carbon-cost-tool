import { ProjectsTable } from "@/containers/projects/table-visualization/data-table";
import ToolbarProjectsTable from "@/containers/projects/table-visualization/toolbar";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function TableVisualization() {
  return (
    <>
      <ToolbarProjectsTable />
      <ProjectsTable columns={[]} data={[]} />
      <div className="flex">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <div>
          <ul className="flex items-center space-x-4">
            <li className="flex items-center space-x-2">
              <span className="block h-4 w-4 bg-green-400" />
              <span>CapEx</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="block h-4 w-4 bg-orange-400" />
              <span>OpEx</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
