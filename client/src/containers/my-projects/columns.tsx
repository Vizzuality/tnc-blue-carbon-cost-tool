import { useCallback } from "react";

import Link from "next/link";

import {
  DotsHorizontalIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { ACTIVITY } from "@shared/entities/activity.enum";
import { CustomProject as CustomProjectEntity } from "@shared/entities/custom-project.entity";
import { Table as TableInstance, Row, ColumnDef } from "@tanstack/react-table";
import { useSession } from "next-auth/react";

import { formatCurrency } from "@/lib/format";
import { client } from "@/lib/query-client";
import { cn, getAuthHeader } from "@/lib/utils";

import { useFeatureFlags } from "@/hooks/use-feature-flags";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/toast/use-toast";

type CustomProject = Partial<CustomProjectEntity>;

type CustomColumn = ColumnDef<CustomProject, keyof CustomProject> & {
  className?: string;
};

const ActionsDropdown = ({
  instance,
}: {
  instance: TableInstance<CustomProject> | Row<CustomProject>;
}) => {
  const { "update-selection": updateSelection } = useFeatureFlags();
  const isHeader = "getSelectedRowModel" in instance;
  const deleteLabel = isHeader ? "Delete selection" : "Delete project";
  const { data: session } = useSession();
  const { toast } = useToast();
  const deleteCustomProject = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const { status } =
          await client.customProjects.deleteCustomProject.mutation({
            params: {
              id,
            },
            extraHeaders: {
              ...getAuthHeader(session?.accessToken as string),
            },
          });

        return status === 200;
      } catch (e) {
        return false;
      }
    },
    [session?.accessToken],
  );

  const handleDelete = async () => {
    const results: boolean[] = [];

    if (isHeader) {
      const selectedRows = (
        instance as TableInstance<CustomProject>
      ).getSelectedRowModel().rows;

      for (const row of selectedRows) {
        const result = await deleteCustomProject(row.original.id as string);
        results.push(result);
      }
    } else if (instance.original.id) {
      const result = await deleteCustomProject(instance.original.id);
      results.push(result);
    }

    const successCount = results.filter(Boolean).length;
    const failureCount = results.length - successCount;

    if (successCount > 0) {
      toast({
        description:
          successCount === 1
            ? "Project deleted successfully"
            : `${successCount} projects deleted successfully`,
      });
    }

    if (failureCount > 0) {
      toast({
        variant: "destructive",
        description:
          failureCount === 1
            ? "Failed to delete project"
            : `Failed to delete ${failureCount} projects`,
      });
    }
  };

  return (
    <div className="flex w-full justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <DotsHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-50" align="end">
          {updateSelection && (
            <DropdownMenuItem>
              <ExclamationTriangleIcon className="mr-1 h-4 w-4" />
              Update selection
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="cursor-pointer space-x-2 text-sm font-normal"
            disabled={
              isHeader &&
              (instance as TableInstance<CustomProject>).getSelectedRowModel()
                .rows.length === 0
            }
            onClick={handleDelete}
          >
            <TrashIcon className="h-4 w-4" />
            {deleteLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

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
            "bg-green-500/20 hover:bg-green-500/20 border-mint-green-200 text-mint-green-200":
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
    header: ({ table }) => <ActionsDropdown instance={table} />,
    cell: ({ row }) => <ActionsDropdown instance={row} />,
    className: "!border-l-0",
    enableSorting: false,
  },
];
