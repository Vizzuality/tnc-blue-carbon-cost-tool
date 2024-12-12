import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAuthHeader = (token: string | undefined) => {
  if (!token) return {};

  return { Authorization: `Bearer ${token}` };
};
