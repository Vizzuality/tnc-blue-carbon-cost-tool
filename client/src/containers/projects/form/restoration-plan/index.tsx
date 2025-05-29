import { useEffect, useMemo } from "react";

import { useFormContext } from "react-hook-form";

import {
  ACTIVITY_PROJECT_LENGTH_NAMES,
  ECOSYSTEM_RESTORATION_RATE_NAMES,
} from "@shared/schemas/assumptions/assumptions.enums";
import { CustomProjectForm } from "@shared/schemas/custom-projects/create-custom-project.schema";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { RESTORATION_PLAN } from "@/constants/tooltip";

import { useFormValues } from "@/containers/projects/form/project-form";
import {
  COLUMNS,
  RestorationPlanData,
} from "@/containers/projects/form/restoration-plan/columns";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import InfoButton from "@/components/ui/info-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const EMPTY_ARRAY: RestorationPlanData[] = [];

export default function RestorationPlanProjectForm() {
  const form = useFormContext<CustomProjectForm>();

  const {
    ecosystem,
    activity,
    projectSizeHa,
    assumptions: {
      // @ts-expect-error fix later
      projectLength,
      // @ts-expect-error fix later
      restorationRate,
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
  const { data: defaultAssumptions, isSuccess: defaultAssumptionsSuccess } =
    client.customProjects.getDefaultAssumptions.useQuery(
      queryKey,
      {
        query: { ecosystem, activity },
      },
      {
        queryKey,
        select: (data) => data.body.data,
      },
    );

  const defaultRestorationProjectLength = useMemo(() => {
    if (!defaultAssumptionsSuccess) return undefined;

    return Number(
      defaultAssumptions.find(
        (assumption) =>
          assumption.name === ACTIVITY_PROJECT_LENGTH_NAMES.RESTORATION,
      )?.value,
    );
  }, [defaultAssumptionsSuccess, defaultAssumptions]);

  const defaultRestorationRate = useMemo(() => {
    if (!defaultAssumptionsSuccess) return undefined;

    return Number(
      defaultAssumptions.find((assumption) =>
        [
          ECOSYSTEM_RESTORATION_RATE_NAMES.MANGROVE,
          ECOSYSTEM_RESTORATION_RATE_NAMES.SEAGRASS,
          ECOSYSTEM_RESTORATION_RATE_NAMES.SALT_MARSH,
        ].includes(assumption.name as ECOSYSTEM_RESTORATION_RATE_NAMES),
      )?.value,
    );
  }, [defaultAssumptionsSuccess, defaultAssumptions]);

  const { setError, clearErrors } = form;

  const breakDownError =
    // @ts-expect-error fix later
    form.formState.errors.parameters?.restorationYearlyBreakdown;

  const usedProjectLength = projectLength ?? defaultRestorationProjectLength;
  const usedRestorationRate = restorationRate ?? defaultRestorationRate;

  const { queryKey: restorationPlanQueryKey } =
    queryKeys.customProjects.restorationPlan({
      projectSizeHa,
      restorationProjectLength: usedProjectLength,
      restorationRate: usedRestorationRate,
      ecosystem,
    });

  const { data: restorationPlan, isSuccess: restorationPlanSuccess } =
    client.customProjects.getRestorationPlan.useQuery(
      restorationPlanQueryKey,
      {
        query: {
          projectSizeHa,
          restorationProjectLength: usedProjectLength,
          restorationRate: usedRestorationRate,
        },
      },
      {
        queryKey: restorationPlanQueryKey,
        enabled: !!(projectSizeHa && usedProjectLength && usedRestorationRate),
        select: (data) => data.body.data,
      },
    );

  const dataTable = useMemo(() => {
    if (!restorationPlanSuccess) return EMPTY_ARRAY;

    return restorationPlan.map<RestorationPlanData>((defaultPlan) => ({
      ...defaultPlan,
      defaultAnnualHectaresRestored: defaultPlan.annualHectaresRestored,
      annualHectaresRestored:
        restorationYearlyBreakdown[
          defaultPlan.year === -1 ? 0 : defaultPlan.year
        ] ?? undefined,
    }));
  }, [restorationPlanSuccess, restorationPlan, restorationYearlyBreakdown]);

  const table = useReactTable({
    data: restorationPlanSuccess ? dataTable : EMPTY_ARRAY,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  });

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
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-medium">Restoration Plan</h2>
                <div
                  className="inline-flex"
                  onClick={(e) => e.stopPropagation()}
                >
                  <InfoButton title="Restoration Plan">
                    {RESTORATION_PLAN}
                  </InfoButton>
                </div>
              </div>
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
