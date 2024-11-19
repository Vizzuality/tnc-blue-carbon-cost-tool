"use client";
import { FC } from "react";

import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { LayoutListIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import { LAYOUT_TRANSITIONS } from "@/app/(overview)/constants";
import { projectsUIState } from "@/app/(overview)/store";

import AuthDialog from "@/containers/auth/dialog";
import CustomProjectParameters from "@/containers/projects/custom-project/header/parameters";
import ProjectSummary from "@/containers/projects/project-summary";
import Topbar from "@/containers/topbar";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useToast } from "@/components/ui/toast/use-toast";

const CustomProject: FC = () => {
  const [{ projectSummaryOpen }, setFiltersOpen] = useAtom(projectsUIState);
  const { open: navOpen } = useSidebar();
  const { data: session } = useSession();
  const { toast } = useToast();
  const handleSaveButtonClick = () => {
    // TODO: Add API call when available
    toast({ description: "Project updated successfully." });
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
        initial={projectSummaryOpen ? "open" : "closed"}
        animate={projectSummaryOpen ? "open" : "closed"}
        variants={{
          open: {
            width: 460,
          },
          closed: {
            width: 0,
          },
        }}
        transition={LAYOUT_TRANSITIONS}
        className="overflow-hidden"
      >
        <ProjectSummary />
      </motion.aside>
      <div className="mx-3 flex flex-1 flex-col">
        <Topbar title="Custom project - v01" className="gap-4">
          <div className="flex flex-1 justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFiltersOpen((prev) => ({
                  ...prev,
                  projectSummaryOpen: !prev.projectSummaryOpen,
                }));
              }}
            >
              <LayoutListIcon className="h-4 w-4" />
              <span>Project summary</span>
            </Button>
            <CustomProjectParameters />
            {session ? (
              <Button type="button" onClick={handleSaveButtonClick}>
                Save project
              </Button>
            ) : (
              <AuthDialog
                dialogTrigger={<Button type="button">Save project</Button>}
                onSignIn={handleSaveButtonClick}
              />
            )}
          </div>
        </Topbar>
      </div>
    </motion.div>
  );
};

export default CustomProject;
