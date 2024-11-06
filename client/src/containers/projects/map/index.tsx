import { ComponentProps, useState } from "react";

import { LayersIcon } from "lucide-react";

import Controls from "@/containers/projects/map/controls";
import ZoomControl from "@/containers/projects/map/controls/zoom";
import ProjectsLayer from "@/containers/projects/map/layers/projects";
import { MATRIX_COLORS } from "@/containers/projects/map/layers/projects/utils";
import MatrixLegend from "@/containers/projects/map/legend/types/matrix";

import Map from "@/components/map";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ProjectsMap() {
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const matrixItems: ComponentProps<typeof MatrixLegend>["intersections"] =
    Object.keys(MATRIX_COLORS).map((key, index) => ({
      color: key,
      id: index,
    }));

  return (
    <div className="h-full overflow-hidden rounded-t-2xl">
      <Map>
        <Controls>
          <ZoomControl />
        </Controls>
        <Controls className="bottom-8 top-auto">
          <Popover open={isLegendOpen} onOpenChange={setIsLegendOpen}>
            <PopoverTrigger asChild>
              <Button
                aria-label="Toggle legend"
                type="button"
                size="icon"
                variant="outline"
              >
                <LayersIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="left"
              align="end"
              onInteractOutside={(e: Event) => {
                e.preventDefault();
              }}
            >
              <MatrixLegend intersections={matrixItems} />
            </PopoverContent>
          </Popover>
        </Controls>

        <ProjectsLayer />
      </Map>
    </div>
  );
}
