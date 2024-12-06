"use client";

import { useState } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { projectsQuerySchema } from "@shared/contracts/projects.contract";
import { keepPreviousData } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useAtom } from "jotai";
import { ChevronsUpDownIcon } from "lucide-react";
import { z } from "zod";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";

import { projectDetailsAtom } from "@/app/(overview)/store";
import { useGlobalFilters, useTableView } from "@/app/(overview)/url-store";

import ProjectDetails from "@/containers/overview/project-details";
import {
  filtersToQueryParams,
  NO_DATA,
} from "@/containers/overview/table/utils";
import { columns } from "@/containers/overview/table/view/overview/columns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination, {
  PAGINATION_SIZE_OPTIONS,
} from "@/components/ui/table-pagination";

type filterFields = z.infer<typeof projectsQuerySchema.shape.fields>;
type sortFields = z.infer<typeof projectsQuerySchema.shape.sort>;

export function OverviewTable() {
  const [tableView] = useTableView();
  const [filters] = useGlobalFilters();
  const [, setProjectDetails] = useAtom(projectDetailsAtom);
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

  const columnsBasedOnFilters = columns(filters);

  const { data, isSuccess } = client.projects.getProjects.useQuery(
    queryKey,
    {
      query: {
        ...filtersToQueryParams(filters),
        fields: columnsBasedOnFilters.map(
          (column) => column.accessorKey,
        ) as filterFields,
        ...(sorting.length > 0 && {
          sort: sorting.map(
            (sort) => `${sort.desc ? "" : "-"}${sort.id}`,
          ) as sortFields,
        }),
        costRange: filters.costRange,
        abatementPotentialRange: filters.abatementPotentialRange,
        costRangeSelector: filters.costRangeSelector,
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
    columns: columnsBasedOnFilters,
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
      <ProjectDetails />
      <Table>
        <TableHeader className="sticky top-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="divide-background">
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
                className="cursor-pointer"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => {
                  setProjectDetails({
                    isOpen: true,
                    projectName: row.original.projectName ?? "",
                  });
                }}
              >
                {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn({
                        "p-0": cell.column.id === "scoreCardRating",
                      })}
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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
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
