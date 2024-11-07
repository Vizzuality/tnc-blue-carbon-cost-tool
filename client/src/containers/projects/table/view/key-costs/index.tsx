"use client";

import { useState } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { keepPreviousData } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronsUpDownIcon } from "lucide-react";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";

import { useGlobalFilters, useTableView } from "@/app/(projects)/url-store";

import TablePagination, {
  PAGINATION_SIZE_OPTIONS,
} from "@/containers/projects/table/pagination";
import {
  filtersToQueryParams,
  NO_DATA,
} from "@/containers/projects/table/utils";
import { TABLE_COLUMNS } from "@/containers/projects/table/view/key-costs/columns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function KeyCostsTable() {
  const [tableView] = useTableView();
  const [filters] = useGlobalFilters();
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "projectName",
      desc: true,
    },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: Number.parseInt(PAGINATION_SIZE_OPTIONS[0]),
  });

  const queryKey = queryKeys.projects.all(tableView, {
    ...filters,
    sorting,
    pagination,
  }).queryKey;

  const { data, isSuccess } = client.projects.getProjects.useQuery(
    queryKey,
    {
      query: {
        ...filtersToQueryParams(filters),
        // fields: TABLE_COLUMNS.map((column) => column.accessorKey),
        // ...(sorting.length > 0 && {
        //   sort: sorting.map((sort) => `${sort.desc ? "" : "-"}${sort.id}`),
        // }),
        // fields: [''],
        pageNumber: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      },
    },
    {
      queryKey,
      select: (data) => data.body,
      placeholderData: keepPreviousData,
    },
  );

  const table = useReactTable({
    data: isSuccess ? data.data : NO_DATA,
    columns: TABLE_COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  return (
    <>
      <Table>
        <TableHeader className="sticky top-0 bg-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn({
                          "flex items-center space-x-2": true,
                          "cursor-pointer select-none":
                            header.column.getCanSort(),
                        })}
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === "asc"
                              ? "Sort ascending"
                              : header.column.getNextSortingOrder() === "desc"
                                ? "Sort descending"
                                : "Clear sort"
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: <ChevronUpIcon className="h-4 w-4" />,
                          desc: <ChevronDownIcon className="h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? (
                          <ChevronsUpDownIcon className="h-4 w-4" />
                        )}
                      </div>
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
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={TABLE_COLUMNS.length}>
                <div className="flex flex-1 justify-center">No results.</div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        onChangePagination={setPagination}
        pagination={{
          ...pagination,
          totalPages: data?.metadata?.totalPages ?? 0,
          totalItems: data?.metadata?.totalItems ?? 0,
        }}
      />
    </>
  );
}
