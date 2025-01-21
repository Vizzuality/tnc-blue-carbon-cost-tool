import {
  createQueryKeys,
  mergeQueryKeys,
} from "@lukemorales/query-key-factory";
import { getProjectsQuerySchema } from "@shared/contracts/projects.contract";
import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from "@shared/entities/activity.enum";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { z } from "zod";

import { filtersSchema } from "@/app/(overview)/constants";

import { TABLE_VIEWS } from "@/containers/overview/table/toolbar/table-selector";

export const authKeys = createQueryKeys("auth", {
  validateToken: (token?: string) => ["validate-token", token],
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
});

export const projectKeys = createQueryKeys("projects", {
  one: (id: string) => [id],
  bounds: (filters: z.infer<typeof getProjectsQuerySchema>) => [filters],
});

export const customProjectKeys = createQueryKeys("customProjects", {
  cached: null,
  all: <TFilters extends z.ZodTypeAny>(
    filters?: z.infer<TFilters> & {
      sorting?: SortingState;
      pagination?: PaginationState;
    },
  ) => ["all", filters],
  countries: null,
  one: (id: string) => [id],
  assumptions: ({
    ecosystem,
    activity,
  }: {
    ecosystem: ECOSYSTEM;
    activity: ACTIVITY;
  }) => [ecosystem, activity],
  defaultCosts: ({
    ecosystem,
    countryCode,
    activity,
    restorationActivity,
  }: {
    ecosystem: ECOSYSTEM;
    countryCode: string;
    activity: ACTIVITY;
    restorationActivity?: RESTORATION_ACTIVITY_SUBTYPE;
  }) => ["defaultCosts", ecosystem, countryCode, activity, restorationActivity],
  defaultActivityTypes: ({
    ecosystem,
    countryCode,
  }: {
    ecosystem: ECOSYSTEM;
    countryCode: string;
  }) => ["defaultActivityTypes", ecosystem, countryCode],
});

export const queryKeys = mergeQueryKeys(
  authKeys,
  userKeys,
  geometriesKeys,
  tableKeys,
  countriesKeys,
  customProjectKeys,
  projectKeys,
);
