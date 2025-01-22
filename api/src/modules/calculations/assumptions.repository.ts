import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { GetOverridableAssumptionsDTO } from '@shared/dtos/custom-projects/get-overridable-assumptions.dto';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import {
  ACTIVITY_PROJECT_LENGTH_NAMES,
  COMMON_OVERRIDABLE_ASSUMPTION_NAMES,
  ECOSYSTEM_RESTORATION_RATE_NAMES,
} from '@shared/schemas/assumptions/assumptions.enums';
import { OverridableAssumptions } from '@api/modules/custom-projects/dto/project-assumptions.dto';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';

const NON_OVERRIDABLE_ASSUMPTION_NAMES_MAP = {
  'Annual cost increase': 'annualCostIncrease',
  'Carbon price': 'carbonPrice',
  'Site specific ecosystem loss rate (if national no national loss rate)':
    'siteSpecificEcosystemLossRate',
  'Interest rate': 'interestRate',
  'Loan repayment schedule': 'loanRepaymentSchedule',
  'Soil Organic carbon release length': 'soilOrganicCarbonReleaseLength',
  'Planting success rate': 'plantingSuccessRate',
  'Default project length': 'defaultProjectLength',
};

const SCALING_POINTS_MAP = {
  [ACTIVITY.CONSERVATION]: 'Starting point scaling - conservation',
  [ACTIVITY.RESTORATION]: 'Starting point scaling - restoration',
};

@Injectable()
export class AssumptionsRepository extends Repository<ModelAssumptions> {
  map: Record<
    ACTIVITY & ECOSYSTEM,
    ECOSYSTEM_RESTORATION_RATE_NAMES & ACTIVITY_PROJECT_LENGTH_NAMES
  > = {
    [ACTIVITY.CONSERVATION]: ACTIVITY_PROJECT_LENGTH_NAMES.CONSERVATION,
    [ACTIVITY.RESTORATION]: ACTIVITY_PROJECT_LENGTH_NAMES.RESTORATION,
    [ECOSYSTEM.MANGROVE]: ECOSYSTEM_RESTORATION_RATE_NAMES.MANGROVE,
    [ECOSYSTEM.SEAGRASS]: ECOSYSTEM_RESTORATION_RATE_NAMES.SEAGRASS,
    [ECOSYSTEM.SALT_MARSH]: ECOSYSTEM_RESTORATION_RATE_NAMES.SALT_MARSH,
  };
  constructor(
    @InjectRepository(ModelAssumptions)
    private repo: Repository<ModelAssumptions>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async getOverridableModelAssumptions(dto: GetOverridableAssumptionsDTO) {
    const assumptions = await this.createQueryBuilder('model_assumptions')
      .select(['name', 'unit', 'value'])
      .where({
        name: In(this.getAssumptionNamesByCountryAndEcosystem(dto)),
      })
      .orderBy('name', 'ASC')
      .getRawMany();
    // Related to [0]. Search for [0] in this file.
    // if (assumptions.length !== 7) {
    //   throw new Error('Not all required overridable assumptions were found');
    // }
    return assumptions;
  }

  private getAssumptionNamesByCountryAndEcosystem(
    dto: GetOverridableAssumptionsDTO,
  ): string[] {
    const { ecosystem, activity } = dto;
    const assumptions = [...COMMON_OVERRIDABLE_ASSUMPTION_NAMES] as string[];
    // [0] The following line returns the restoration rate for an specific ecosystem. The this should only be returned for restoration activities according to the PO.
    if (activity === ACTIVITY.RESTORATION) {
      assumptions.push(this.map[ecosystem]);
    }
    assumptions.push(this.map[activity]);
    return assumptions;
  }

  async getNonOverridableModelAssumptions(
    activity: ACTIVITY,
  ): Promise<NonOverridableModelAssumptions> {
    const NON_OVERRIDABLE_ASSUMPTION_NAMES = Object.keys(
      NON_OVERRIDABLE_ASSUMPTION_NAMES_MAP,
    );
    const scalingPointToSelect = SCALING_POINTS_MAP[activity];
    const assumptions: ModelAssumptions[] = await this.createQueryBuilder(
      'model_assumptions',
    )
      .select(['name', 'value'])
      .where({
        name: In([...NON_OVERRIDABLE_ASSUMPTION_NAMES, scalingPointToSelect]),
      })
      .getRawMany();
    // To account for global non overridable assumptions + 1 dynamically selected assumption, the scaling point
    if (assumptions.length !== NON_OVERRIDABLE_ASSUMPTION_NAMES.length + 1) {
      throw new Error(
        'Not all required non-overridable assumptions were found',
      );
    }

    // There is an assumption that is not numeric, that's why the column is marked as string, but we don't seem to be using it. Double check this.
    return assumptions.reduce((acc, item) => {
      const propertyName = NON_OVERRIDABLE_ASSUMPTION_NAMES_MAP[item.name];
      if (propertyName) {
        acc[propertyName] = parseFloat(item.value);
      }
      if (Object.values(SCALING_POINTS_MAP).includes(item.name)) {
        acc.startingPointScaling = parseFloat(item.value);
      }
      return acc;
    }, {} as NonOverridableModelAssumptions);
  }
}

/**
 * Model assumptions that are not overridable by the user and will be fetched from the database, to then be merged with the user's assumptions
 * before being used in the calculations.
 */
export class NonOverridableModelAssumptions {
  annualCostIncrease: number;
  carbonPrice: number;
  siteSpecificEcosystemLossRate: number;
  interestRate: number;
  // TODO: Is this really non-overridable?
  loanRepaymentSchedule: number;
  soilOrganicCarbonReleaseLength: number;
  plantingSuccessRate: number;
  startingPointScaling: number;
  defaultProjectLength: number;
}

export type ModelAssumptionsForCalculations = NonOverridableModelAssumptions &
  OverridableAssumptions;
