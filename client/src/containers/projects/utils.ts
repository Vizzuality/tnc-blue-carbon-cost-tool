import { CellContext } from "@tanstack/react-table";

import { formatNumber, toPercentageValue } from "@/lib/format";

export const shouldFormatToPercentage = (value: string): boolean =>
  value.includes("%");

export const formatCellValue = <T extends { unit: string }>(
  props: CellContext<T, string>,
): string => {
  const value = props.getValue();
  const unit = props.row.original.unit;

  if (value === null || value === undefined) {
    return "-";
  }

  if (!Number(value)) return value;

  if (shouldFormatToPercentage(unit)) {
    return toPercentageValue(Number(value));
  }

  return formatNumber(Number(value), {
    maximumFractionDigits: 0,
  });
};
