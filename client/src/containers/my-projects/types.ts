import { ColumnDef } from "@tanstack/react-table";

type ProjectType = "Conservation" | "Restoration"; //todo: make this dynamic

export interface CustomProject {
  id: number;
  projectName: string;
  location: string;
  totalNPVCost: number;
  abatementPotential: number;
  type: ProjectType;
  className?: string;
}

export type CustomColumn = ColumnDef<CustomProject, keyof CustomProject> & {
  className?: string;
};
