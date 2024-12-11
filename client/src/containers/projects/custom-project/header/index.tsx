import { FC } from "react";

import { CustomProject as CustomProjectEntity } from "@shared/entities/custom-project.entity";
import { useAtom } from "jotai";
import { LayoutListIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import { client } from "@/lib/query-client";
import { cn } from "@/lib/utils";

import { projectsUIState } from "@/app/projects/store";

import AuthDialog from "@/containers/auth/dialog";
import CustomProjectParameters from "@/containers/projects/custom-project/header/parameters";
import Topbar from "@/containers/topbar";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";

interface CustomProjectHeaderProps {
  data: InstanceType<typeof CustomProjectEntity>;
}
const CustomProjectHeader: FC<CustomProjectHeaderProps> = ({ data }) => {
  const [{ projectSummaryOpen }, setProjectSummaryOpen] =
    useAtom(projectsUIState);
  const { data: session } = useSession();
  const { toast } = useToast();
  const handleSaveButtonClick = async () => {
    try {
      const { status, body } =
        await client.customProjects.saveCustomProject.mutation({
          body: data,
          extraHeaders: {
            authorization: `Bearer ${session?.accessToken as string}`,
          },
        });

      if (status === 201) {
        toast({ description: "Project updated successfully." });
      }

      if (body?.errors) {
        toast({
          variant: "destructive",
          description: body.errors[0].title,
        });
      }
    } catch (e) {
      toast({
        variant: "destructive",
        description: "Something went wrong saving the project",
      });
    }
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
