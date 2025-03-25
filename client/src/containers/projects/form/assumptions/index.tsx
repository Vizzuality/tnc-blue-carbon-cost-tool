import { useFormContext } from "react-hook-form";

import {
  ASSUMPTIONS_NAME_TO_DTO_MAP,
  ASSUMPTIONS_NAME_TO_TOOLTIP_MAP,
} from "@shared/schemas/assumptions/assumptions.enums";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { ASSUMPTIONS } from "@/constants/tooltip";

import {
  AssumptionsFormProperty,
  COLUMNS,
} from "@/containers/projects/form/assumptions/columns";
import { DataColumnDef } from "@/containers/projects/form/cost-inputs-overrides/constants";
import { CustomProjectForm } from "@/containers/projects/form/setup";
import FormTable from "@/containers/projects/form/table";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const NO_DATA: DataColumnDef<AssumptionsFormProperty>[] = [];

export default function AssumptionsProjectForm() {
  const form = useFormContext<CustomProjectForm>();

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
          data.body.data
            .filter(({ name }) => name !== "Carbon price")
            .map(({ name, unit, value }) => ({
              label: name,
              unit,
              property:
                `assumptions.${ASSUMPTIONS_NAME_TO_DTO_MAP[name as keyof typeof ASSUMPTIONS_NAME_TO_DTO_MAP]}` as AssumptionsFormProperty,
              defaultValue: value,
              value: Number(value),
              tooltipContent:
                ASSUMPTIONS[
                  ASSUMPTIONS_NAME_TO_TOOLTIP_MAP[
                    name as keyof typeof ASSUMPTIONS_NAME_TO_TOOLTIP_MAP
                  ]
                ],
            })),
      },
    );

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
          <FormTable
            table={table}
            totalColumnsLength={COLUMNS.length}
            id="assumptions-table"
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
