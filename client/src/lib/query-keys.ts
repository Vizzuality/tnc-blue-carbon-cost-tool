import {
  createQueryKeys,
  mergeQueryKeys,
} from "@lukemorales/query-key-factory";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { z } from "zod";

import { filtersSchema } from "@/app/(overview)/url-store";

import { TABLE_VIEWS } from "@/containers/overview/table/toolbar/table-selector";

export const authKeys = createQueryKeys("auth", {
  resetPasswordToken: (token: string) => ["reset-password-token", token],
  confirmEmailToken: (token: string) => ["confirm-email-token", token],
});

export const userKeys = createQueryKeys("user", {
  me: (token: string) => ["me", token],
});

export const geometriesKeys = createQueryKeys("geometries", {
  all: (filters: z.infer<typeof filtersSchema>) => [filters],
});

export const countriesKeys = createQueryKeys("countries", {
  all: null,
});

export const tableKeys = createQueryKeys("tables", {
  all: <TFilters extends z.ZodTypeAny>(
    tableView: (typeof TABLE_VIEWS)[number],
    schema: TFilters,
    filters?: z.infer<TFilters> & {
      sorting?: SortingState;
      pagination?: PaginationState;
    },
  ) => ["all", tableView, filters],
  id: (id: string) => [id],
});

export const queryKeys = mergeQueryKeys(
  authKeys,
  userKeys,
  geometriesKeys,
  tableKeys,
  countriesKeys,
);
