"use client";

import { PropsWithChildren } from "react";

import { MapProvider } from "react-map-gl";

import { LayoutGroup } from "framer-motion";

export default function BlueCarbonCostLayout({ children }: PropsWithChildren) {
  return (
    <MapProvider>
      <LayoutGroup>{children}</LayoutGroup>
    </MapProvider>
  );
}
