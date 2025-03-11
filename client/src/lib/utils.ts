import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import resolveConfig from "tailwindcss/resolveConfig";

import { formatCurrency } from "@/lib/format";

import { CostItem } from "@/containers/projects/custom-project/cost-details/table";

import tailwindConfig from "@/../tailwind.config";

const { theme } = resolveConfig(tailwindConfig);

export const getThemeSize = (size: keyof typeof theme.screens) => {
  if (theme?.screens && size in theme?.screens) {
    return theme?.screens?.[size];
  }

  console.error(`Theme size ${size} not found`);

  return "";
};

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

const PRIVATE_PAGES =
  /^(\/profile|\/my-projects|\/projects\/[a-f0-9-]+(?:\/edit)?)/;
export const isPrivatePath = (pathname: string) => {
  return PRIVATE_PAGES.test(pathname);
};

export async function signOutFromBackoffice() {
  await fetch("/api/backoffice/signout", {
    method: "POST",
    credentials: "include",
  });
}
