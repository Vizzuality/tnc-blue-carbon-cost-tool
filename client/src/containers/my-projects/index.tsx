"use client";

import { useState } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
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
import { cn } from "@/lib/utils";

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
import TablePagination from "@/components/ui/table-pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { columns } from "./columns";
import Header from "./header";

const LAYOUT_TRANSITIONS = {
  duration: 0.2,
  ease: "easeInOut",
};

export default function MyProjectsView({
  filters,
}: {
  filters: { label: string; count: number }[];
}) {
  const { data: session } = useSession();
  const queryKey = queryKeys.customProjects.all.queryKey;
  const { data } = client.customProjects.getCustomProjects.useQuery(
    queryKey,
    {
      extraHeaders: {
        authorization: `Bearer ${session?.accessToken as string}`,
      },
    },
    {
      select: (d) => d.body,
      queryKey,
    },
  );
  const { open: navOpen } = useSidebar();

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "projectName",
      desc: false,
    },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [activeFilter, setActiveFilter] = useState("All");

  const table = useReactTable({
    data:
      data?.data?.filter((project) =>
        activeFilter === "All" ? true : project.activity === activeFilter,
      ) || [],
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
              defaultValue={filters[0].label}
              onValueChange={setActiveFilter}
            >
              <TabsList>
                {filters.map(({ label, count }) => (
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
              onChange={() => {}}
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
