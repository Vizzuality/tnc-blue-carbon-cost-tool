import { Body, Controller, HttpStatus, ValidationPipe } from '@nestjs/common';
import { CountriesService } from '@api/modules/countries/countries.service';
import { DataSource } from 'typeorm';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { ControllerResponse } from '@api/types/controller-response.type';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';
import { CustomProjectsService } from '@api/modules/custom-projects/custom-projects.service';
import { CreateCustomProjectDto } from '@api/modules/custom-projects/dto/create-custom-project-dto';

@Controller()
export class CustomProjectsController {
  constructor(
    private readonly countries: CountriesService,
    public readonly dataSource: DataSource,
    private readonly customProjects: CustomProjectsService,
  ) {}

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
      async () => {
        const data = await this.dataSource
          .getRepository(ModelAssumptions)
          .find();
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
      async ({ body }) => {
        const customProject = await this.customProjects.create(dto as any);
        return {
          status: 201,
          body: { data: customProject },
        };
      },
    );
  }
}
