import { ACTIVITY } from "@shared/entities/activity.enum";
import { COSTS_DTO_MAP } from "@shared/schemas/assumptions/assumptions.enums";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import {
  COST_INPUTS_KEYS,
  DataColumnDef,
} from "@/containers/projects/form/cost-inputs-overrides/constants";
import {
  COLUMNS,
  OpexFormProperty,
} from "@/containers/projects/form/cost-inputs-overrides/opex/columns";
import { useFormValues } from "@/containers/projects/form/project-form";
import FormTable from "@/containers/projects/form/table";

const NO_DATA: DataColumnDef<OpexFormProperty>[] = [];

export default function OpexCostInputsTable() {
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
              COST_INPUTS_KEYS.opex.includes(
                key as (typeof COST_INPUTS_KEYS)["opex"][number],
              ),
            )
            .map((key) => ({
              label: COSTS_DTO_MAP[key as keyof typeof COSTS_DTO_MAP].label,
              unit: COSTS_DTO_MAP[key as keyof typeof COSTS_DTO_MAP].unit,
              property: `costInputs.${key}` as OpexFormProperty,
              defaultValue: data.body.data[key as keyof typeof data.body.data],
              value: "",
            })),
        enabled:
          (!!activity && activity === ACTIVITY.CONSERVATION) ||
          (activity === ACTIVITY.RESTORATION && !!restorationActivity),
      },
    );

  const table = useReactTable({
    // @ts-expect-error fix later
    data: isSuccess ? data : NO_DATA,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  });

  return <FormTable table={table} totalColumnsLength={COLUMNS.length} />;
}
