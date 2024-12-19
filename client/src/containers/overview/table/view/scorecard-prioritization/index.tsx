"use client";

import { useState } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { projectScorecardQuerySchema } from "@shared/contracts/projects.contract";
import { ProjectScorecardView } from "@shared/entities/project-scorecard.view";
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

import { useTablePaginationReset } from "@/hooks/use-table-pagination-reset";

import ProjectDetails from "@/containers/overview/project-details";
import {
  filtersToQueryParams,
  NO_DATA,
} from "@/containers/overview/table/utils";
import { TABLE_COLUMNS } from "@/containers/overview/table/view/scorecard-prioritization/columns";

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

import { scorecardFiltersSchema } from "./schema";

type sortFields = z.infer<typeof projectScorecardQuerySchema.shape.sort>;

export function ScoredCardPrioritizationTable() {
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
  const queryKey = queryKeys.tables.all(tableView, scorecardFiltersSchema, {
    filters,
    sorting,
    pagination,
  }).queryKey;
  useTablePaginationReset(filters.keyword, setPagination);

  const { data, isSuccess } = client.projects.getProjectsScorecard.useQuery(
    queryKey,
    {
      query: {
        ...filtersToQueryParams(filters),
        costRange: filters.costRange,
        abatementPotentialRange: filters.abatementPotentialRange,
        costRangeSelector: filters.costRangeSelector,
        partialProjectName: filters.keyword,
        ...(sorting.length > 0 && {
          sort: sorting.map(
            (sort) => `${sort.desc ? "" : "-"}${sort.id}`,
          ) as sortFields,
        }),
        pageNumber: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      },
    },
    {
      queryKey,
      select: (data) => ({
        ...data.body,
        data: data.body.data as ProjectScorecardView[],
      }),
      placeholderData: keepPreviousData,
    },
  );

  const table = useReactTable({
    data: isSuccess ? data.data : (NO_DATA as ProjectScorecardView[]),
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
                className="cursor-pointer hover:bg-muted/50"
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
                      "p-0": cell.column.id !== "projectName",
                    })}
                  >
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
      <ProjectDetails />
    </>
  );
}
