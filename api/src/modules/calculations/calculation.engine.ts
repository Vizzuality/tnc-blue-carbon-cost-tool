import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { Country } from '@shared/entities/country.entity';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { BaseDataView } from '@shared/entities/base-data.view';
import { BaseSize } from '@shared/entities/base-size.entity';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import { DefaultCostInputsDto } from '@shared/dtos/custom-projects/default-cost-inputs.dto';
import { GetDefaultCostInputsDto } from '@shared/dtos/custom-projects/get-default-cost-inputs.dto';

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

  async getBaseData(filter: GetBaseData): Promise<BaseDataForCalculation> {
    return this.dataSource.transaction(async (manager) => {
      const defaultAssumptions = await manager
        .getRepository(ModelAssumptions)
        .find();
      const baseData = await manager.getRepository(BaseDataView).findOne({
        where: {
          countryCode: filter.countryCode,
          ecosystem: filter.ecosystem,
          activity: filter.activity,
        },
      });
      const baseSize = await manager.getRepository(BaseSize).findOne({
        where: { activity: filter.activity, ecosystem: filter.ecosystem },
      });
      const baseIncrease = await manager
        .getRepository(BaseIncrease)
        .findOne({ where: { ecosystem: filter.ecosystem } });
      return {
        defaultAssumptions,
        baseData,
        baseSize,
        baseIncrease,
      };
    });
  }

  async getDefaultCostInputs(
    dto: GetDefaultCostInputsDto,
  ): Promise<DefaultCostInputsDto> {
    const { countryCode, activity, ecosystem } = dto;
    // TODO: In the UI we have "implementation labor", which in the calculations we actually set it as value, but in the base data view we have
    //       this property as implementation_labor_activity_subtype (hydrology etc). Check with science!
    const costInputs: DefaultCostInputsDto = await this.dataSource
      .getRepository(BaseDataView)
      .findOne({
        where: { countryCode, activity, ecosystem },
        select: [
          'feasibilityAnalysis',
          'conservationPlanningAndAdmin',
          'dataCollectionAndFieldCost',
          'communityRepresentation',
          'blueCarbonProjectPlanning',
          'establishingCarbonRights',
          'validation',
          'implementationLaborHybrid',
          'monitoring',
          'maintenance',
          'communityBenefitSharingFund',
          'carbonStandardFees',
          'baselineReassessment',
          'mrv',
          'longTermProjectOperatingCost',
          'financingCost',
        ],
      });
    if (!costInputs) {
      throw new NotFoundException(
        `Could not find default Cost Inputs for country ${countryCode}, activity ${activity} and ecosystem ${ecosystem}`,
      );
    }
    return costInputs;
  }
}
