import { IsNumber } from 'class-validator';

export class OverridableAssumptions {
  @IsNumber()
  verificationFrequency: number;

  @IsNumber()
  discountRate: number;

  @IsNumber()
  carbonPriceIncrease: number;

  @IsNumber()
  buffer: number;

  @IsNumber()
  baselineReassessmentFrequency: number;

  @IsNumber()
  restorationRate: number;

  @IsNumber()
  projectLength: number;
}
