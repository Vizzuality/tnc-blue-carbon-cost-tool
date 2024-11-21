import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { GetOverridableAssumptionsDTO } from '@shared/dtos/custom-projects/get-overridable-assumptions-d-t.o';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';

export enum ECOSYSTEM_RESTORATION_RATE_NAMES {
  MANGROVE = 'Mangrove restoration rate',
  SEAGRASS = 'Seagrass restoration rate',
  SALT_MARSH = 'Salt marsh restoration rate',
}

export enum ACTIVITY_PROJECT_LENGTH_NAMES {
  CONSERVATION = 'Conservation project length',
  RESTORATION = 'Restoration project length',
}

export const COMMON_OVERRIDABLE_ASSUMPTION_NAMES = [
  'Baseline reassessment frequency',
  'Buffer',
  'Carbon price increase',
  'Discount rate',
  'Verification frequency',
] as const;

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
    if (assumptions.length !== 7) {
      throw new Error('Not all required overridable assumptions were found');
    }
    return assumptions;
  }

  private getAssumptionNamesByCountryAndEcosystem(
    dto: GetOverridableAssumptionsDTO,
  ): string[] {
    const { ecosystem, activity } = dto;
    const assumptions = [...COMMON_OVERRIDABLE_ASSUMPTION_NAMES] as string[];
    assumptions.push(this.map[ecosystem]);
    assumptions.push(this.map[activity]);
    return assumptions;
  }

  async getAllModelAssumptions() {
    // TODO: To be implemented. We probably don't want to retrieve by find() as we would need to have a constant-like object for the calculations
  }
}
