import { Controller, HttpStatus } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { ControllerResponse } from '@api/types/controller-response.type';
import { projectsContract } from '@shared/contracts/projects.contract';
import { ProjectsService } from '@api/modules/projects/projects.service';
import { CountriesService } from '@api/modules/countries/countries.service';
import { CountryWithNoGeometry } from '@shared/entities/country.entity';
import { ProjectMap } from '@shared/dtos/projects/projects-map.dto';

@Controller()
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly countryService: CountriesService,
  ) {}

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
      const projectCountryCodes = await this.projectsService.projectRepository
        .find()
        .then((projects) => projects.map((p) => p.countryCode));
      const [countries] = await this.countryService.findAll({
        filter: { code: projectCountryCodes },
        omitFields: ['geometry'],
        disablePagination: true,
      });

      return {
        body: { data: countries as CountryWithNoGeometry[] },
        status: HttpStatus.OK,
      };
    });
  }

  // @TsRestHandler(projectsContract.getProjectsMap)
  // async getProjectsMap(): ControllerResponse {
  //   return tsRestHandler(projectsContract.getProjectsMap, async () => {
  //     const data = await this.projectsService.projectMaps.getMap();
  //     return { body: null, status: HttpStatus.OK } as any;
  //   });
  // }

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
