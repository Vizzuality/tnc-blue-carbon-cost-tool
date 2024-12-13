import { FC, useCallback, useState } from "react";

import Link from "next/link";

import { CustomProject as CustomProjectEntity } from "@shared/entities/custom-project.entity";
import { useAtom } from "jotai";
import { LayoutListIcon } from "lucide-react";
import { Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";

import { client } from "@/lib/query-client";
import { cn, getAuthHeader } from "@/lib/utils";

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
  const [saved, setSaved] = useState<boolean>(false);
  const SaveProject = useCallback(
    async (arg: Session | null = session) => {
      try {
        const { status, body } =
          await client.customProjects.saveCustomProject.mutation({
            body: data,
            extraHeaders: {
              ...getAuthHeader(arg?.accessToken as string),
            },
          });

        if (status === 201) {
          toast({ description: "Project updated successfully." });
          setSaved(true);
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
    },
    [session, data, toast],
  );
  const handleOnSignIn = useCallback(async () => {
    // session is undefined when onSignIn callback is called
    const session = await getSession();
    SaveProject(session);
  }, [SaveProject]);
  let ButtonComponent = (
    <AuthDialog
      dialogTrigger={<Button type="button">Save project</Button>}
      onSignIn={handleOnSignIn}
    />
  );

  if (session) {
    ButtonComponent = (
      <Button type="button" onClick={() => SaveProject()}>
        Save project
      </Button>
    );
  }

  if (saved) {
    ButtonComponent = (
      <Button asChild>
        <Link href="/my-projects">My custom projects</Link>
      </Button>
    );
  }

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
        {ButtonComponent}
      </div>
    </Topbar>
  );
};

export default CustomProjectHeader;
