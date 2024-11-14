import { ProjectType } from "@shared/contracts/projects.contract";
import { ColumnDef } from "@tanstack/react-table";

export type CustomProject = Partial<ProjectType> & {
  type: string;
};

export type CustomColumn = ColumnDef<CustomProject, keyof CustomProject> & {
  className?: string;
};
