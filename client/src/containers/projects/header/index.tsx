"use client";

import { useSetAtom } from "jotai";
import { PlusIcon } from "lucide-react";

import { projectsUIState } from "@/app/(projects)/store";

import ParametersProjects from "@/containers/projects/header/parameters";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function ProjectsHeader() {
  const setFiltersOpen = useSetAtom(projectsUIState);

  return (
    <header className="flex w-full items-center justify-between py-3">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-2xl font-semibold">Overview</h2>
        </div>
        <Button
          className="flex items-center space-x-2"
          onClick={() => {
            setFiltersOpen((prev) => ({
              ...prev,
              filtersOpen: !prev.filtersOpen,
            }));
          }}
        >
          <>
            <PlusIcon />
            <span>Filters</span>
          </>
        </Button>
      </div>
      <ParametersProjects />
    </header>
  );
}
