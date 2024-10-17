import { ComponentProps } from "react";

import type { ViewState, Map } from "react-map-gl";

import { MapOptions } from "mapbox-gl";

export interface CustomMapProps extends ComponentProps<typeof Map> {
  id?: string;
  /** A function that returns the map instance */
  children?: React.ReactNode;

  /** Custom css class for styling */
  className?: string;

  /** A string that defines the rotation axis */
  constrainedAxis?: "x" | "y";

  /** An object that defines the bounds */
  bounds?: {
    bbox: readonly [number, number, number, number];
    options?: MapOptions["fitBoundsOptions"];
    viewportOptions?: Partial<ViewState>;
  };

  /** A function that exposes the viewport */
  onMapViewStateChange?: (viewstate: Partial<ViewState>) => void;
}
