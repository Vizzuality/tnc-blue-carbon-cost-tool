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
import { BaseSize } from '@shared/entities/base-size.entity';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import { AssumptionsRepository } from '@api/modules/calculations/assumptions.repository';
import { GetActivityTypesDefaults } from '@shared/dtos/custom-projects/get-activity-types-defaults.dto';
import {
  ActivityTypesDefaults,
  ConvervationActivityDefaults,
  RestorationActivityDefaults,
} from '@shared/dtos/custom-projects/activity-types-defaults';
import { Country } from '@shared/entities/country.entity';
import { OverridableCostInputsDto } from '@shared/dtos/custom-projects/create-custom-project.dto';

/**
 * Additional data that is required to perform calculations, which is not overridable by the user. Better naming and clustering of concepts would be great
 */
export type AdditionalBaseData = {
  ecosystemExtent: BaseDataView['ecosystemExtent'];
  ecosystemLossRate: BaseDataView['ecosystemLossRate'];
  tier1EmissionFactor: BaseDataView['tier1EmissionFactor'];
  emissionFactorAgb: BaseDataView['emissionFactorAgb'];
  emissionFactorSoc: BaseDataView['emissionFactorSoc'];
  financingCost: BaseDataView['financingCost'];
  maintenanceDuration: BaseDataView['maintenanceDuration'];
  communityBenefitSharingFund: BaseDataView['communityBenefitSharingFund'];
  otherCommunityCashFlow: BaseDataView['otherCommunityCashFlow'];
  tier1SequestrationRate: BaseDataView['tier1SequestrationRate'];
  tier2SequestrationRate: BaseDataView['tier2SequestrationRate'];
  restorableLand: BaseDataView['restorableLand'];
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

  /**
   * There is tech discussion left as to somehow bind projects to custom projects because there are a lot of overlapping concepts
   * We also need to make sure that for creating/computing projects, there is no way to override assumptions and cost inputs (otherwise it would be a custom project)
   * Assuming this, we need to split logic to retrieve data for custom projects and projects
   */
  async getDataToComputeCustomProjects(dto: {
    countryCode: string;
    ecosystem: ECOSYSTEM;
    activity: ACTIVITY;
  }) {
    const { countryCode, ecosystem, activity } = dto;
    const additionalBaseData = await this.getAdditionalBaseData({
      countryCode,
      ecosystem,
      activity,
    });
    const { baseSize, baseIncrease } = await this.getBaseIncreaseAndSize({
      ecosystem,
      activity,
    });
    const additionalAssumptions =
      await this.assumptionsRepository.getNonOverridableModelAssumptions(
        activity,
      );

    const country = await this.manager
      .getRepository(Country)
      .findOne({ where: { code: countryCode } });

    return {
      additionalBaseData,
      baseSize,
      baseIncrease,
      additionalAssumptions,
      country,
    };
  }

  /**
   * To compute a project (either from excel or backoffice in the near future), we need to retrieve all the data that is required to perform calculations
   */
  async getDataToComputeProjects(dto: {
    countryCode: string;
    ecosystem: ECOSYSTEM;
    activity: ACTIVITY;
    restorationActivity?: RESTORATION_ACTIVITY_SUBTYPE;
  }) {
    const { countryCode, ecosystem, activity, restorationActivity } = dto;
    const defaultAssumptions =
      await this.assumptionsRepository.getOverridableModelAssumptions({
        activity,
        ecosystem,
      });
    const defaultCostInputs = await this.getOverridableCostInputs({
      countryCode,
      ecosystem,
      activity,
      restorationActivity,
    });

    const nonOverridableAssumptions =
      await this.assumptionsRepository.getNonOverridableModelAssumptions(
        activity,
      );

    const {
      baseSize,
      baseIncrease,
      additionalBaseData,
      additionalAssumptions,
    } = await this.getDataToComputeCustomProjects({
      countryCode,
      ecosystem,
      activity,
    });
    return {
      defaultAssumptions: defaultAssumptions.concat(nonOverridableAssumptions),
      defaultCostInputs,
      additionalBaseData,
      baseSize,
      baseIncrease,
      additionalAssumptions,
    };
  }

  async getAdditionalBaseData(dto: {
    countryCode: string;
    ecosystem: ECOSYSTEM;
    activity: ACTIVITY;
  }): Promise<AdditionalBaseData> {
    const { countryCode, ecosystem, activity } = dto;
    const additionalBaseData = await this.findOne({
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
        'tier1SequestrationRate',
        'tier2SequestrationRate',
        'restorableLand',
        'ecosystemExtent',
      ],
    });

    if (!additionalBaseData) {
      throw new NotFoundException('Could not retrieve default carbon inputs');
    }
    return additionalBaseData;
  }

  async getActivityTypesDefaults(
    dto: GetActivityTypesDefaults,
  ): Promise<ActivityTypesDefaults> {
    const [conservationDefaults, restorationDefaults] = await Promise.all([
      this.getConservationActivityDefaults(dto),
      this.getRestorationActivityDefaults(dto),
    ]);

    const defaults: ActivityTypesDefaults = {
      [ACTIVITY.CONSERVATION]: conservationDefaults,
      [ACTIVITY.RESTORATION]: restorationDefaults,
    };
    return defaults;
  }

  private async getConservationActivityDefaults(
    dto: GetActivityTypesDefaults,
  ): Promise<ConvervationActivityDefaults> {
    const { countryCode, ecosystem } = dto;

    const result = await this.findOne({
      where: { countryCode, ecosystem, activity: ACTIVITY.CONSERVATION },
      select: [
        'ecosystemLossRate',
        'tier1EmissionFactor',
        'emissionFactorAgb',
        'emissionFactorSoc',
        'ecosystemExtent',
      ],
    });
    if (result === null) return null;

    return {
      ecosystemExtent: result.ecosystemExtent,
      ecosystemLossRate: result.ecosystemLossRate,
      emissionFactor: {
        tier1: result.tier1EmissionFactor,
        tier2: {
          emissionFactorAgb: result.emissionFactorAgb,
          emissionFactorSoc: result.emissionFactorSoc,
        },
      },
    };
  }

  private async getRestorationActivityDefaults(
    dto: GetActivityTypesDefaults,
  ): Promise<RestorationActivityDefaults> {
    const { countryCode, ecosystem } = dto;

    const baseCostAndCarbonInputs = await this.findOneOrFail({
      where: { countryCode, ecosystem, activity: ACTIVITY.RESTORATION },
      select: ['tier1SequestrationRate', 'tier2SequestrationRate'],
    });

    const plantingSuccessRate = await this.assumptionsRepository.findOneOrFail({
      where: { name: 'Planting success rate' },
    });

    if (baseCostAndCarbonInputs === null) return null;

    return {
      sequestrationRate: {
        tier1: baseCostAndCarbonInputs.tier1SequestrationRate,
        tier2: baseCostAndCarbonInputs.tier2SequestrationRate,
      },
      plantingSuccessRate: parseFloat(plantingSuccessRate.value),
    };
  }

  async getOverridableCostInputs(
    dto: GetOverridableCostInputs,
  ): Promise<OverridableCostInputsDto> {
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
    // if (activity === ACTIVITY.CONSERVATION) {
    //   costInputs.implementationLabor = undefined;
    // }
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
      if (implementationLaborToSelect) {
        queryBuilder.select(
          queryBuilder.alias + '.' + implementationLaborToSelect + ' :: float',
          'implementationLabor',
        );
      }
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
