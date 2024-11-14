import { useFormContext } from "react-hook-form";

import { ASSUMPTIONS_NAME_TO_DTO_MAP } from "@shared/schemas/assumptions/assumptions.enums";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import {
  AssumptionsFormProperty,
  COLUMNS,
} from "@/containers/projects/form/assumptions/columns";
import { DataColumnDef } from "@/containers/projects/form/cost-inputs-overrides/constants";
import { CreateCustomProjectForm } from "@/containers/projects/form/setup";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const NO_DATA: DataColumnDef<AssumptionsFormProperty>[] = [];

export default function AssumptionsProjectForm() {
  const form = useFormContext<CreateCustomProjectForm>();

  const { ecosystem, activity } = form.getValues();

  const { queryKey } = queryKeys.customProjects.assumptions({
    ecosystem,
    activity,
  });
  const { data, isSuccess } =
    client.customProjects.getDefaultAssumptions.useQuery(
      queryKey,
      {
        query: { ecosystem, activity },
      },
      {
        queryKey,
        select: (data) =>
          data.body.data.map(({ name, unit, value }) => ({
            label: name,
            unit,
            property:
              `assumptions.${ASSUMPTIONS_NAME_TO_DTO_MAP[name as keyof typeof ASSUMPTIONS_NAME_TO_DTO_MAP]}` as AssumptionsFormProperty,
            defaultValue: value,
            value: Number(value),
          })),
      },
    );

  // const c = useMemo(() => COLUMNS(), []);

  const table = useReactTable({
    // @ts-expect-error fix later
    data: isSuccess ? data : NO_DATA,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Accordion type="single" collapsible defaultValue="assumptions">
      <AccordionItem value="assumptions" className="border-b-0">
        <AccordionTrigger className="pt-0">
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-medium">Assumptions</h2>
              <span className="font-normal text-muted-foreground">
                optional
              </span>
            </div>
            <p className="font-normal text-muted-foreground">
              Assumptions are applied across all projects, these can be left at
              default settings or can be specified to particular values.
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-0">
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
                  <TableRow
                    key={row.id}
                    className="divide-x-0 divide-y-0 border-b-0"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
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
                    colSpan={COLUMNS.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
