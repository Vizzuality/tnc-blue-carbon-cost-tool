"use client";

import { useRef } from "react";

import Link from "next/link";

import { useSetAtom } from "jotai";
import { DownloadIcon } from "lucide-react";

import { useScrollSpy } from "@/hooks/use-scroll-spy";

import { METHODOLOGY_SECTIONS } from "@/containers/methodology/sections";
import MethodologySidebar from "@/containers/methodology/sidebar";
import { methodologyStepAtom } from "@/containers/methodology/store";
import { getSidebarNavItemAriaId } from "@/containers/sidebar/sidebar-navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Methodology() {
  const ref = useRef<HTMLDivElement>(null);
  const setMethodologyStep = useSetAtom(methodologyStepAtom);
  useScrollSpy({
    id: "methodology-sections-container",
    containerRef: ref,
    setCurrentStep: setMethodologyStep,
    options: {
      threshold: 0.1,
      rootMargin: "0% 0% -70% 0%",
    },
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
      <div className="relative grid h-full grid-cols-[317px_1fr] overflow-hidden">
        <MethodologySidebar
          navItems={METHODOLOGY_SECTIONS.map(({ id, title, href }) => ({
            id,
            label: title,
            href,
          }))}
        />
        <ScrollArea ref={ref} className="px-8" showGradient>
          <div
            id="methodology-sections-container"
            className="space-y-10 pb-80 pt-10"
          >
            {METHODOLOGY_SECTIONS.map(
              ({ id, title, description, Component }) => (
                <section
                  key={id}
                  id={id}
                  aria-labelledby={getSidebarNavItemAriaId(id)}
                >
                  <Card
                    variant="secondary"
                    className="border-none p-0 shadow-none"
                  >
                    <CardHeader className="mb-6 space-y-4 px-16">
                      <CardTitle className="text-2xl font-normal">
                        {title}
                      </CardTitle>
                      <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="spacey-y-6">
                      {Component}
                    </CardContent>
                  </Card>
                </section>
              ),
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
