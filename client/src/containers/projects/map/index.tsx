"use client";

import { ExpandIcon } from "lucide-react";

import Map from "@/components/map";
import { Button } from "@/components/ui/button";

export default function ProjectsMap() {
  const onToggleExpand = () => {};

  return (
    <div className="h-full overflow-hidden rounded-2xl">
      <Map>
        <Button
          onClick={onToggleExpand}
          className="absolute right-2 top-2 z-50"
        >
          <ExpandIcon />
        </Button>
      </Map>
    </div>
  );
}
