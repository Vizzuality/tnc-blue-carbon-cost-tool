"use client";

import { useSetAtom } from "jotai";

import { projectsUIState } from "@/app/(projects)/store";

import { Button } from "@/components/ui/button";

export default function ProjectsHeader() {
  const setFiltersOpen = useSetAtom(projectsUIState);

  return (
    <header className="flex w-full justify-center">
      <Button
        onClick={() => {
          setFiltersOpen((prev) => ({
            ...prev,
            filtersOpen: !prev.filtersOpen,
          }));
        }}
      >
        toggle filters
      </Button>
    </header>
  );
}
