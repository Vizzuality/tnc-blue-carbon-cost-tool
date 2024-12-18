import { FC, useState } from "react";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { columns } from "@/containers/projects/custom-project/cost-details/table/columns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface CostItem {
  costName: string;
  label: string;
  value: string;
}

interface CostDetailTableProps {
  data: CostItem[];
}
const CostDetailTable: FC<CostDetailTableProps> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <Table className="rounded-2xl">
        <TableHeader className="sticky top-0 rounded-2xl">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="divide-background border-b-background bg-big-stone-900/60"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
              <TableRow
                key={row.id}
                className={cn({
                  "divide-background border-b-background": true,
                  "bg-big-stone-950 hover:bg-big-stone-950":
                    row.original.costName === "capitalExpenditure" ||
                    row.original.costName === "operationalExpenditure" ||
                    row.original.costName === "totalCost",
                })}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn({
                      "px-4": cell.column.id === "value",
                      "text-muted-foreground": cell.column.id === "label",
                    })}
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
      </Table>
    </div>
  );
};

export default CostDetailTable;
