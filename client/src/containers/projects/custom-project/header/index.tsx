import { FC } from "react";

import { useAtom } from "jotai";
import { LayoutListIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";

import { projectsUIState } from "@/app/projects/store";

import AuthDialog from "@/containers/auth/dialog";
import CustomProjectParameters from "@/containers/projects/custom-project/header/parameters";
import Topbar from "@/containers/topbar";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";

const CustomProjectHeader: FC = () => {
  const [{ projectSummaryOpen }, setProjectSummaryOpen] =
    useAtom(projectsUIState);
  const { data: session } = useSession();
  const { toast } = useToast();
  const handleSaveButtonClick = () => {
    // TODO: Add API call when available
    toast({ description: "Project updated successfully." });
  };

  return (
    <Topbar title="Custom project - v01" className="gap-4">
      <div className="flex flex-1 justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setProjectSummaryOpen((prev) => ({
              ...prev,
              projectSummaryOpen: !prev.projectSummaryOpen,
            }));
          }}
        >
          <LayoutListIcon className="h-4 w-4" />
          <span className={cn({ hidden: projectSummaryOpen })}>
            Project summary
          </span>
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
  );
};

export default CustomProjectHeader;
