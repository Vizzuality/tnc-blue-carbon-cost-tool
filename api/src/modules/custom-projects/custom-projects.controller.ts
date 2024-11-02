import { Controller, Get } from '@nestjs/common';
import { CountriesService } from '@api/modules/countries/countries.service';
import { DataSource } from 'typeorm';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';

@Controller('custom-projects')
export class CustomProjectsController {
  constructor(
    private readonly countries: CountriesService,
    private readonly dataSource: DataSource,
  ) {}

  @Get('available-countries')
  async getAvailableCountriesToCreateACustomProject() {
    const data =
      await this.countries.getAvailableCountriesToCreateACustomProject();
    return { data };
  }

  // TODO: This should go in another controller, probably methodology controller. according to the design
  @Get('/assumptions')
  async getAssumptions() {
    const data = await this.dataSource.getRepository(ModelAssumptions).find();
    return { data };
  }
}
