import { useCallback } from "react";

import { useAtom } from "jotai";

import { projectDetailsAtom } from "@/app/(overview)/store";

export function useProjectDetails() {
  const [projectDetails, setProjectDetails] = useAtom(projectDetailsAtom);
  const handleOpenDetails = useCallback(
    (id: string, visibleProjectIds: string[]) =>
      setProjectDetails({
        ...projectDetails,
        isOpen: true,
        id,
        visibleProjectIds,
      }),
    [projectDetails, setProjectDetails],
  );

  return {
    handleOpenDetails,
  };
}
