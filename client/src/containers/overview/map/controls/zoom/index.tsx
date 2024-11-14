import { useCallback, MouseEvent, useEffect, useState } from "react";

import { useMap, MapRef } from "react-map-gl";

import { PlusIcon, MinusIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const BUTTON_CLASSES = "h-8 w-8";
const ICON_CLASSES = "h-6 w-6 text-big-stone-50";

export default function ZoomControl({
  id = "default",
  className,
}: {
  id?: string;
  className?: HTMLDivElement["className"];
}) {
  const { [id]: mapRef } = useMap();

  const initialZoom = mapRef?.getMap().getZoom() as NonNullable<
    ReturnType<MapRef["getZoom"]>
  >;
  const minZoom = mapRef?.getMap().getMinZoom() as NonNullable<
    ReturnType<MapRef["getMinZoom"]>
  >;
  const maxZoom = mapRef?.getMap().getMaxZoom() as NonNullable<
    ReturnType<MapRef["getMaxZoom"]>
  >;

  const [zoomState, setZoomState] =
    useState<ReturnType<MapRef["getZoom"]>>(initialZoom);

  useEffect(() => {
    if (!mapRef) return;

    const onZoomEnd = () => {
      setZoomState(mapRef.getMap().getZoom());
    };

    mapRef?.on("zoomend", onZoomEnd);

    return () => {
      mapRef.off("zoomend", onZoomEnd);
    };
  }, [mapRef]);

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
    <div className={cn("inline-flex flex-col space-y-0.5", className)}>
      <Button
        className={cn(BUTTON_CLASSES, {
          "rounded-b-none rounded-t-full": true,
        })}
        aria-label="Zoom in"
        type="button"
        size="icon"
        variant="outline"
        disabled={zoomState >= maxZoom}
        onClick={increaseZoom}
      >
        <PlusIcon className={ICON_CLASSES} />
      </Button>
      <Button
        className={cn(BUTTON_CLASSES, {
          "rounded-b-full rounded-t-none": true,
        })}
        aria-label="Zoom out"
        type="button"
        size="icon"
        variant="outline"
        disabled={zoomState <= minZoom}
        onClick={decreaseZoom}
      >
        <MinusIcon className={ICON_CLASSES} />
      </Button>
    </div>
  );
}
