import {
  createQueryKeys,
  mergeQueryKeys,
} from "@lukemorales/query-key-factory";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { z } from "zod";

import { filtersSchema } from "@/app/(projects)/url-store";

import { TABLE_VIEWS } from "@/containers/projects/table/toolbar/table-selector";

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

export const projectKeys = createQueryKeys("projects", {
  all: (
    tableView: (typeof TABLE_VIEWS)[number],
    filters?: z.infer<typeof filtersSchema> & {
      sorting?: SortingState;
      pagination?: PaginationState;
    },
  ) => ["all", tableView, filters],
  id: (id: string) => [id],
  countries: null,
});

export const queryKeys = mergeQueryKeys(
  authKeys,
  userKeys,
  geometriesKeys,
  projectKeys,
);
