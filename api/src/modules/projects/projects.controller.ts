import { ProjectsScorecardService } from './projects-scorecard.service';
import { Controller, HttpStatus, UseGuards } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { ControllerResponse } from '@api/types/controller-response.type';
import { projectsContract } from '@shared/contracts/projects.contract';
import { ProjectsService } from '@api/modules/projects/projects.service';
import { CountriesService } from '@api/modules/countries/countries.service';
import { CountryWithNoGeometry } from '@shared/entities/country.entity';
import { ProjectsMapRepository } from '@api/modules/projects/projects-map.repository';
import {
  OtherProjectFilters,
  ProjectFilters,
} from '@shared/dtos/projects/projects-map.dto';
import { RequiredRoles } from '@api/modules/auth/decorators/roles.decorator';
import { JwtCookieAuthGuard } from '@api/modules/auth/guards/jwt-cookie-auth.guard';
import { RolesGuard } from '@api/modules/auth/guards/roles.guard';
import { ROLES } from '@shared/entities/users/roles.enum';

@Controller()
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly countryService: CountriesService,
    private readonly projectsScorecardService: ProjectsScorecardService,
    private readonly projectMapRepository: ProjectsMapRepository,
  ) {}

  @TsRestHandler(projectsContract.getProjects)
  async getProjects(): ControllerResponse {
    return tsRestHandler(projectsContract.getProjects, async ({ query }) => {
      const data = query.withMaximums
        ? await this.projectsService.findAllProjectsWithMaximums(query)
        : await this.projectsService.findAllPaginated(query);
      return { body: data, status: HttpStatus.OK };
    });
  }

  @TsRestHandler(projectsContract.getProjectsKeyCosts)
  async getProjectsKeyCosts(): ControllerResponse {
    return tsRestHandler(
      projectsContract.getProjectsKeyCosts,
      async ({ query }) => {
        const data = await this.projectsService.findAllProjectsKeyCosts(query);
        return { body: data, status: HttpStatus.OK };
      },
    );
  }

  @TsRestHandler(projectsContract.getProjectsFiltersBounds)
  async getProjectsFiltersBounds(): ControllerResponse {
    return tsRestHandler(
      projectsContract.getProjectsFiltersBounds,
      async ({ query }) => {
        const data = await this.projectsService.getProjectsFiltersBounds(query);
        return { body: { data }, status: HttpStatus.OK };
      },
    );
  }

  @TsRestHandler(projectsContract.getProjectsScorecard)
  async getProjectsScorecard(): ControllerResponse {
    return tsRestHandler(
      projectsContract.getProjectsScorecard,
      async ({ query }) => {
        const data =
          await this.projectsScorecardService.findAllPaginated(query);
        return { body: data, status: HttpStatus.OK };
      },
    );
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

  @TsRestHandler(projectsContract.getProjectsMap)
  async getProjectsMap(): ControllerResponse {
    return tsRestHandler(projectsContract.getProjectsMap, async ({ query }) => {
      const { filter } = query;
      const otherFilters: OtherProjectFilters = {
        costRange: query.costRange,
        abatementPotentialRange: query.abatementPotentialRange,
        costRangeSelector: query.costRangeSelector,
        partialProjectName: query.partialProjectName,
      };
      const data = await this.projectMapRepository.getProjectsMap(
        filter as unknown as ProjectFilters,
        otherFilters,
      );
      return { body: data, status: HttpStatus.OK } as any;
    });
  }

  /**
   * @description: new endpoint to return country level cost and abatement potential averages
   *               need to remove the first version once validated
   */

  @TsRestHandler(projectsContract.getProjectsMapV2)
  async getProjectsMapV2(): ControllerResponse {
    return tsRestHandler(
      projectsContract.getProjectsMapV2,
      async ({ query }) => {
        // Get filtered project Ids to match table results
        const [projectIds] = await this.projectsService.findAll({
          fields: ['id'],
          ...query,
          disablePagination: true,
        });
        const data = await this.projectMapRepository.getProjectsMapV2(
          projectIds.map((p) => p.id),
          query.costRangeSelector,
        );
        return { body: data, status: HttpStatus.OK } as any;
      },
    );
  }

  @TsRestHandler(projectsContract.getProject)
  async getProject(): ControllerResponse {
    return tsRestHandler(
      projectsContract.getProject,
      async ({ params: { id } }) => {
        const project = await this.projectsScorecardService.getById(id);
        const data =
          this.projectsScorecardService.adaptDbViewToApiView(project);
        return { body: { data }, status: HttpStatus.OK };
      },
    );
  }

  @UseGuards(JwtCookieAuthGuard, RolesGuard)
  @RequiredRoles(ROLES.ADMIN)
  @TsRestHandler(projectsContract.createProject)
  public async createProject(): ControllerResponse {
    return tsRestHandler(projectsContract.createProject, async ({ body }) => {
      const project = await this.projectsService.createProject(body);
      return { body: { data: project }, status: HttpStatus.CREATED };
    });
  }

  @UseGuards(JwtCookieAuthGuard, RolesGuard)
  @RequiredRoles(ROLES.ADMIN)
  @TsRestHandler(projectsContract.updateProject)
  public async updateProject(): ControllerResponse {
    return tsRestHandler(
      projectsContract.updateProject,
      async ({ params, body }) => {
        const project = await this.projectsService.updateProject(
          params.id,
          body,
        );
        return { body: { data: project }, status: HttpStatus.OK };
      },
    );
  }
}
