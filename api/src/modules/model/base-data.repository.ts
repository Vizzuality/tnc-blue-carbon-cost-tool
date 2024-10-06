import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Country } from '@shared/entities/countries/country.entity';

import { ParsedDBEntities } from '@api/modules/import/services/entity.preprocessor';
import { BaseData } from '@api/modules/model/base-data.entity';

@Injectable()
export class BaseDataRepository extends Repository<BaseData> {
  constructor(private datasource: DataSource) {
    super(BaseData, datasource.createEntityManager());
  }

  async insertData(data: ParsedDBEntities): Promise<any> {
    return await this.datasource.transaction(async (manager) => {
      const countryRepo = manager.getRepository(Country);
      const baseDataRepo = manager.getRepository(BaseData);
      await countryRepo.insert(data.countries);
      await baseDataRepo.insert(data.baseData);
    });
  }
}
