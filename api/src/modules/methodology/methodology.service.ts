import { Injectable } from '@nestjs/common';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { AssumptionsRepository } from '@api/modules/calculations/assumptions.repository';

@Injectable()
export class MethodologyService {
  constructor(private readonly assumptionsRepository: AssumptionsRepository) {}

  async getAllModelAssumptions(): Promise<ModelAssumptions[]> {
    return this.assumptionsRepository.find();
  }
}
