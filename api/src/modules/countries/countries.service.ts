import { Injectable } from '@nestjs/common';
import { AppBaseService } from '@api/utils/app-base.service';
import { Country } from '@shared/entities/country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseDataView } from '@shared/entities/base-data.view';

@Injectable()
export class CountriesService extends AppBaseService<
  Country,
  unknown,
  unknown,
  unknown
> {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {
    super(countryRepository, 'country', 'countries');
  }

  async getAvailableCountriesToCreateACustomProject(): Promise<Country[]> {
    return this.countryRepository
      .createQueryBuilder('country')
      .select(['country.code', 'country.name'])
      .innerJoin(
        BaseDataView,
        'baseDataView',
        'baseDataView.country_code = country.code',
      )
      .getMany();
  }
}
