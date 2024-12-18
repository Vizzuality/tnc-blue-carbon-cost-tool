"use client";

import { ComponentProps, useMemo, useState } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { ACTIVITY } from "@shared/entities/activity.enum";
import { keepPreviousData } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { motion } from "framer-motion";
import { ChevronsUpDownIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { cn, getAuthHeader } from "@/lib/utils";

import { useMyProjectsFilters } from "@/app/my-projects/url-store";

import { useTablePaginationReset } from "@/hooks/use-table-pagination-reset";

import Search from "@/components/ui/search";
import { useSidebar } from "@/components/ui/sidebar";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { columns } from "./columns";
import Header from "./header";

const LAYOUT_TRANSITIONS = {
  duration: 0.2,
  ease: "easeInOut",
};

export default function MyProjectsView() {
  const { data: session } = useSession();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: Number.parseInt(PAGINATION_SIZE_OPTIONS[0]),
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "projectName",
      desc: false,
    },
  ]);
  const [filters, setFilters] = useMyProjectsFilters();
  const queryKey = queryKeys.customProjects.all({
    ...filters,
    sorting,
    pagination,
  }).queryKey;

  useTablePaginationReset(filters.keyword, setPagination);

  const { data } = client.customProjects.getCustomProjects.useQuery(
    queryKey,
    {
      query: {
        include: ["country"],
        filter: {
          activity: filters.activity,
        },
        partialProjectName: filters.keyword || undefined,
        pageNumber: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      },
      extraHeaders: {
        ...getAuthHeader(session?.accessToken as string),
      },
    },
    {
      select: (d) => d.body,
      queryKey,
      placeholderData: keepPreviousData,
    },
  );
  const { open: navOpen } = useSidebar();
  const table = useReactTable({
    data: data?.data || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    enableRowSelection: true,
    enableMultiRowSelection: true,
  });
  const AllProjectsQueryKey = queryKeys.customProjects.all({
    sorting,
    pagination,
  }).queryKey;
  const allProjectsQuery = client.customProjects.getCustomProjects.useQuery(
    AllProjectsQueryKey,
    {
      query: {
        include: ["country"],
        pageNumber: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      },
      extraHeaders: {
        authorization: `Bearer ${session?.accessToken as string}`,
      },
    },
    {
      select: (d) => d.body,
      queryKey: AllProjectsQueryKey,
    },
  );
  const activities = useMemo(
    () =>
      [
        { label: "All", count: allProjectsQuery?.data?.data?.length || 0 },
      ].concat(
        Object.values(ACTIVITY)
          .map((activity) => ({
            label: activity,
            count:
              allProjectsQuery?.data?.data?.filter(
                (p) => p.activity === activity,
              ).length || 0,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      ),
    [allProjectsQuery?.data?.data],
  );
  const handleSearch = async (
    v: Parameters<ComponentProps<typeof Search>["onChange"]>[0],
  ) => {
    await setFilters((prev) => ({ ...prev, keyword: v }));
  };

  return (
    <motion.div
      layout
      layoutDependency={navOpen}
      className="flex flex-1 flex-col"
      transition={LAYOUT_TRANSITIONS}
    >
      <div className="mx-3 flex h-full flex-1 flex-col">
        <Header />
        <div className="flex items-center justify-between py-4">
          <div className="flex gap-2 rounded-full bg-slate-900">
            <Tabs
              defaultValue={activities[0].label}
              onValueChange={(v) =>
                setFilters((prev) => ({
                  ...prev,
                  activity: v === "All" ? [] : [v as ACTIVITY],
                }))
              }
            >
              <TabsList>
                {activities.map(({ label, count }) => (
                  <TabsTrigger key={label} value={label}>
                    {label} ({count})
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="flex gap-2">
            <Search
              placeholder="Search"
              onChange={handleSearch}
              defaultValue={filters?.keyword}
              className="flex-1"
            />
          </div>
        </div>
        <div className="mb-4 flex h-full flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background">
          <div className="flex h-full flex-1 flex-col overflow-hidden">
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
                                "flex items-center justify-between space-x-2":
                                  true,
                                "cursor-pointer select-none":
                                  header.column.getCanSort(),
                              })}
                              onClick={header.column.getToggleSortingHandler()}
                              title={
                                header.column.getCanSort()
                                  ? header.column.getNextSortingOrder() ===
                                    "asc"
                                    ? "Sort ascending"
                                    : header.column.getNextSortingOrder() ===
                                        "desc"
                                      ? "Sort descending"
                                      : "Clear sort"
                                  : undefined
                              }
                            >
                              <div>
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                              </div>
                              {header.column.getCanSort() && (
                                <div>
                                  {{
                                    asc: <ChevronUpIcon className="h-4 w-4" />,
                                    desc: (
                                      <ChevronDownIcon className="h-4 w-4" />
                                    ),
                                  }[header.column.getIsSorted() as string] ?? (
                                    <ChevronsUpDownIcon className="h-4 w-4" />
                                  )}
                                </div>
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
                        <TableCell
                          key={cell.id}
                          className={
                            cell.column.id === "actions" ? "!border-l-0" : ""
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
                      No custom projects found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              onChangePagination={setPagination}
              pagination={{
                ...pagination,
                totalPages: data?.metadata?.totalPages || 0,
                totalItems: data?.metadata?.totalItems || 0,
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
