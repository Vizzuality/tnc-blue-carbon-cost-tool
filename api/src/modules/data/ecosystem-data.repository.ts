import { EcosystemProject } from '@api/modules/data/ecosystem-data.entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EcoSystemDataRepository extends Repository<EcosystemProject> {
  constructor(private datasource: DataSource) {
    super(EcosystemProject, datasource.createEntityManager());
  }

  /**
   * @description Insert data into the database and performs an upsert if the data already exists
   */
  async insertData(data: EcosystemProject[]): Promise<any> {
    return (
      this.createQueryBuilder()
        .insert()
        .into(EcosystemProject)
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
}
