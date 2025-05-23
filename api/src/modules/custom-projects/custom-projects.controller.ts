import {
  Body,
  Controller,
  ForbiddenException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CountriesService } from '@api/modules/countries/countries.service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { ControllerResponse } from '@api/types/controller-response.type';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';
import { CustomProjectsService } from '@api/modules/custom-projects/custom-projects.service';
import { GetUser } from '@api/decorators/get-user.decorator';
import { User } from '@shared/entities/users/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@api/modules/auth/guards/roles.guard';
import { RequiredRoles } from '@api/modules/auth/decorators/roles.decorator';
import { ROLES } from '@shared/entities/users/roles.enum';
import { handleImplementationLabor } from '@api/modules/custom-projects/handle-implementation-labor';
import { RestorationPlanService } from '@api/modules/custom-projects/restoration-plan.service';

@Controller()
export class CustomProjectsController {
  constructor(
    private readonly countries: CountriesService,
    private readonly customProjects: CustomProjectsService,
    private readonly restorationPlanService: RestorationPlanService,
  ) {}

  @TsRestHandler(customProjectContract.getActivityTypesDefaults)
  async getActivityTypeDefaults(): Promise<ControllerResponse> {
    return tsRestHandler(
      customProjectContract.getActivityTypesDefaults,
      async ({ query }) => {
        const data = await this.customProjects.getActivityTypeDefaults(query);
        return { body: { data }, status: HttpStatus.OK };
      },
    );
  }

  @TsRestHandler(customProjectContract.getAvailableCountries)
  async getAvailableCountriesToCreateACustomProject(): Promise<ControllerResponse> {
    return tsRestHandler(
      customProjectContract.getAvailableCountries,
      async () => {
        const data =
          await this.countries.getAvailableCountriesToCreateACustomProject();
        return { body: { data }, status: HttpStatus.OK };
      },
    );
  }

  // TODO: This should go in another controller, probably methodology controller. according to the design
  @TsRestHandler(customProjectContract.getDefaultAssumptions)
  async getAssumptions(): Promise<ControllerResponse> {
    return tsRestHandler(
      customProjectContract.getDefaultAssumptions,
      async ({ query }) => {
        const data: any =
          await this.customProjects.getDefaultAssumptions(query);
        return { body: { data }, status: HttpStatus.OK };
      },
    );
  }

  @TsRestHandler(customProjectContract.getDefaultCostInputs)
  async getCostInputs(): Promise<ControllerResponse> {
    return tsRestHandler(
      customProjectContract.getDefaultCostInputs,
      async ({ query }) => {
        const data = await this.customProjects.getDefaultCostInputs(query);
        return { body: { data }, status: HttpStatus.OK };
      },
    );
  }

  @TsRestHandler(customProjectContract.getRestorationPlan)
  async getRestorationPlan(): Promise<ControllerResponse> {
    return tsRestHandler(
      customProjectContract.getRestorationPlan,
      async ({ query }) => {
        const restorationPlan =
          await this.restorationPlanService.getRestorationPlan(query);
        return { body: { data: restorationPlan }, status: HttpStatus.OK };
      },
    );
  }

  @TsRestHandler(customProjectContract.createCustomProject)
  async create(): Promise<ControllerResponse> {
    return tsRestHandler(
      customProjectContract.createCustomProject,
      async ({ body }) => {
        const dto = handleImplementationLabor(body);
        const customProject = await this.customProjects.create(dto);
        return {
          status: 201,
          body: { data: customProject },
        };
      },
    );
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @RequiredRoles(ROLES.USER, ROLES.ADMIN)
  @TsRestHandler(customProjectContract.saveCustomProject)
  async snapshot(@GetUser() user: User): Promise<ControllerResponse> {
    return tsRestHandler(
      customProjectContract.saveCustomProject,
      async ({ body }) => {
        const id = await this.customProjects.saveCustomProject(body, user);
        return {
          status: 201,
          body: { data: { id } },
        };
      },
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @RequiredRoles(ROLES.USER, ROLES.ADMIN)
  @TsRestHandler(customProjectContract.getCustomProject)
  async getCustomProjectById(
    @GetUser() user: User,
  ): Promise<ControllerResponse> {
    return tsRestHandler(
      customProjectContract.getCustomProject,
      async ({ params: { id }, query }) => {
        const data = await this.customProjects.getById(id, query, { user });
        return { body: { data }, status: HttpStatus.OK };
      },
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @RequiredRoles(ROLES.USER, ROLES.ADMIN)
  @TsRestHandler(customProjectContract.getCustomProjects)
  async getCustomProjects(@GetUser() user: User): Promise<ControllerResponse> {
    return tsRestHandler(
      customProjectContract.getCustomProjects,
      async ({ query }) => {
        try {
          const { data, metadata } = await this.customProjects.findAllPaginated(
            query,
            undefined,
            {
              user,
            },
          );
          return { body: { data, metadata }, status: HttpStatus.OK };
        } catch (e) {
          console.error(e);
        }
      },
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @RequiredRoles(ROLES.USER, ROLES.ADMIN)
  @TsRestHandler(customProjectContract.updateCustomProject)
  async updateCustomProject(
    @GetUser() user: User,
  ): Promise<ControllerResponse> {
    return tsRestHandler(
      customProjectContract.updateCustomProject,
      async ({ params: { id }, body }) => {
        if (
          !(await this.customProjects.areProjectsCreatedByUser(user.id, [id]))
        ) {
          throw new ForbiddenException();
        }
        const dto = handleImplementationLabor(body);
        const recalculatedCustomProject = await this.customProjects.create(dto);
        const updatedEntity = await this.customProjects.update(id, {
          id,
          ...recalculatedCustomProject,
        });
        return {
          status: 200,
          body: { data: updatedEntity },
        };
      },
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @RequiredRoles(ROLES.USER, ROLES.ADMIN)
  @TsRestHandler(customProjectContract.deleteCustomProjects)
  async deleteCustomProjects(
    @GetUser() user: User,
    @Body() body: { ids: string[] },
  ): Promise<any> {
    return tsRestHandler(
      customProjectContract.deleteCustomProjects,
      async () => {
        if (
          !(await this.customProjects.areProjectsCreatedByUser(
            user.id,
            body.ids,
          ))
        ) {
          return {
            status: 401,
            body: null,
          };
        }
        await this.customProjects.removeMany(body.ids);
        return {
          status: 200,
          body: null,
        };
      },
    );
  }
}
