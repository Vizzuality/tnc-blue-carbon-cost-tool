"use client";

import { useMap } from "react-map-gl";

import { motion } from "framer-motion";
import { useAtomValue } from "jotai";

import { LAYOUT_TRANSITIONS } from "@/app/(projects)/constants";
import { projectsUIState } from "@/app/(projects)/store";

import ProjectsFilters from "@/containers/projects/filters";
import ProjectsHeader from "@/containers/projects/header";
import ProjectsMap from "@/containers/projects/map";
import ProjectsTable from "@/containers/projects/table-visualization";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useSidebar } from "@/components/ui/sidebar";

const PANEL_MIN_SIZE = 25;

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
      className="mx-3 flex flex-1"
      transition={LAYOUT_TRANSITIONS}
    >
      <motion.aside
        layout
        initial={filtersOpen ? "open" : "closed"}
        animate={filtersOpen ? "open" : "closed"}
        variants={{
          open: {
            width: 450,
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
          >
            <ProjectsMap />
          </ResizablePanel>
          <ResizableHandle withHandle className="my-3" />
          <ResizablePanel
            className="flex flex-1 flex-col"
            minSize={PANEL_MIN_SIZE}
          >
            <ProjectsTable />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </motion.div>
  );
}
