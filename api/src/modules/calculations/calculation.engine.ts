import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { Country } from '@shared/entities/country.entity';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { BaseDataView } from '@shared/entities/base-data.view';
import { BaseSize } from '@shared/entities/base-size.entity';
import { BaseIncrease } from '@shared/entities/base-increase.entity';

export type GetBaseData = {
  countryCode: Country['code'];
  ecosystem: ECOSYSTEM;
  activity: ACTIVITY;
};

export type BaseDataForCalculation = {
  defaultAssumptions: ModelAssumptions[];
  baseData: BaseDataView;
  baseSize: BaseSize[];
  baseIncrease: BaseIncrease[];
};

@Injectable()
export class CalculationEngine {
  constructor(private readonly dataSource: DataSource) {}

  async getBaseData(filter: GetBaseData): Promise<BaseDataForCalculation> {
    return this.dataSource.transaction(async (manager) => {
      const defaultAssumptions = await manager
        .getRepository(ModelAssumptions)
        .find();
      const baseData = await manager.getRepository(BaseDataView).findOne({
        where: {
          country_code: filter.countryCode,
          ecosystem: filter.ecosystem,
          activity: filter.activity,
        },
      });
      const baseSize = await manager.getRepository(BaseSize).find();
      const baseIncrease = await manager.getRepository(BaseIncrease).find();
      return {
        defaultAssumptions,
        baseData,
        baseSize,
        baseIncrease,
      };
    });
  }
}
