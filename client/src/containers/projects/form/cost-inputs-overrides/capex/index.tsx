import { useFormContext } from "react-hook-form";

import { ACTIVITY } from "@shared/entities/activity.enum";
import { COSTS_DTO_TO_NAME_MAP } from "@shared/schemas/assumptions/assumptions.enums";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import {
  CapexFormProperty,
  COLUMNS,
} from "@/containers/projects/form/cost-inputs-overrides/capex/columns";
import {
  COST_INPUTS_KEYS,
  DataColumnDef,
} from "@/containers/projects/form/cost-inputs-overrides/constants";
import { CreateCustomProjectForm } from "@/containers/projects/form/setup";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const NO_DATA: DataColumnDef<CapexFormProperty>[] = [];

export default function CapexCostInputsTable() {
  const form = useFormContext<CreateCustomProjectForm>();

  const {
    ecosystem,
    countryCode,
    activity,
    parameters: {
      // @ts-expect-error fix later
      restorationActivity,
    },
  } = form.getValues();

  const { queryKey } = queryKeys.customProjects.defaultCosts({
    ecosystem,
    countryCode,
    activity,
    restorationActivity,
  });

  const { data, isSuccess } =
    client.customProjects.getDefaultCostInputs.useQuery(
      queryKey,
      {
        query: {
          ecosystem,
          countryCode,
          activity,
          ...(activity === ACTIVITY.RESTORATION && { restorationActivity }),
        },
      },
      {
        queryKey,
        select: (data) =>
          Object.keys(data.body.data)
            .filter((key) =>
              COST_INPUTS_KEYS.capex.includes(
                key as (typeof COST_INPUTS_KEYS)["capex"][number],
              ),
            )
            .map((key) => ({
              label:
                COSTS_DTO_TO_NAME_MAP[
                  key as keyof typeof COSTS_DTO_TO_NAME_MAP
                ],
              unit: "N/A",
              property: `costInputs.${key}` as CapexFormProperty,
              defaultValue: data.body.data[key as keyof typeof data.body.data],
              value: "",
            })),
        enabled:
          !!ecosystem &&
          !!countryCode &&
          ((!!activity && activity === ACTIVITY.CONSERVATION) ||
            (activity === ACTIVITY.RESTORATION && !!restorationActivity)),
      },
    );

  const table = useReactTable({
    // @ts-expect-error fix later
    data: isSuccess ? data : NO_DATA,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="divide-x-0">
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className="bg-transparent font-normal"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
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
            <TableRow key={row.id} className="divide-x-0 divide-y-0 border-b-0">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={COLUMNS.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
