import { RESTORATION_ACTIVITY_SUBTYPE } from '@shared/entities/activity.enum';
import { SEQUESTRATION_RATE_TIER_TYPES } from '@shared/entities/carbon-inputs/sequestration-rate.entity';

export class RestorationProjectParamsDto {
  activityType: RESTORATION_ACTIVITY_SUBTYPE;
  sequestrationRateUsed: SEQUESTRATION_RATE_TIER_TYPES;
  projectSpecificSequestrationRate?: number;
  plantingSuccessRate: number;
}
