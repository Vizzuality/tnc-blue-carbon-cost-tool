import { PaginationMeta } from "@shared/dtos/global/api-response.dto";
import { Project } from "@shared/entities/projects.entity";

export class PaginatedProjectsWithMaximums {
  metadata: PaginationMeta;
  data: Partial<Project>[];
  maximums: {
    maxAbatementPotential: number;
    maxTotalCost: number;
  };
}
