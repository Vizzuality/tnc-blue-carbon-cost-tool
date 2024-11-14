import { ComponentProps, useState } from "react";

import { useSetAtom } from "jotai";
import { LayersIcon } from "lucide-react";

import { popupAtom } from "@/app/(overview)/store";

import Controls from "@/containers/overview/map/controls";
import ZoomControl from "@/containers/overview/map/controls/zoom";
import ProjectsLayer, {
  LAYER_ID as COST_ABATEMENT_LAYER_ID,
} from "@/containers/overview/map/layers/projects";
import { MATRIX_COLORS } from "@/containers/overview/map/layers/projects/utils";
import MatrixLegend from "@/containers/overview/map/legend/types/matrix";
import CostAbatementPopup from "@/containers/overview/map/popup";

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

  const setPopup = useSetAtom(popupAtom);

  return (
    <div className="h-full overflow-hidden rounded-t-2xl">
      <Map
        minZoom={0}
        maxZoom={10}
        interactiveLayerIds={[COST_ABATEMENT_LAYER_ID]}
        onClick={(e) => {
          setPopup({
            lngLat: e.lngLat,
            features: e.features,
          });
        }}
      >
        <ProjectsLayer />

        <CostAbatementPopup />

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
      </Map>
    </div>
  );
}
