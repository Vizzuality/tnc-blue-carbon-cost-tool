import { FC, useState } from "react";

import { YearlyBreakdown } from "@shared/dtos/custom-projects/custom-project-output.dto";
import {
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { columns } from "@/containers/projects/custom-project/annual-project-cash-flow/table/columns";
import { getBreakdownYears } from "@/containers/projects/custom-project/annual-project-cash-flow/utils";

import {
  ScrollableTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination, {
  PAGINATION_SIZE_OPTIONS,
} from "@/components/ui/table-pagination";

interface CashFlowTableProps {
  data: YearlyBreakdown[];
}
const CashFlowTable: FC<CashFlowTableProps> = ({ data }) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: Number.parseInt(PAGINATION_SIZE_OPTIONS[0]),
  });
  const table = useReactTable({
    data,
    columns: columns(getBreakdownYears(data)),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-hidden">
      <ScrollableTable>
        <TableHeader className="sticky top-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="divide-background">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn({
                      "text-xs font-normal": true,
                      "text-center": header.id !== "costName",
                    })}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="divide-x-0">
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn({
                      "px-2 py-2.5": true,
                      "text-center": cell.column.id !== "costName",
                    })}
                    style={{
                      minWidth: cell.column.columnDef.size,
                      maxWidth: cell.column.columnDef.size,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </ScrollableTable>
      <TablePagination
        onChangePagination={setPagination}
        pagination={{
          ...pagination,
          totalPages: 0,
          totalItems: data.length,
        }}
      />
    </div>
  );
};

export default CashFlowTable;
