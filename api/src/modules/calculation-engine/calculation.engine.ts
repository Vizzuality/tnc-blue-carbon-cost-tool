import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Assumption } from '@shared/entities/assumptions.entity';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { BaseDataView } from '@shared/entities/base-data.view';

@Injectable()
export class CalculationEngine {
  constructor(private readonly dataSource: DataSource) {}

  async getAssumptions() {
    const assumptions = await this.dataSource.getRepository(Assumption).find();
    return assumptions.map((assumption) => {
      const obj = {};
      obj[assumption.assumptionName] = assumption.value;
      return obj;
    });
  }

  async getBaseData(get: {
    countryCode: string;
    activity: ACTIVITY;
    ecosystem: ECOSYSTEM;
  }) {
    const baseData = await this.dataSource.getRepository(BaseDataView).findOne({
      where: {
        country_code: get.countryCode,
        activity: get.activity,
        ecosystem: get.ecosystem,
      },
    });
    return baseData;
  }
  async calculate(dto?: any) {
    console.log('Calculating...', dto);
    const baseAssumptions = await this.getAssumptions();
    const baseData = await this.getBaseData(dto);
    return baseData;
  }
}
