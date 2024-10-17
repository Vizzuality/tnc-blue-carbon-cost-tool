"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { ActivityIcon, ChevronRight, ChevronLeft } from "lucide-react";

import { LAYOUT_TRANSITIONS } from "@/app/(projects)/constants";
import { projectsUIState } from "@/app/(projects)/store";

import { MainNavItem } from "@/containers/nav/item";

export default function MainNav() {
  const [{ navOpen }, setUIState] = useAtom(projectsUIState);

  return (
    <motion.nav
      layout="size"
      layoutDependency={navOpen}
      transition={LAYOUT_TRANSITIONS}
      className="pointer-events-auto relative z-10 h-full overflow-hidden"
    >
      <div className="relative z-20 flex h-full flex-col justify-between bg-white px-4 py-6">
        <motion.div
          layout="position"
          className="divide-navy-100 flex flex-col divide-y"
        >
          <div className="flex flex-col items-start pb-3">
            <Link href="/" className="flex flex-col items-center space-y-1">
              <div className="relative flex h-10 w-10 flex-col items-center space-y-1">
                <motion.span
                  initial={"initial"}
                  animate={navOpen ? "animate" : "initial"}
                  variants={{
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                  }}
                  className="absolute -top-1 left-full block translate-x-0.5 text-[7px] font-bold uppercase leading-[8px] opacity-0"
                >
                  Blue Carbon Cost
                </motion.span>
              </div>
            </Link>
          </div>

          <MainNavItem href="/" label="High level projects" index={0}>
            <ActivityIcon />
          </MainNavItem>

          <ul className="space-y-3 py-3">
            <li>
              <MainNavItem
                href="/projects/new"
                label="New custom projects"
                index={1}
              >
                <ActivityIcon />
              </MainNavItem>
            </li>
            <ul>
              <li>
                <MainNavItem
                  href="/projects/custom"
                  label="Custom projects"
                  index={2}
                >
                  <ActivityIcon />
                </MainNavItem>
              </li>
            </ul>
          </ul>
        </motion.div>
        <motion.div
          layout="position"
          className="divide-navy-100 flex flex-col divide-y"
        >
          <ul className="space-y-3 py-3">
            <MainNavItem href="/atlas/login" label="User profile" index={6}>
              <ActivityIcon className="h-5 w-5" />
            </MainNavItem>
          </ul>

          <ul className="space-y-3 py-3">
            <MainNavItem label="Help center" href="/methodology" index={7}>
              <ActivityIcon className="h-5 w-5" />
            </MainNavItem>
          </ul>

          <ul className="space-y-3 py-3">
            <MainNavItem
              label={navOpen ? "Collapse side menu" : "Expand side menu"}
              onClick={() =>
                setUIState((prev) => ({
                  ...prev,
                  navOpen: !prev.navOpen,
                }))
              }
              index={8}
            >
              {!navOpen && <ChevronRight className="h-5 w-5" />}
              {navOpen && <ChevronLeft className="h-5 w-5" />}
            </MainNavItem>
          </ul>
        </motion.div>
      </div>
    </motion.nav>
  );
}
