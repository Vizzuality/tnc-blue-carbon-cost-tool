import {
  Body,
  Controller,
  HttpStatus,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CountriesService } from '@api/modules/countries/countries.service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { ControllerResponse } from '@api/types/controller-response.type';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';
import { CustomProjectsService } from '@api/modules/custom-projects/custom-projects.service';
import { CreateCustomProjectDto } from '@api/modules/custom-projects/dto/create-custom-project-dto';
import { GetUser } from '@api/decorators/get-user.decorator';
import { User } from '@shared/entities/users/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@api/modules/auth/guards/roles.guard';
import { RequiredRoles } from '@api/modules/auth/decorators/roles.decorator';
import { ROLES } from '@shared/entities/users/roles.enum';

@Controller()
export class CustomProjectsController {
  constructor(
    private readonly countries: CountriesService,
    private readonly customProjects: CustomProjectsService,
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

  @TsRestHandler(customProjectContract.createCustomProject)
  async create(
    @Body(new ValidationPipe({ enableDebugMessages: true, transform: true }))
    dto: CreateCustomProjectDto,
  ): Promise<ControllerResponse> {
    return tsRestHandler(
      customProjectContract.createCustomProject,
      async () => {
        const customProject = await this.customProjects.create(dto as any);
        return {
          status: 201,
          body: { data: customProject },
        };
      },
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @RequiredRoles(ROLES.PARTNER, ROLES.ADMIN)
  @TsRestHandler(customProjectContract.saveCustomProject)
  async snapshot(@GetUser() user: User): Promise<ControllerResponse> {
    return tsRestHandler(
      customProjectContract.saveCustomProject,
      async ({ body }) => {
        await this.customProjects.saveCustomProject(body, user);
        return {
          status: 201,
          body: null,
        };
      },
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @RequiredRoles(ROLES.PARTNER, ROLES.ADMIN)
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
  @RequiredRoles(ROLES.PARTNER, ROLES.ADMIN)
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
}
