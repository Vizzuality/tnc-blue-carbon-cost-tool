"use client";

import { PropsWithChildren } from "react";

import { LayoutGroup } from "framer-motion";

import MainNav from "@/containers/nav";

export default function BlueCarbonCostLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex h-dvh overflow-hidden">
      <LayoutGroup>
        <MainNav />
        {children}
      </LayoutGroup>
    </main>
  );
}
