import { ACTIVITY } from "@shared/entities/activity.enum";
import { getCapexCostInputsKeys } from "@shared/lib/utils";
import { COSTS_DTO_MAP } from "@shared/schemas/assumptions/assumptions.enums";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import {
  CapexFormProperty,
  COLUMNS,
} from "@/containers/projects/form/cost-inputs-overrides/capex/columns";
import { DataColumnDef } from "@/containers/projects/form/cost-inputs-overrides/constants";
import { useFormValues } from "@/containers/projects/form/project-form";
import FormTable from "@/containers/projects/form/table";

const NO_DATA: DataColumnDef<CapexFormProperty>[] = [];

export default function CapexCostInputsTable() {
  const {
    ecosystem,
    countryCode,
    activity,
    parameters: {
      // @ts-expect-error fix later
      restorationActivity,
    },
  } = useFormValues();

  const { queryKey } = queryKeys.customProjects.defaultCosts({
    ecosystem,
    countryCode,
    activity,
    ...(activity === ACTIVITY.RESTORATION && { restorationActivity }),
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
          getCapexCostInputsKeys(data.body.data).map((key) => ({
            label: COSTS_DTO_MAP[key as keyof typeof COSTS_DTO_MAP].label,
            unit: COSTS_DTO_MAP[key as keyof typeof COSTS_DTO_MAP].unit,
            property: `costInputs.${key}` as CapexFormProperty,
            defaultValue: data.body.data[key as keyof typeof data.body.data],
            value: "",
            tooltipContent:
              COSTS_DTO_MAP[key as keyof typeof COSTS_DTO_MAP].tooltipContent,
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
    <FormTable
      table={table}
      totalColumnsLength={COLUMNS.length}
      id="cost-inputs-capex-table"
    />
  );
}
