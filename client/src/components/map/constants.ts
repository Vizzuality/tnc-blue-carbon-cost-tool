import type { ViewState } from "react-map-gl";

export const DEFAULT_VIEW_STATE: Partial<ViewState> = {
  zoom: 2,
  latitude: 0,
  longitude: 0,
};

export const MAPBOX_STYLE = "mapbox://styles/mapbox/standard-satellite";
