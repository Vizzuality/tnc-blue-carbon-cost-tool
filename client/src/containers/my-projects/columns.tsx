import Link from "next/link";

import { DotsHorizontalIcon, TrashIcon } from "@radix-ui/react-icons";
import { ACTIVITY } from "@shared/entities/activity.enum";
import { CustomProject as CustomProjectEntity } from "@shared/entities/custom-project.entity";
import { Table as TableInstance, Row, ColumnDef } from "@tanstack/react-table";

import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CustomProject = Partial<CustomProjectEntity>;

type CustomColumn = ColumnDef<CustomProject, keyof CustomProject> & {
  className?: string;
};

const ActionsDropdown = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <DotsHorizontalIcon />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-50" align="end">
      {/* <DropdownMenuItem>
        <ExclamationTriangleIcon className="mr-1 h-4 w-4" />
        Update selection
      </DropdownMenuItem> */}
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
        <Button variant="link" asChild>
          <Link href={`/projects/${row.original.id}`}>{getValue()}</Link>
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "country.name",
    header: "Location",
  },
  {
    accessorKey: "totalCostNPV",
    header: "Total NPV Cost",
    cell: ({ getValue }: { getValue: () => string }) =>
      formatCurrency(Number(getValue()), { maximumFractionDigits: 0 }),
  },
  {
    accessorKey: "abatementPotential",
    header: "Abatement potential",
    cell: ({ getValue }: { getValue: () => string }) => getValue(),
  },
  {
    accessorKey: "activity",
    header: "Type",
    cell: ({ getValue }: { getValue: () => string }) => (
      <div className="flex justify-center">
        <Badge
          variant="default"
          className={cn({
            "border-sky-300 bg-blue-500/20 text-sky-blue-300 hover:bg-blue-500/20":
              getValue() === ACTIVITY.CONSERVATION,
            "border-mint-green-200 bg-green-500/20 text-mint-green-200 hover:bg-green-500/20":
              getValue() === ACTIVITY.RESTORATION,
          })}
        >
          {getValue()}
        </Badge>
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
