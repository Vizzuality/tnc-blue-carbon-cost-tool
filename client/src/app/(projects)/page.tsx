"use client";

import { motion } from "framer-motion";
import { useAtomValue } from "jotai";

import { LAYOUT_TRANSITIONS } from "@/app/(projects)/constants";
import { projectsUIState } from "@/app/(projects)/store";

import ProjectsFilters from "@/containers/projects/filters";
import ProjectsHeader from "@/containers/projects/header";
import ProjectsMap from "@/containers/projects/map";
import ProjectsTable from "@/containers/projects/table-visualization";

import { useSidebar } from "@/components/ui/sidebar";

export default function Projects() {
  const { filtersOpen } = useAtomValue(projectsUIState);
  const { open: navOpen } = useSidebar();

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
        <div className="grid flex-grow grid-rows-2">
          <section className="flex-1">
            <ProjectsMap />
          </section>
          <section className="flex-1">
            <ProjectsTable />
          </section>
        </div>
      </div>
    </motion.div>
  );
}
