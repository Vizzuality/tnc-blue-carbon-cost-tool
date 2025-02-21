import { Fragment } from "react";

import {
  Table,
  TableRow,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export interface MethodologyBaseTableRow {
  id: string;
  category?: string;
  [key: string]: string | number | React.ReactNode | undefined;
}

export interface MethodologyTableDefinition<T extends MethodologyBaseTableRow> {
  headers: { [K in keyof Omit<T, "id" | "category">]: string };
  rows: T[];
}

interface MethodologyTableProps<T extends MethodologyBaseTableRow> {
  data: MethodologyTableDefinition<T>;
  categorized?: boolean;
}

export default function MethodologyTable<T extends MethodologyBaseTableRow>({
  data,
  categorized = false,
}: MethodologyTableProps<T>) {
  const { headers, rows } = data;
  const headerKeys = Object.keys(headers) as Array<keyof typeof headers>;

  const RegularTable = (
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.id} className="divide-none">
          {headerKeys.map((key) => (
            <TableCell
              key={`table-cell-${row.id}-${String(key)}`}
              className="px-2 py-4 text-xs"
            >
              {row[key] || "-"}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );

  const renderCategorizedTable = () => {
    const groupedData = rows.reduce(
      (acc, row) => {
        const category = row.category || "";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(row);
        return acc;
      },
      {} as Record<string, T[]>,
    );

    return (
      <TableBody>
        {Object.entries(groupedData).map(([category, categoryRows]) => (
          <Fragment key={`methodology-table-category-${category}`}>
            {categoryRows.map((row, rowIndex) => (
              <TableRow key={row.id} className="divide-none">
                {rowIndex === 0 && (
                  <TableCell
                    rowSpan={categoryRows.length}
                    className="border-r px-2 py-4 align-middle text-xs font-semibold uppercase"
                  >
                    {category}
                  </TableCell>
                )}
                {headerKeys.map((key) => (
                  <TableCell
                    key={`methodology-table-cell-${row.id}-${String(key)}`}
                    className="px-2 py-4 text-xs"
                  >
                    {row[key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </Fragment>
        ))}
      </TableBody>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border">
      <Table>
        <TableHeader>
          <TableRow className="h-12 divide-none border-b-background px-2">
            {categorized && (
              <TableHead className="w-32 bg-big-stone-800/70 text-xs font-normal">
                Category
              </TableHead>
            )}
            {headerKeys.map((key) => (
              <TableHead
                key={`methodology-table-header-${String(key)}`}
                className="bg-big-stone-800/70 text-xs font-normal"
              >
                {headers[key]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        {categorized ? renderCategorizedTable() : RegularTable}
      </Table>
    </div>
  );
}
