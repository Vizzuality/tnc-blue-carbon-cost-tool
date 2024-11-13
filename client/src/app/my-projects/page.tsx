"use client";

import { useState } from "react";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  DotsHorizontalIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import {
  flexRender,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  Row,
  Table as TableInstance,
} from "@tanstack/react-table";
import { motion } from "framer-motion";
import { ChevronsUpDownIcon, Search } from "lucide-react";

import { cn } from "@/lib/utils";

import TablePagination from "@/containers/projects/table/pagination";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Add this import
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data structure
type CustomProject = {
  id: number;
  projectName: string;
  location: string;
  totalNPVCost: number;
  abatementPotential: number;
  type: "Conservation" | "Restoration";
  className?: string;
};

const LAYOUT_TRANSITIONS = {
  duration: 0.2,
  ease: "easeInOut",
};

// Mock data
const MOCK_DATA: CustomProject[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  projectName: "My custom project",
  location: "Location",
  totalNPVCost: 1075508,
  abatementPotential: 1075508,
  type: i % 3 === 1 ? "Conservation" : "Restoration",
}));

const ActionsDropdown = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <DotsHorizontalIcon />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-50" align="end">
      <DropdownMenuItem>
        <ExclamationTriangleIcon className="mr-1 h-4 w-4" />
        Update selection
      </DropdownMenuItem>
      <DropdownMenuItem>
        <TrashIcon className="mr-1 h-6 w-6" />
        Delete selection
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

type CustomColumn = {
  accessorKey?: string;
  header:
    | string
    | ((props: { table: TableInstance<CustomProject> }) => React.ReactNode);
  cell:
    | string
    | ((props: {
        row: Row<CustomProject>;
        getValue: () => void;
      }) => React.ReactNode);
  className?: string;
  enableSorting?: boolean;
};

const columns = [
  {
    accessorKey: "projectName",
    header: ({ table }: { table: TableInstance<CustomProject> }) => (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
        <span>Project</span>
      </div>
    ),
    cell: ({
      row,
      getValue,
    }: {
      row: Row<CustomProject>;
      getValue: () => string;
    }) => (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
        <span>{getValue()}</span>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "totalNPVCost",
    header: "Total NPV Cost",
    cell: ({ getValue }: { getValue: () => number }) =>
      `$ ${getValue().toLocaleString()}`,
  },
  {
    accessorKey: "abatementPotential",
    header: "Abatement potential",
    cell: ({ getValue }: { getValue: () => number }) =>
      getValue().toLocaleString(),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ getValue }: { getValue: () => string }) => (
      <div className="flex justify-center">
        <span
          className={cn(
            "rounded-full border px-2 py-1 text-xs font-medium",
            getValue() === "Conservation"
              ? "border-sky-300 bg-blue-500/20 text-sky-blue-300"
              : "border-mint-green-200 bg-green-500/20 text-mint-green-200",
          )}
        >
          {getValue()}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: ActionsDropdown,
    cell: ActionsDropdown,
    className: "!border-l-0",
    enableSorting: false,
  },
];

const filters = [
  { label: "All", count: 90 },
  { label: "Conservation", count: 70 },
  { label: "Restoration", count: 20 },
];

export default function MyProjects() {
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
    data: MOCK_DATA,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
      <div className="mx-3 flex flex-1 flex-col">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <h1 className="text-2xl font-medium">My projects</h1>
          </div>
          <Button variant="default">
            <PlusCircledIcon className="mr-1 h-4 w-4" />
            Project
          </Button>
        </div>

        <div className="flex items-center justify-between border-b border-border py-4">
          <div className="flex gap-2 rounded-full bg-slate-900">
            {filters.map((filter) => (
              <Button
                key={filter.label}
                variant="ghost"
                onClick={() => setActiveFilter(filter.label)}
                className={`rounded-full text-sm text-big-stone-200 ${activeFilter === filter.label ? "bg-big-stone-900 text-big-stone-50" : "hover:bg-big-stone-900"} `}
              >
                {filter.label} ({filter.count})
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search"
              className="bg-transparent outline-none"
            />
          </div>
        </div>
        <div className="flex h-full flex-1 flex-col rounded-lg border border-border bg-background">
          <div className="max-h-[550px] flex-1 overflow-auto">
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
                            (cell.column.columnDef as CustomColumn)
                              .accessorKey === "actions"
                              ? "!border-l-0"
                              : ""
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
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border px-4 py-2">
        <TablePagination
          onChangePagination={setPagination}
          pagination={{
            ...pagination,
            totalPages: 6 ?? 0,
            totalItems: 90 ?? 0,
          }}
        />
      </div>
    </motion.div>
  );
}
