import { Injectable } from '@nestjs/common';
import { ProjectInput } from '@api/modules/calculations/cost.calculator';

@Injectable()
export class SequestrationRateCalculator {
  projectInput: ProjectInput;
  projectLength: number;
  constructor(projectInput: ProjectInput) {
    this.projectInput = projectInput;
    this.projectLength = projectInput.assumptions.startingPointScaling;
  }
}
