"use client";

import { useMemo, useState } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { projectsQuerySchema } from "@shared/contracts/projects.contract";
import { ProjectKeyCosts } from "@shared/dtos/projects/project-key-costs.dto";
import { keepPreviousData } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useAtom } from "jotai/index";
import { ChevronsUpDownIcon } from "lucide-react";
import { z } from "zod";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";

import { projectDetailsAtom } from "@/app/(overview)/store";
import {
  useProjectOverviewFilters,
  useTableView,
} from "@/app/(overview)/url-store";

import { useTablePaginationReset } from "@/hooks/use-table-pagination-reset";

import {
  filtersToQueryParams,
  getColumnSortTitle,
  NO_DATA,
} from "@/containers/overview/table/utils";
import { columns } from "@/containers/overview/table/view/key-costs/columns";

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

type filterFields = z.infer<typeof projectsQuerySchema.shape.fields>;
type sortFields = z.infer<typeof projectsQuerySchema.shape.sort>;

export function KeyCostsTable() {
  const [, setProjectDetails] = useAtom(projectDetailsAtom);
  const [tableView] = useTableView();
  const [filters] = useProjectOverviewFilters();
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
  useTablePaginationReset(filters.keyword, setPagination);

  const queryKey = queryKeys.tables.all(tableView, projectsQuerySchema, {
    ...filters,
    sorting,
    pagination,
  }).queryKey;

  const columnsBasedOnFilters = columns(filters);

  const { data, isSuccess } = client.projects.getProjectsKeyCosts.useQuery(
    queryKey,
    {
      query: {
        ...filtersToQueryParams(filters),
        fields: columnsBasedOnFilters.map(
          (column) => column.accessorKey,
        ) as filterFields,
        ...(sorting.length > 0 && {
          sort: sorting.map(
            (sort) => `${sort.desc ? "-" : ""}${sort.id}`,
          ) as sortFields,
        }),
        costRange: filters.costRange,
        abatementPotentialRange: filters.abatementPotentialRange,
        costRangeSelector: filters.costRangeSelector,
        pageNumber: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        partialProjectName: filters.keyword,
      },
    },
    {
      queryKey,
      select: (data) => data.body,
      placeholderData: keepPreviousData,
    },
  );

  const visibleProjectIds = useMemo(() => {
    return data?.data?.map((item) => item.id!) || [];
  }, [data]);

  const table = useReactTable({
    data: isSuccess ? (data?.data as ProjectKeyCosts[]) : NO_DATA,
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
      <ScrollableTable>
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
                        title={getColumnSortTitle(header.column)}
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
                className="group cursor-pointer transition-colors hover:bg-big-stone-950"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => {
                  setProjectDetails({
                    isOpen: true,
                    id: row.original.id!,
                    visibleProjectIds,
                  });
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn({
                      "group-hover:underline": cell.column.id === "projectName",
                      "min-w-[200px] max-w-[200px] truncate":
                        cell.column.id === "projectName",
                      "px-4 py-2": cell.column.id !== "scoreCardRating",
                    })}
                    title={
                      typeof cell.getValue() === "string"
                        ? (cell.getValue() as string)
                        : undefined
                    }
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
          totalPages: data?.metadata?.totalPages ?? 0,
          totalItems: data?.metadata?.totalItems ?? 0,
        }}
      />
    </>
  );
}
