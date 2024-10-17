"use client";

import { motion } from "framer-motion";
import { useAtomValue } from "jotai";

import { LAYOUT_TRANSITIONS } from "@/app/(projects)/constants";
import { projectsUIState } from "@/app/(projects)/store";

import ProjectsFilters from "@/containers/projects/filters";
import ProjectsHeader from "@/containers/projects/header";
import ProjectsMap from "@/containers/projects/map";
import ProjectsTable from "@/containers/projects/table";

export default function Projects() {
  const { navOpen, filtersOpen, mapExpanded, tableExpanded } =
    useAtomValue(projectsUIState);

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
          <motion.section
            layout
            // initial={mapExpanded ? "expanded" : "collapsed"}
            initial={{
              height: "auto",
            }}
            animate={mapExpanded ? "expanded" : "collapsed"}
            variants={{
              expanded: {
                height: "100%",
              },
              collapsed: {
                height: 0,
              },
            }}
            transition={LAYOUT_TRANSITIONS}
          >
            <ProjectsMap />
          </motion.section>
          <motion.section
            layout
            initial={tableExpanded ? "expanded" : "collapsed"}
            animate={tableExpanded ? "expanded" : "collapsed"}
            variants={{
              expanded: {
                height: "100%",
              },
              collapsed: {
                height: 0,
              },
            }}
            transition={LAYOUT_TRANSITIONS}
          >
            <ProjectsTable />
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
}
