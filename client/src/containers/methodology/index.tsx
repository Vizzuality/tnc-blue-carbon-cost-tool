"use client";

import { useMemo, useRef } from "react";

import { useSetAtom } from "jotai";

import { useScrollSpy } from "@/hooks/use-scroll-spy";

import METHODOLOGY_SECTIONS from "@/containers/methodology/sections";
import MethodologySidebar from "@/containers/methodology/sidebar";
import { methodologyStepAtom } from "@/containers/methodology/store";
import { getSidebarNavItemAriaId } from "@/containers/sidebar/sidebar-navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const navItems = useMemo(() => {
    return METHODOLOGY_SECTIONS.map(({ id, title, href }) => ({
      id,
      label: title,
      href,
    }));
  }, []);

  return (
    <div className="ml-4 flex h-lvh w-full flex-col">
      <div className="flex h-16 items-center justify-between p-4 pl-0">
        <div className="flex items-center">
          <SidebarTrigger />
          <h2 className="text-2xl font-medium">Methodology</h2>
        </div>
      </div>
      <div className="relative grid h-full grid-cols-[317px_1fr] overflow-hidden">
        <MethodologySidebar navItems={navItems} />
        <ScrollArea ref={ref} className="px-8" showGradient>
          <div
            id="methodology-sections-container"
            className="space-y-10 pb-80 pt-10"
          >
            {METHODOLOGY_SECTIONS.map(({ id, title, Content }) => (
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
                    <CardTitle>
                      <h2 className="text-2xl font-normal">{title}</h2>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="spacey-y-6">{Content}</CardContent>
                </Card>
              </section>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
