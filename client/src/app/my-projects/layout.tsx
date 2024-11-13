"use client";

import { PropsWithChildren } from "react";

import { MapProvider } from "react-map-gl";

import { LayoutGroup } from "framer-motion";

export default function MyProjectsLayout({ children }: PropsWithChildren) {
  return (
    <MapProvider>
      <main className="flex h-dvh flex-1 overflow-hidden">
        <LayoutGroup>{children}</LayoutGroup>
      </main>
    </MapProvider>
  );
}
