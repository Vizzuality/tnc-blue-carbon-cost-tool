import {
  DotsHorizontalIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Table as TableInstance, Row } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CustomColumn, CustomProject } from "./types"; // You might need to move types to a separate file

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

export const columns: CustomColumn[] = [
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
    cell: ({ getValue }: { getValue: () => string }) =>
      `$ ${Number(getValue()).toLocaleString()}`,
  },
  {
    accessorKey: "abatementPotential",
    header: "Abatement potential",
    cell: ({ getValue }: { getValue: () => string }) =>
      Number(getValue()).toLocaleString(),
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
