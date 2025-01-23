"use client";

import { useRef } from "react";

import Link from "next/link";

import { useSetAtom } from "jotai";
import { DownloadIcon } from "lucide-react";

import { useScrollSpy } from "@/hooks/use-scroll-spy";

import MethodologySidebar from "@/containers/methodology/sidebar";
import { methodologyStepAtom } from "@/containers/methodology/store";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const METHODOLOGY_SECTIONS = [
  { id: "introduction", label: "Introduction", href: "#introduction" },
  {
    id: "project-size-assumptions",
    label: "Project size assumptions",
    href: "#project-size-assumptions",
  },
  {
    id: "project-costs-assumptions-and-methodology",
    label: "Project costs – assumptions and methodology",
    href: "#project-costs-assumptions-and-methodology",
  },
  {
    id: "qualitative-scorecard-details-and-sources",
    label: "Qualitative scorecard details and sources",
    href: "#qualitative-scorecard-details-and-sources",
  },
  {
    id: "sources",
    label: "Sources",
    href: "#sources",
  },
];

export default function Methodology() {
  const ref = useRef<HTMLDivElement>(null);
  const setMethodologyStep = useSetAtom(methodologyStepAtom);
  useScrollSpy({
    id: "methodology-sections-container",
    containerRef: ref,
    setCurrentStep: setMethodologyStep,
  });

  return (
    <div className="ml-4 flex h-lvh w-full flex-col">
      <div className="flex h-16 items-center justify-between p-4 pl-0">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-2xl font-medium">Methodology</h2>
        </div>
        <Button asChild>
          <Link href="#">
            <DownloadIcon className="h-4 w-4" />
            <span>Download full methodology</span>
          </Link>
        </Button>
      </div>
      <MethodologySidebar navItems={METHODOLOGY_SECTIONS} />
    </div>
  );
}
