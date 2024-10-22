import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { ParsedDBEntities } from '@api/modules/import/services/entity.preprocessor';

import { BaseData } from '@shared/entities/base-data.entity';

@Injectable()
export class BaseDataRepository extends Repository<BaseData> {
  // private fieldMappingCostInput = {
  //   projectSizeHa: COST_INPUT_TYPE.PROJECT_SIZE_HA,
  //   feasibilityAnalysis: COST_INPUT_TYPE.FEASIBILITY_ANALYSIS,
  //   conservationPlanningAndAdmin:
  //     COST_INPUT_TYPE.CONSERVATION_PLANNING_AND_ADMIN,
  // };
  //
  // private fieldMappingCarbonInput = {
  //   ecosystemExtent: CARBON_INPUT_TYPE.ECOSYSTEM_EXTENT,
  //   ecosystemLoss: CARBON_INPUT_TYPE.ECOSYSTEM_LOSS,
  //   restorableLand: CARBON_INPUT_TYPE.RESTORABLE_LAND,
  // };

  constructor(private datasource: DataSource) {
    super(BaseData, datasource.createEntityManager());
  }

  // TODO: Countries are not duplicated but cost and base data are. Check this

  async insertData(data: ParsedDBEntities): Promise<any> {
    //   return await this.datasource.transaction(async (manager) => {
    //     const countryRepo = manager.getRepository(Country);
    //     const baseDataRepo = manager.getRepository(BaseData);
    //     await countryRepo.save(data.countries);
    //     const baseData = await baseDataRepo.save(data.baseData);
    //
    //     return this.updateInputs(manager, baseData);
    //   });
    // }
    //
    // async updateInputs(manager: EntityManager, data: BaseData[]) {
    //   const costInputs: CostInput[] = [];
    //   const carbonInputs: CarbonInputEntity[] = [];
    //   for (const baseData of data) {
    //     const { countryCode, ecosystem, activity } = baseData;
    //     for (const field in baseData) {
    //       const value = baseData[field];
    //       const costInputType = this.fieldMappingCostInput[field];
    //       const carbonInputType = this.fieldMappingCarbonInput[field];
    //       if (value) {
    //         if (costInputType) {
    //           const costInput = new CostInput();
    //           costInput.countryCode = countryCode;
    //           costInput.ecosystem = ecosystem;
    //           costInput.activity = activity;
    //           costInput.type = costInputType;
    //           costInput.value = value;
    //           costInputs.push(costInput);
    //         }
    //         if (carbonInputType) {
    //           const carbonInput = new CarbonInputEntity();
    //           carbonInput.countryCode = countryCode;
    //           carbonInput.ecosystem = ecosystem;
    //           carbonInput.activity = activity;
    //           carbonInput.type = carbonInputType;
    //           carbonInput.value = value;
    //           carbonInputs.push(carbonInput);
    //         }
    //       }
    //     }
    //   }
    //   const costInputRepo = manager.getRepository(CostInput);
    //   const carbonInputRepo = manager.getRepository(CarbonInputEntity);
    //   await costInputRepo.save(costInputs);
    //   await carbonInputRepo.save(carbonInputs);
    // }
  }
}
