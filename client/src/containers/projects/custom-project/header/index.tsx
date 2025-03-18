import { FC, useCallback } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CustomProject as CustomProjectEntity } from "@shared/entities/custom-project.entity";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { LayoutListIcon } from "lucide-react";
import { Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";

import { client } from "@/lib/query-client";
import { cn, getAuthHeader } from "@/lib/utils";

import { DEFAULT_CUSTOM_PROJECTS_QUERY_KEY } from "@/app/my-projects/url-store";
import { projectsUIState } from "@/app/projects/store";

import AuthDialog from "@/containers/auth/dialog";
import CustomProjectParameters from "@/containers/projects/custom-project/header/parameters";
import { customProjectIdAtom } from "@/containers/projects/custom-project/store";
import Topbar from "@/containers/topbar";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";

interface CustomProjectHeaderProps {
  data: InstanceType<typeof CustomProjectEntity>;
}
const CustomProjectHeader: FC<CustomProjectHeaderProps> = ({ data }) => {
  const [{ projectSummaryOpen }, setProjectSummaryOpen] =
    useAtom(projectsUIState);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [projectId, setProjectId] = useAtom(customProjectIdAtom);
  const pathname = usePathname();

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
          // update the url without redirecting
          // TODO: should also implement a clean way of removing the query cache
          const id = body.data.id;
          window.history.replaceState(null, "", `/projects/${id}`);
          toast({ description: "Project updated successfully." });
          setProjectId(id);
          await queryClient.invalidateQueries({
            queryKey: DEFAULT_CUSTOM_PROJECTS_QUERY_KEY,
          });
        }

        if (status !== 201 && body?.errors) {
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
    [session, data, toast, queryClient, setProjectId],
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

  if (projectId || !pathname.includes("/projects/preview")) {
    ButtonComponent = (
      <Button asChild>
        <Link href="/my-projects">My custom projects</Link>
      </Button>
    );
  }

  return (
    <Topbar title={data.projectName} className="gap-4">
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
        <CustomProjectParameters
          className="flex-1 justify-end"
          hasOpenBreakEvenPrice={
            data.output?.breakevenPriceComputationOutput !== null
          }
        />
        {ButtonComponent}
      </div>
    </Topbar>
  );
};

export default CustomProjectHeader;
