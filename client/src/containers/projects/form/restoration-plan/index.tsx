import { useEffect, useMemo } from "react";

import { useFormContext } from "react-hook-form";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { useFormValues } from "@/containers/projects/form/project-form";
import { COLUMNS } from "@/containers/projects/form/restoration-plan/columns";
import { CustomProjectForm } from "@/containers/projects/form/setup";
import { getRestorationPlanTableData } from "@/containers/projects/form/utils";

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

export default function RestorationPlanProjectForm() {
  const form = useFormContext<CustomProjectForm>();

  const {
    ecosystem,
    activity,
    projectSizeHa,
    assumptions: {
      // @ts-expect-error fix later
      projectLength,
    },
    parameters: {
      // @ts-expect-error fix later
      restorationYearlyBreakdown,
    },
  } = useFormValues();

  const { queryKey } = queryKeys.customProjects.assumptions({
    ecosystem,
    activity,
  });
  const { data: defaultRestorationProjectLength } =
    client.customProjects.getDefaultAssumptions.useQuery(
      queryKey,
      {
        query: { ecosystem, activity },
      },
      {
        queryKey,
        select: (data) =>
          Number(
            data.body.data.find(
              (assumption) => assumption.name === "Restoration project length",
            )?.value,
          ),
      },
    );

  const DATA = useMemo(
    () =>
      getRestorationPlanTableData(
        projectLength,
        defaultRestorationProjectLength,
      ),
    [projectLength, defaultRestorationProjectLength],
  );

  const table = useReactTable({
    data: DATA,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  });

  const { setError, clearErrors } = form;

  const breakDownError =
    // @ts-expect-error fix later
    form.formState.errors.parameters?.restorationYearlyBreakdown;

  useEffect(() => {
    const totalHectares = (restorationYearlyBreakdown as string[])
      ?.filter(Boolean)
      .reduce((acc, hectares) => acc + Number(hectares), 0);

    if (totalHectares > projectSizeHa) {
      setError("parameters.restorationYearlyBreakdown", {
        message: `Total hectares restored cannot exceed project size. (${totalHectares}/${projectSizeHa})`,
      });
    } else {
      if (breakDownError?.message) {
        clearErrors("parameters.restorationYearlyBreakdown");
      }
    }
  }, [
    projectSizeHa,
    restorationYearlyBreakdown,
    setError,
    clearErrors,
    breakDownError?.message,
  ]);

  return (
    <Accordion type="single" collapsible defaultValue="assumptions">
      <AccordionItem value="assumptions" className="border-b-0">
        <AccordionTrigger className="pt-0">
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-medium">Restoration Plan</h2>
              <span className="font-normal text-muted-foreground">
                optional
              </span>
            </div>
            <p className="font-normal text-muted-foreground">
              Overrides annual hectares inputs
            </p>
            {breakDownError && (
              <p className="text-destructive">{breakDownError.message}</p>
            )}
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
                        style={{
                          width: header.column.getSize(),
                        }}
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
