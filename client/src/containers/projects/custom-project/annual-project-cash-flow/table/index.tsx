import { FC, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import {
  tableData,
  columns,
} from "@/containers/projects/custom-project/annual-project-cash-flow/table/columns";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination, {
  PAGINATION_SIZE_OPTIONS,
} from "@/components/ui/table-pagination";

const CashFlowTable: FC = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: Number.parseInt(PAGINATION_SIZE_OPTIONS[0]),
  });
  const table = useReactTable({
    data: tableData,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-hidden">
      <ScrollArea className="scroll-x-auto w-full">
        <div className="table h-full w-full table-fixed">
          <table className="w-full caption-bottom text-sm">
            <TableHeader className="sticky top-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="divide-background">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={cn({
                          "text-xs font-normal": true,
                          "text-center": header.id !== "label",
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
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className="px-2 py-2.5"
                        style={
                          index > 0
                            ? {
                                minWidth: cell.column.columnDef.size,
                                maxWidth: cell.column.columnDef.size,
                              }
                            : undefined
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </table>
          <ScrollBar orientation="horizontal" className="" />
        </div>
      </ScrollArea>
      <TablePagination
        onChangePagination={setPagination}
        pagination={{
          ...pagination,
          totalPages: 0,
          totalItems: tableData.length,
        }}
      />
    </div>
  );
};

export default CashFlowTable;
