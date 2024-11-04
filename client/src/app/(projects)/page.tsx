"use client";

import { useMap } from "react-map-gl";

import { motion } from "framer-motion";
import { useAtomValue } from "jotai";

import { cn } from "@/lib/utils";

import { LAYOUT_TRANSITIONS } from "@/app/(projects)/constants";
import { projectsUIState } from "@/app/(projects)/store";

import ProjectsFilters, {
  FILTERS_SIDEBAR_WIDTH,
} from "@/containers/projects/filters";
import ProjectsHeader from "@/containers/projects/header";
import ProjectsMap from "@/containers/projects/map";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useSidebar } from "@/components/ui/sidebar";
import ProjectsTable from "src/containers/projects/table";

const PANEL_MIN_SIZE = 25;
const PANEL_DEFAULT_SIZE = 50;

export default function Projects() {
  const { filtersOpen } = useAtomValue(projectsUIState);
  const { open: navOpen } = useSidebar();
  const { default: map } = useMap();

  const onResizeMapPanel = () => {
    if (!map) return;

    map.resize();
  };

  return (
    <motion.div
      layout
      layoutDependency={navOpen}
      className={cn("flex flex-1", {
        "mx-3": !filtersOpen,
      })}
      transition={LAYOUT_TRANSITIONS}
    >
      <motion.aside
        layout
        initial={filtersOpen ? "open" : "closed"}
        animate={filtersOpen ? "open" : "closed"}
        variants={{
          open: {
            width: FILTERS_SIDEBAR_WIDTH,
          },
          closed: {
            width: 0,
          },
        }}
        transition={LAYOUT_TRANSITIONS}
        className="overflow-hidden"
      >
        <ProjectsFilters />
      </motion.aside>
      <div className="flex flex-1 flex-col">
        <ProjectsHeader />
        <ResizablePanelGroup
          direction="vertical"
          className="grid flex-grow grid-rows-2 gap-3"
        >
          <ResizablePanel
            className="flex flex-1 flex-col"
            minSize={PANEL_MIN_SIZE}
            onResize={onResizeMapPanel}
            defaultSize={PANEL_DEFAULT_SIZE}
          >
            <ProjectsMap />
          </ResizablePanel>
          <ResizableHandle withHandle className="my-3" />
          <ResizablePanel
            className="flex flex-1 flex-col"
            minSize={PANEL_MIN_SIZE}
            defaultSize={PANEL_DEFAULT_SIZE}
          >
            <ProjectsTable />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </motion.div>
  );
}
