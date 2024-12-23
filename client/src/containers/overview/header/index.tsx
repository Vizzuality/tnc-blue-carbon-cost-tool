"use client";

import { useSetAtom } from "jotai";
import isEqual from "lodash.isequal";
import { Settings2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

import { projectsUIState } from "@/app/(overview)/store";
import { useProjectOverviewFilters } from "@/app/(overview)/url-store";
import { INITIAL_FILTERS_STATE } from "@/app/(overview)/url-store";

import ParametersProjects from "@/containers/overview/header/parameters";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function ProjectsHeader() {
  const setFiltersOpen = useSetAtom(projectsUIState);
  const [filters] = useProjectOverviewFilters();

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const {
    keyword,
    priceType,
    projectSizeFilter,
    costRangeSelector,
    ...sideFilters
  } = filters;
  const {
    keyword: initialKeyword,
    priceType: initialPriceType,
    projectSizeFilter: initialProjectSizeFilter,
    costRangeSelector: initialCostRangeSelector,
    ...initialSideFilters
  } = INITIAL_FILTERS_STATE;
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const filtersEqual = isEqual(sideFilters, initialSideFilters);

  return (
    <header className="flex w-full items-center justify-between py-3">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-2xl font-medium">Projects Overview</h2>
        </div>
        <Button
          type="button"
          onClick={() => {
            setFiltersOpen((prev) => ({
              ...prev,
              filtersOpen: !prev.filtersOpen,
            }));
          }}
          className={cn({
            relative: !filtersEqual,
          })}
        >
          <>
            <Settings2Icon className="h-4 w-4" />
            <span>Filters</span>
            {!filtersEqual && (
              <span className="absolute right-0 top-0 h-3 w-3 rounded-full border border-border bg-foreground" />
            )}
          </>
        </Button>
      </div>
      <ParametersProjects />
    </header>
  );
}
