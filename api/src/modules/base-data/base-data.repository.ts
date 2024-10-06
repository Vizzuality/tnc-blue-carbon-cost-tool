import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Country } from '@shared/entities/countries/country.entity';
import { BaseData } from '@api/modules/base-data/base-data.entity';
import { ParsedDBEntities } from '@api/modules/import/services/entity.preprocessor';
import { ProjectSize } from '@api/modules/base-data/project-size.entity';

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
      const projectSizeRepo = manager.getRepository(ProjectSize);
      await countryRepo.insert(data.countries);
      await baseDataRepo.insert(data.baseData);

      const result = await baseDataRepo.find({
        where: { projectSizeHa: Not(IsNull()) },
      });
      // Prepare a Map to accumulate updates per country_code
      const updatesMap = new Map<string, any>();

      result.forEach((record) => {
        const columnToUpdate = getProjectSizeColumn(
          record.ecosystem,
          record.activity,
        );
        const countryCode = record.countryCode;

        if (!updatesMap.has(countryCode)) {
          updatesMap.set(countryCode, { country_code: countryCode });
        }
        const updateObj = updatesMap.get(countryCode);
        updateObj[columnToUpdate] = record.projectSizeHa;
      });

      // Convert the updatesMap to an array
      const updates = Array.from(updatesMap.values());
      await projectSizeRepo.upsert(updates, ['country_code']);
    });
  }
}

function getProjectSizeColumn(ecosystem: string, activity: string): string {
  if (ecosystem === 'Mangrove' && activity === 'Restoration') {
    return 'mangrove_restored_area';
  } else if (ecosystem === 'Mangrove' && activity === 'Conservation') {
    return 'mangrove_conserved_area';
  } else if (ecosystem === 'Seagrass' && activity === 'Restoration') {
    return 'seagrass_restored_area';
  } else if (ecosystem === 'Seagrass' && activity === 'Conservation') {
    return 'seagrass_conserved_area';
  } else if (ecosystem === 'Salt marsh' && activity === 'Restoration') {
    return 'salt_marsh_restored_area';
  } else if (ecosystem === 'Salt marsh' && activity === 'Conservation') {
    return 'salt_marsh_conserved_area';
  }
  throw new Error('Invalid combination of ecosystem and activity');
}
