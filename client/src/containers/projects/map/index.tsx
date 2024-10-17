"use client";

import { useAtom } from "jotai";
import { ExpandIcon, ShrinkIcon } from "lucide-react";

import { projectsUIState } from "@/app/(projects)/store";

import { Button } from "@/components/ui/button";

export default function ProjectsMap() {
  const [{ mapExpanded }, setUIState] = useAtom(projectsUIState);

  return (
    <div className="h-full bg-green-400 text-center">
      <span>Map</span>
      <Button
        onClick={() => {
          setUIState((prev) => ({
            ...prev,
            mapExpanded: !prev.mapExpanded,
            tableExpanded: false,
          }));
        }}
        variant="outline"
      >
        {mapExpanded ? <ShrinkIcon /> : <ExpandIcon />}
      </Button>
    </div>
  );
}
