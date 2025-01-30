import { flexRender } from "@tanstack/react-table";
import { Table as TableInstance } from "@tanstack/react-table";

import { TableCell } from "@/components/ui/table";
import { TableBody } from "@/components/ui/table";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface FormTableProps<T> {
  table: TableInstance<T>;
  totalColumnsLength: number;
}

export default function FormTable<T>({
  table,
  totalColumnsLength,
}: FormTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="divide-x-0">
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className="bg-transparent font-normal"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
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
            <TableRow key={row.id} className="divide-x-0 divide-y-0 border-b-0">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={totalColumnsLength}
              className="h-24 text-center"
            >
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
