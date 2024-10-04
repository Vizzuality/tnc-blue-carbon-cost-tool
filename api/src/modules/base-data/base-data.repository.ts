import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Country } from '@shared/entities/countries/country.entity';
import { BaseData } from '@api/modules/base-data/base-data.entity';
import { ParsedDBEntities } from '@api/modules/import/services/entity.preprocessor';

@Injectable()
export class BaseDataRepository extends Repository<BaseData> {
  constructor(private datasource: DataSource) {
    super(BaseData, datasource.createEntityManager());
  }

  /**
   * @description Insert data into the database and performs an upsert if the data already exists
   */
  async insertData(data: BaseData[]): Promise<any> {
    return (
      this.createQueryBuilder()
        .insert()
        .into(BaseData)
        .useTransaction(true)
        .values(data)
        // TODO: define what combination of columns might determine if its an update or a new record
        //     an option would be to use the index of the excel, but this might be a problematic approach
        //    also, take in consideration concurrency: update this table while other resources are reading from it
        //     maybe, using a transaction is enough and there is no need for optimistic persimitic locking
        //.orUpdate(this.columns)
        .execute()
    );
  }

  async insertData2(data: ParsedDBEntities): Promise<any> {
    return await this.datasource.transaction(async (manager) => {
      const countryRepo = manager.getRepository(Country);
      const baseDataRepo = manager.getRepository(BaseData);
      await countryRepo.insert(data.countries);
      await baseDataRepo.insert(data.baseData);
    });
  }
}
