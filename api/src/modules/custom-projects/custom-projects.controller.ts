import { Controller, Get, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseDataView } from '@shared/entities/base-data.view';
import { Country } from '@shared/entities/country.entity';
import { CreateCustomProjectDto } from '@api/modules/custom-projects/dto/create-custom-project.dto';

@Controller('custom-projects')
export class CustomProjectsController {
  constructor(private readonly dataSource: DataSource) {}

  // To create a custom project, there are limited countries available for calculations, these should come from the base data view
  // AND probably these countries where we have all values for: Double check
  @Get('/countries')
  async getAvailableCountries() {
    const countriesForCustomProjects = await this.dataSource
      .createQueryBuilder(Country, 'country')
      .select(['country.code', 'country.name'])
      .innerJoin(
        BaseDataView,
        'baseDataView',
        'country.code = baseDataView.country_code',
      )
      .getMany();
    return countriesForCustomProjects;
  }

  @Post('')
  async createCustomProject(dto: CreateCustomProjectDto) {
    return dto;
    // Create a custom project
  }
}
