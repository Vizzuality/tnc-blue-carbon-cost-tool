import { useCallback, MouseEvent } from "react";

import { useMap, MapRef } from "react-map-gl";

import { Plus, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

const BUTTON_CLASSES = {
  default:
    "flex h-8 w-8 items-center justify-center rounded-full border border-white bg-white text-black shadow-md transition-colors",
  hover: "hover:border-gray-400 active:border-gray-400",
  disabled: "opacity-50 cursor-default",
};

export default function ZoomControl({
  id = "default",
  className,
}: {
  id?: string;
  className?: HTMLDivElement["className"];
}) {
  const { [id]: mapRef } = useMap();

  const zoom = mapRef?.getZoom() as NonNullable<ReturnType<MapRef["getZoom"]>>;
  const minZoom = mapRef?.getMinZoom() as NonNullable<
    ReturnType<MapRef["getMinZoom"]>
  >;
  const maxZoom = mapRef?.getMaxZoom() as NonNullable<
    ReturnType<MapRef["getMaxZoom"]>
  >;

  const increaseZoom = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (!mapRef) return null;

      mapRef.zoomIn();
    },
    [mapRef],
  );

  const decreaseZoom = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (!mapRef) return null;

      mapRef.zoomOut();
    },
    [mapRef],
  );

  return (
    <div className={cn("inline-flex flex-col space-y-2", className)}>
      <button
        className={cn(BUTTON_CLASSES.default, {
          [BUTTON_CLASSES.hover]: zoom < maxZoom,
          [BUTTON_CLASSES.disabled]: zoom >= maxZoom,
        })}
        aria-label="Zoom in"
        type="button"
        disabled={zoom >= maxZoom}
        onClick={increaseZoom}
      >
        <Plus className="h-6 w-6" />
      </button>

      <button
        className={cn(BUTTON_CLASSES.default, {
          [BUTTON_CLASSES.hover]: zoom > minZoom,
          [BUTTON_CLASSES.disabled]: zoom <= minZoom,
        })}
        aria-label="Zoom out"
        type="button"
        disabled={zoom <= minZoom}
        onClick={decreaseZoom}
      >
        <Minus className="h-6 w-6" />
      </button>
    </div>
  );
}
