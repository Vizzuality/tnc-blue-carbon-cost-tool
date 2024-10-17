import { useAtom } from "jotai/index";
import { ExpandIcon, ShrinkIcon } from "lucide-react";

import { projectsUIState } from "@/app/(projects)/store";

import { Button } from "@/components/ui/button";

export default function ProjectsTable() {
  const [{ tableExpanded }, setUIState] = useAtom(projectsUIState);

  return (
    <div className="bg-amber-400 text-center">
      <Button
        onClick={() => {
          setUIState((prev) => ({
            ...prev,
            tableExpanded: !prev.tableExpanded,
            mapExpanded: false,
          }));
        }}
        variant="outline"
      >
        {tableExpanded ? <ShrinkIcon /> : <ExpandIcon />}
      </Button>
      <span>Table</span>
    </div>
  );
}
