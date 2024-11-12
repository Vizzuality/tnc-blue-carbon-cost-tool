import { IsNumber } from 'class-validator';

export class CustomProjectAssumptionsDto {
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
  restorationProjectLength: number;
}
