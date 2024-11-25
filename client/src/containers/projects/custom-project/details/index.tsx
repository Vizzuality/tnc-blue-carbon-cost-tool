import { FC } from "react";

import { useAtomValue } from "jotai";

import { cn } from "@/lib/utils";

import { projectsUIState } from "@/app/(overview)/store";

import DetailItem from "@/containers/projects/custom-project/details/detail-item";
import mockData from "@/containers/projects/custom-project/mock-data";

import FileEdit from "@/components/icons/file-edit";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ProjectDetails: FC = () => {
  const { projectSummaryOpen } = useAtomValue(projectsUIState);

  return (
    <Card
      className={cn({ "flex-2 space-y-1": true, hidden: projectSummaryOpen })}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Project details</h2>
        <Button type="button" variant="ghost">
          <FileEdit />
          <span>Edit project</span>
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {mockData.details.map((column, index) => (
          <div key={index} className="space-y-3">
            {column.map((detail, index) => (
              <DetailItem key={index} {...detail} />
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProjectDetails;
