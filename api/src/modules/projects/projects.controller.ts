import { Controller, HttpStatus } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { ControllerResponse } from '@api/types/controller-response.type';
import { projectsContract } from '@shared/contracts/projects.contract';
import { ProjectsService } from '@api/modules/projects/projects.service';

@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @TsRestHandler(projectsContract.getProjects)
  async getProjects(): ControllerResponse {
    return tsRestHandler(projectsContract.getProjects, async ({ query }) => {
      const data = await this.projectsService.findAllPaginated(query);
      return { body: data, status: HttpStatus.OK };
    });
  }

  @TsRestHandler(projectsContract.getProjectCountries)
  async getProjectCountries(): ControllerResponse {
    return tsRestHandler(projectsContract.getProjectCountries, async () => {
      const data = await this.projectsService.getProjectCountries();
      return { body: { data }, status: HttpStatus.OK };
    });
  }

  @TsRestHandler(projectsContract.getProject)
  async getProject(): ControllerResponse {
    return tsRestHandler(
      projectsContract.getProject,
      async ({ params: { id }, query }) => {
        const data = await this.projectsService.getById(id, query);
        return { body: { data }, status: HttpStatus.OK };
      },
    );
  }
}
