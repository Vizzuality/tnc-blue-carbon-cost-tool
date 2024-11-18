import { Repository } from 'typeorm';
import { BaseDataView } from '@shared/entities/base-data.view';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { GetDefaultCostInputsDto } from '@shared/dtos/custom-projects/get-default-cost-inputs.dto';
import { CostInputs } from '@api/modules/custom-projects/dto/project-cost-inputs.dto';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { BaseSize } from '@shared/entities/base-size.entity';
import { BaseIncrease } from '@shared/entities/base-increase.entity';

export type CarbonInputs = {
  ecosystemLossRate: BaseDataView['ecosystemLossRate'];
  tier1EmissionFactor: BaseDataView['tier1EmissionFactor'];
  emissionFactorAgb: BaseDataView['emissionFactorAgb'];
  emissionFactorSoc: BaseDataView['emissionFactorSoc'];
};

@Injectable()
export class DataRepository extends Repository<BaseDataView> {
  constructor(
    @InjectRepository(BaseDataView) private repo: Repository<BaseDataView>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async getDataForCalculation(dto: {
    countryCode: string;
    ecosystem: ECOSYSTEM;
    activity: ACTIVITY;
  }) {
    const { countryCode, ecosystem, activity } = dto;
    const defaultCarbonInputs = await this.getDefaultCarbonInputs({
      countryCode,
      ecosystem,
      activity,
    });
    const { baseSize, baseIncrease } = await this.getBaseIncreaseAndSize({
      ecosystem,
      activity,
    });

    return {
      defaultCarbonInputs,
      baseSize,
      baseIncrease,
    };
  }

  async getDefaultCarbonInputs(dto: {
    countryCode: string;
    ecosystem: ECOSYSTEM;
    activity: ACTIVITY;
  }): Promise<CarbonInputs> {
    const { countryCode, ecosystem, activity } = dto;
    const defaultCarbonInputs = await this.findOne({
      where: { countryCode, activity, ecosystem },
      select: [
        'ecosystemLossRate',
        'tier1EmissionFactor',
        'emissionFactorAgb',
        'emissionFactorSoc',
      ],
    });

    if (!defaultCarbonInputs) {
      throw new NotFoundException('Could not retrieve default carbon inputs');
    }
    return defaultCarbonInputs;
  }

  async getDefaultCostInputs(
    dto: GetDefaultCostInputsDto,
  ): Promise<CostInputs> {
    const { countryCode, activity, ecosystem } = dto;
    // The coming CostInput has a implementation labor property which does not exist in the BaseDataView entity, so we use a partial type to avoid the error
    const costInputs: Partial<CostInputs> = await this.findOne({
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
        'otherCommunityCashFlow',
      ],
    });
    if (!costInputs) {
      throw new NotFoundException(
        `Could not find default Cost Inputs for country ${countryCode}, activity ${activity} and ecosystem ${ecosystem}`,
      );
    }
    return costInputs as CostInputs;
  }

  async getBaseIncreaseAndSize(params: {
    ecosystem: ECOSYSTEM;
    activity: ACTIVITY;
  }): Promise<{ baseSize: BaseSize; baseIncrease: BaseIncrease }> {
    const { ecosystem, activity } = params;
    const baseSize = await this.repo.manager.getRepository(BaseSize).findOne({
      where: { ecosystem, activity },
    });
    const baseIncrease = await this.repo.manager
      .getRepository(BaseIncrease)
      .findOne({ where: { ecosystem } });

    if (!baseSize || !baseIncrease) {
      throw new NotFoundException(
        `Could not find base size or base increase for ecosystem ${ecosystem} and activity ${activity}`,
      );
    }

    return { baseSize, baseIncrease };
  }

  async getDefaultModelAssumptions() {
    return this.repo.manager.getRepository(ModelAssumptions).find();
  }
}
