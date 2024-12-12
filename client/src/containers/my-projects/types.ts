import { CustomProject as CustomProjectEntity } from "@shared/entities/custom-project.entity";
import { ColumnDef } from "@tanstack/react-table";

export type CustomProject = Partial<CustomProjectEntity>;

export type CustomColumn = ColumnDef<CustomProject, keyof CustomProject> & {
  className?: string;
};
