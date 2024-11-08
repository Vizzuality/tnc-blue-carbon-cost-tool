import { Body, Controller, HttpStatus } from '@nestjs/common';
import { CountriesService } from '@api/modules/countries/countries.service';
import { DataSource } from 'typeorm';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { ControllerResponse } from '@api/types/controller-response.type';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';
import { CustomProjectsService } from '@api/modules/custom-projects/custom-projects.service';
import { CreateCustomProjectDto } from '@shared/dtos/custom-projects/create-custom-project.dto';

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

  @TsRestHandler(customProjectContract.createCustomProject)
  async create(
    @Body()
    dto: CreateCustomProjectDto,
  ): Promise<ControllerResponse> {
    return tsRestHandler(
      customProjectContract.createCustomProject,
      async ({ body }) => {
        const customProject = await this.customProjects.create(dto);
        return {
          status: 201,
          body: { data: customProject },
        };
      },
    );
  }
  // @TsRestHandler(customProjectContract.createConservationCustomProject)
  // async createConservationProject(): Promise<ControllerResponse> {
  //   return tsRestHandler(
  //     customProjectContract.createConservationCustomProject,
  //     async ({ body }) => {
  //       const customProject = await this.customProjects.create(body);
  //       return {
  //         status: 201,
  //         body: { data: customProject },
  //       };
  //     },
  //   );
  // }
}
