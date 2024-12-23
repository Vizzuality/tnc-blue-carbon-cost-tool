import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { formatCurrency } from "@/lib/format";

import { CostItem } from "@/containers/projects/custom-project/cost-details/table";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAuthHeader = (token: string | undefined) => {
  if (!token) return {};

  return { Authorization: `Bearer ${token}` };
};

export const parseTableData = <
  T extends Record<string, number>,
  K extends keyof T,
>(
  data: T,
  labelMap: Record<K, string>,
): CostItem[] => {
  return Object.keys(labelMap).map((key) => ({
    costName: key,
    label: labelMap[key as K],
    value: formatCurrency(data[key as K], { maximumFractionDigits: 0 }),
  }));
};
