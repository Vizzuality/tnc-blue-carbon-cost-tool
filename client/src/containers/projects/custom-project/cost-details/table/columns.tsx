import { createColumnHelper } from "@tanstack/react-table";

import SensitivityAnalysisColumn from "@/containers/projects/custom-project/cost-details/table/sensitivity-analysis";
import { useCustomProjectOutput } from "@/hooks/use-custom-project-output";
import { SensitivityAnalysis } from "@shared/dtos/custom-projects/custom-project-output.dto";

export type ColumnsTypes = ReturnType<
  typeof useCustomProjectOutput
>["costDetailsProps"][number] & {
  sensitivityAnalysis: SensitivityAnalysis[keyof SensitivityAnalysis] & {
    scaledNegative: number;
    scaledPositive: number;
  };
};

const columnHelper = createColumnHelper<ColumnsTypes>();

export const columns = [
  columnHelper.accessor("label", {
    enableSorting: true,
    header: () => <span>Cost estimates</span>,
  }),
  columnHelper.accessor("value", {
    enableSorting: true,
    header: () => <span>Cost $/tCo2</span>,
  }),
  columnHelper.accessor("sensitivityAnalysis", {
    header: () => <span>Sensitivity analysis</span>,
    cell: ({ getValue }) => {
      if (!getValue()) return null;

      return <SensitivityAnalysisColumn datum={getValue()} />;
    },
  }),
];
