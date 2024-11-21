import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { GetOverridableAssumptionsDTO } from '@shared/dtos/custom-projects/get-overridable-assumptions-d-t.o';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';

@Injectable()
export class AssumptionsRepository extends Repository<ModelAssumptions> {
  constructor(
    @InjectRepository(ModelAssumptions)
    private repo: Repository<ModelAssumptions>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async getOverridableModelAssumptions(dto: GetOverridableAssumptionsDTO) {
    const queryBuilder = this.createQueryBuilder('assumptions')
      .select(['name', 'unit', 'value'])
      .where({
        name: In([
          'Verification frequency',
          'Baseline reassessment frequency',
          'Carbon price increase',
          'Buffer',
          'Discount rate',
        ]),
      });

    if (dto.activity === ACTIVITY.CONSERVATION) {
      queryBuilder.andWhere('name = :activity', {
        activity: 'Conservation project length',
      });
    }
    if (dto.activity === ACTIVITY.RESTORATION) {
      queryBuilder.andWhere('name = :activity', {
        activity: 'Restoration project length',
      });
    }

    if (dto.ecosystem === ECOSYSTEM.MANGROVE) {
      queryBuilder.andWhere('name = :ecosystem', {
        ecosystem: 'Mangrove restoration rate',
      });
    }
    if (dto.ecosystem === ECOSYSTEM.SEAGRASS) {
      queryBuilder.andWhere('name = :ecosystem', {
        ecosystem: 'Seagrass restoration rate',
      });
    }
    if (dto.ecosystem === ECOSYSTEM.SALT_MARSH) {
      queryBuilder.andWhere('name = :ecosystem', {
        ecosystem: 'Salt marsh restoration rate',
      });
    }
  }

  async getAllModelAssumptions() {
    // TODO: To be implemented. We probably don't want to retrieve by find() as we would need to have a constant-like object for the calculations
  }
}
