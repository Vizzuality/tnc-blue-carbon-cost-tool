"use client";

import { useMap } from "react-map-gl";

import { motion } from "framer-motion";
import { useAtomValue } from "jotai";

import { LAYOUT_TRANSITIONS } from "@/app/(overview)/constants";
import { projectsUIState } from "@/app/(overview)/store";

import ProjectsFilters, {
  FILTERS_SIDEBAR_WIDTH,
} from "@/containers/overview/filters";
import ProjectsHeader from "@/containers/overview/header";
import ProjectsMap from "@/containers/overview/map";
import ProjectsTable from "@/containers/overview/table";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useSidebar } from "@/components/ui/sidebar";

const PANEL_MIN_SIZE = 25;
const PANEL_DEFAULT_SIZE = 50;

export default function Overview() {
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
      className="flex flex-1"
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
      <div className="mx-3 flex flex-1 flex-col">
        <ProjectsHeader />
        <ResizablePanelGroup
          direction="vertical"
          className="grid flex-grow grid-rows-2"
        >
          <ResizablePanel
            className="flex flex-1 flex-col"
            minSize={PANEL_MIN_SIZE}
            onResize={onResizeMapPanel}
            defaultSize={PANEL_DEFAULT_SIZE}
          >
            <ProjectsMap />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            className="mb-4 flex flex-1 flex-col"
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
