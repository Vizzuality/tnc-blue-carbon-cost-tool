import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseData } from '@shared/entities/base-data.entity';
import { Project } from '@shared/entities/users/projects.entity';
import { Country } from '@shared/entities/country.entity';

@Injectable()
export class ImportRepository {
  constructor(private readonly dataSource: DataSource) {}

  async ingest(importData: { baseData: BaseData[]; projects: Project[] }) {
    return this.dataSource.transaction(async (manager) => {
      // TODO: Workaround as there are N/A country codes in the excel file
      const existingCountries = await manager
        .createQueryBuilder()
        .select('countries.code', 'countryCode')
        .from(Country, 'countries')
        .getRawMany();
      const countryFilteredBaseData: BaseData[] = [];
      existingCountries.forEach(({ countryCode }) => {
        const countryData = importData.baseData.find(
          (data) => data.country.code === countryCode,
        );
        if (countryData) {
          countryFilteredBaseData.push(countryData);
        }
      });
      await manager.save(countryFilteredBaseData);
      await manager.save(importData.projects);
    });
  }
}
