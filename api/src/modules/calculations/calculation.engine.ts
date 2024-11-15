import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { Country } from '@shared/entities/country.entity';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { BaseDataView } from '@shared/entities/base-data.view';
import { BaseSize } from '@shared/entities/base-size.entity';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import { GetDefaultCostInputsDto } from '@shared/dtos/custom-projects/get-default-cost-inputs.dto';
import { CostInputs } from '@api/modules/custom-projects/dto/project-cost-inputs.dto';

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
  ): Promise<CostInputs> {
    const { countryCode, activity, ecosystem } = dto;
    // The coming CostInput has a implementation labor property which does not exist in the BaseDataView entity, so we use a partial type to avoid the error
    const costInputs: Partial<CostInputs> = await this.dataSource
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
          'implementationLaborPlanting',
          'implementationLaborHydrology',
        ],
      });
    if (!costInputs) {
      throw new NotFoundException(
        `Could not find default Cost Inputs for country ${countryCode}, activity ${activity} and ecosystem ${ecosystem}`,
      );
    }
    return costInputs as CostInputs;
  }
}
