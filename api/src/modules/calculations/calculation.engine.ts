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
  baseSize: BaseSize;
  baseIncrease: BaseIncrease;
};

@Injectable()
export class CalculationEngine {
  constructor(private readonly dataSource: DataSource) {}
}
