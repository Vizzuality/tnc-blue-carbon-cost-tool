"use client";

import { PropsWithChildren } from "react";

import { MapProvider } from "react-map-gl";

import { LayoutGroup } from "framer-motion";

import MainNav from "@/containers/nav";

import { SidebarProvider } from "@/components/ui/sidebar";

export default function BlueCarbonCostLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <MapProvider>
        <main className="flex h-dvh flex-1 overflow-hidden">
          <LayoutGroup>
            <MainNav />
            {children}
          </LayoutGroup>
        </main>
      </MapProvider>
    </SidebarProvider>
  );
}
