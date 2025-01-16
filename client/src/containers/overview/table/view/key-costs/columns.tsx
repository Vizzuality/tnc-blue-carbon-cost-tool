import { ProjectKeyCosts } from "@shared/dtos/projects/project-key-costs.dto";
import { CellContext, createColumnHelper } from "@tanstack/react-table";
import { z } from "zod";

import { formatCurrency } from "@/lib/format";

import { filtersSchema } from "@/app/(overview)/url-store";

import { HeaderText, CellText } from "@/containers/overview/table/utils";
import { KEY_COSTS_LABELS } from "@/containers/overview/table/view/key-costs/constants";

const columnHelper = createColumnHelper<ProjectKeyCosts>();

const renderHeader = (label: string) => {
  return function render() {
    return <HeaderText>{label}</HeaderText>;
  };
};

const renderCell = (props: CellContext<ProjectKeyCosts, number>) => {
  const value = props.getValue();
  if (value === null || value === undefined) {
    return "-";
  }
  return <CellText>{formatCurrency(value)}</CellText>;
};

export const columns = (filters: z.infer<typeof filtersSchema>) => {
  const isNPV = filters.costRangeSelector === "npv";
  const implementationLaborAccessor = isNPV
    ? "implementationLaborNPV"
    : "implementationLabor";

  const communityBenefitAccessor = isNPV
    ? "communityBenefitNPV"
    : "communityBenefit";

  const monitoringMaintenanceAccessor = isNPV
    ? "monitoringMaintenanceNPV"
    : "monitoringMaintenance";

  const communityRepresentationAccessor = isNPV
    ? "communityRepresentationNPV"
    : "communityRepresentation";

  const conservationPlanningAccessor = isNPV
    ? "conservationPlanningNPV"
    : "conservationPlanning";

  const longTermProjectOperatingAccessor = isNPV
    ? "longTermProjectOperatingNPV"
    : "longTermProjectOperating";

  const carbonStandardFeesAccessor = isNPV
    ? "carbonStandardFeesNPV"
    : "carbonStandardFees";

  return [
    columnHelper.accessor("projectName", {
      enableSorting: true,
      header: renderHeader("Project Name"),
    }),
    columnHelper.accessor(implementationLaborAccessor, {
      enableSorting: true,
      header: renderHeader(KEY_COSTS_LABELS[implementationLaborAccessor]),
      cell: renderCell,
    }),
    columnHelper.accessor(communityBenefitAccessor, {
      enableSorting: true,
      header: renderHeader(KEY_COSTS_LABELS[communityBenefitAccessor]),
      cell: renderCell,
    }),
    columnHelper.accessor(monitoringMaintenanceAccessor, {
      enableSorting: true,
      header: renderHeader(KEY_COSTS_LABELS[monitoringMaintenanceAccessor]),
      cell: renderCell,
    }),
    columnHelper.accessor(communityRepresentationAccessor, {
      enableSorting: true,
      header: renderHeader(KEY_COSTS_LABELS[communityRepresentationAccessor]),
      cell: renderCell,
    }),
    columnHelper.accessor(conservationPlanningAccessor, {
      enableSorting: true,
      header: renderHeader(KEY_COSTS_LABELS[conservationPlanningAccessor]),
      cell: renderCell,
    }),
    columnHelper.accessor(longTermProjectOperatingAccessor, {
      enableSorting: true,
      header: renderHeader(KEY_COSTS_LABELS[longTermProjectOperatingAccessor]),
      cell: renderCell,
    }),
    columnHelper.accessor(carbonStandardFeesAccessor, {
      enableSorting: true,
      header: renderHeader(KEY_COSTS_LABELS[carbonStandardFeesAccessor]),
      cell: renderCell,
    }),
  ];
};
