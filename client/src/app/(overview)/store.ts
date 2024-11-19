import { MapMouseEvent } from "react-map-gl";

import { atom } from "jotai";

export const projectsUIState = atom<{
  filtersOpen: boolean;
  projectSummaryOpen: boolean;
}>({
  filtersOpen: false,
  projectSummaryOpen: false,
});

export const popupAtom = atom<{
  lngLat: MapMouseEvent["lngLat"];
  features: MapMouseEvent["features"];
} | null>(null);

export const projectDetailsAtom = atom<{
  isOpen: boolean;
  projectName: string;
}>({
  isOpen: false,
  projectName: "",
});
