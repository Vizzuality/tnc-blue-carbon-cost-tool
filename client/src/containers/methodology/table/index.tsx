import { Fragment, useMemo } from "react";

import {
  Table,
  TableRow,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface TableHeader {
  [key: string]: string;
}

interface TableRow {
  [key: string]: string | number | React.ReactNode;
  category?: string;
}

interface MethodologyTableProps {
  headers: TableHeader;
  data: TableRow[];
  categorized?: boolean;
}

export default function MethodologyTable({
  headers,
  data,
  categorized = false,
}: MethodologyTableProps) {
  const RegularTable = useMemo(
    () => (
      <TableBody>
        {data.map((row) => (
          <TableRow
            key={`methodology-table-row-${row.id}`}
            className="divide-none"
          >
            {Object.keys(headers).map((key) => (
              <TableCell
                key={`table-cell-${row.id}-${key}`}
                className="px-2 py-4 text-xs"
              >
                {row[key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    ),
    [data, headers],
  );

  const renderCategorizedTable = () => {
    const groupedData = data.reduce(
      (acc, row) => {
        const category = row.category || "";

        if (!acc[category]) {
          acc[category] = [];
        }

        acc[category].push(row);

        return acc;
      },
      {} as Record<string, TableRow[]>,
    );

    return (
      <TableBody>
        {Object.entries(groupedData).map(([category, rows]) => (
          <Fragment key={`methodology-table-category-${category}`}>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={`methodology-table-row-${row.id}`}
                className="divide-none"
              >
                {rowIndex === 0 && (
                  <TableCell
                    rowSpan={rows.length}
                    className="border-r px-2 py-4 align-middle text-xs font-semibold uppercase"
                  >
                    {category}
                  </TableCell>
                )}
                {Object.keys(headers).map((key) => (
                  <TableCell
                    key={`methodology-table-cell-${row.id}-${key}`}
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
              <TableHead className="w-32 bg-big-stone-800/70 text-xs font-normal"></TableHead>
            )}
            {Object.keys(headers).map((key) => (
              <TableHead
                key={`methodology-table-header-${key}`}
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
