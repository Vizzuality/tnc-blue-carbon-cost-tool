import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseData } from '@shared/entities/base-data.entity';
import { Country } from '@shared/entities/country.entity';

@Injectable()
export class BaseDataRepository extends Repository<BaseData> {
  constructor(private datasource: DataSource) {
    super(BaseData, datasource.createEntityManager());
  }

  async saveBaseData(baseData: BaseData[]): Promise<any> {
    // TODO: This is a workaround to filter base data by countries that are present in the DB. THis should be removed once we have proper country data
    const existingCountries = await this.datasource
      .createQueryBuilder()
      .select('countries.code', 'countryCode')
      .from(Country, 'countries')
      .getRawMany();
    const toSave: BaseData[] = [];
    existingCountries.forEach(({ countryCode }) => {
      const countryData = baseData.find(
        (data) => data.country.code === countryCode,
      );
      if (countryData) {
        toSave.push(countryData);
      }
    });

    return this.save(toSave);
  }
}
