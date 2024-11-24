import { Repository, SelectQueryBuilder } from 'typeorm';
import { BaseDataView } from '@shared/entities/base-data.view';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from '@shared/entities/activity.enum';
import { GetOverridableCostInputs } from '@shared/dtos/custom-projects/get-overridable-cost-inputs.dto';
import { OverridableCostInputs } from '@api/modules/custom-projects/dto/project-cost-inputs.dto';
import { BaseSize } from '@shared/entities/base-size.entity';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { AssumptionsRepository } from '@api/modules/calculations/assumptions.repository';

/**
 * Additional data that is required to perform calculations, which is not overridable by the user. Better naming and clustering of concepts would be great
 */
export type AdditionalBaseData = {
  ecosystemLossRate: BaseDataView['ecosystemLossRate'];
  tier1EmissionFactor: BaseDataView['tier1EmissionFactor'];
  emissionFactorAgb: BaseDataView['emissionFactorAgb'];
  emissionFactorSoc: BaseDataView['emissionFactorSoc'];
  financingCost: BaseDataView['financingCost'];
  maintenanceDuration: BaseDataView['maintenanceDuration'];
  communityBenefitSharingFund: BaseDataView['communityBenefitSharingFund'];
  otherCommunityCashFlow: BaseDataView['otherCommunityCashFlow'];
};

const COMMON_OVERRIDABLE_COST_INPUTS = [
  'feasibilityAnalysis',
  'conservationPlanningAndAdmin',
  'dataCollectionAndFieldCost',
  'communityRepresentation',
  'blueCarbonProjectPlanning',
  'establishingCarbonRights',
  'validation',
  'monitoring',
  'maintenance',
  'communityBenefitSharingFund',
  'carbonStandardFees',
  'baselineReassessment',
  'mrv',
  'longTermProjectOperatingCost',
  'financingCost',
];

@Injectable()
export class DataRepository extends Repository<BaseDataView> {
  constructor(
    @InjectRepository(BaseDataView) private repo: Repository<BaseDataView>,
    private assumptionsRepository: AssumptionsRepository,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async getDataForCalculation(dto: {
    countryCode: string;
    ecosystem: ECOSYSTEM;
    activity: ACTIVITY;
  }) {
    const { countryCode, ecosystem, activity } = dto;
    const defaultCarbonInputs = await this.getAdditionalBaseData({
      countryCode,
      ecosystem,
      activity,
    });
    const { baseSize, baseIncrease } = await this.getBaseIncreaseAndSize({
      ecosystem,
      activity,
    });
    const assumptions =
      await this.assumptionsRepository.getNonOverridableModelAssumptions();

    return {
      defaultCarbonInputs,
      baseSize,
      baseIncrease,
      assumptions,
    };
  }

  async getAdditionalBaseData(dto: {
    countryCode: string;
    ecosystem: ECOSYSTEM;
    activity: ACTIVITY;
  }): Promise<AdditionalBaseData> {
    const { countryCode, ecosystem, activity } = dto;
    const defaultCarbonInputs = await this.findOne({
      where: { countryCode, activity, ecosystem },
      select: [
        'ecosystemLossRate',
        'tier1EmissionFactor',
        'emissionFactorAgb',
        'emissionFactorSoc',
        'financingCost',
        'maintenanceDuration',
        'communityBenefitSharingFund',
        'otherCommunityCashFlow',
      ],
    });

    if (!defaultCarbonInputs) {
      throw new NotFoundException('Could not retrieve default carbon inputs');
    }
    return defaultCarbonInputs;
  }

  async getOverridableCostInputs(
    dto: GetOverridableCostInputs,
  ): Promise<OverridableCostInputs> {
    const { countryCode, activity, ecosystem } = dto;
    const queryBuilder = this.createQueryBuilder().where({
      countryCode,
      activity,
      ecosystem,
    });

    const selectQueryBuilder = this.buildSelect(queryBuilder, dto);

    const costInputs = await selectQueryBuilder.getRawOne();
    if (!costInputs) {
      throw new NotFoundException(
        `Could not find default Cost Inputs for country ${countryCode}, activity ${activity} and ecosystem ${ecosystem}`,
      );
    }
    return costInputs;
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

  /**
   * As of now, only implementation labor has to be dynamically selected based on the restoration activity, if the activity is Restoration
   * If the activity is Conservation, the implementation labor should be null or 0
   */
  private buildSelect(
    queryBuilder: SelectQueryBuilder<BaseDataView>,
    dto: GetOverridableCostInputs,
  ) {
    let implementationLaborToSelect: string;
    if (dto.activity === ACTIVITY.RESTORATION) {
      switch (dto.restorationActivity) {
        case RESTORATION_ACTIVITY_SUBTYPE.HYBRID:
          implementationLaborToSelect = 'implementationLaborHybrid';
          break;
        case RESTORATION_ACTIVITY_SUBTYPE.PLANTING:
          implementationLaborToSelect = 'implementationLaborPlanting';
          break;
        case RESTORATION_ACTIVITY_SUBTYPE.HYDROLOGY:
          implementationLaborToSelect = 'implementationLaborHydrology';
          break;
      }
      queryBuilder.select(
        queryBuilder.alias + '.' + implementationLaborToSelect,
        'implementationLabor',
      );
    }
    // Set implementation labor to 0 if the activity is Conservation, since there is no implementation labor data for Conservation
    if (dto.activity === ACTIVITY.CONSERVATION) {
      queryBuilder.select('0', 'implementationLabor');
    }
    // Since we are using aliases and selecting columns that are not in the entity, the transformer does not get triggered
    // So we manually parse the values to float
    for (const name of COMMON_OVERRIDABLE_COST_INPUTS) {
      queryBuilder.addSelect(
        queryBuilder.alias + '.' + name + ' :: float',
        name,
      );
    }

    return queryBuilder;
  }
}
