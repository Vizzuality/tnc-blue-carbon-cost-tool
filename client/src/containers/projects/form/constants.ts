import { ACTIVITY } from "@shared/entities/activity.enum";

export const DEFAULT_FORM_VALUES = {
  activity: ACTIVITY.CONSERVATION,
  projectSizeHa: 10000, // activity === ACTIVITY.CONSERVATION ? 10000 : 100
  projectSpecificLossRate: -0.003,
  projectSpecificEmissionFactor: 15,
  emissionFactorAGB: 200,
  emissionFactorSOC: 15,
  plantingSuccessRate: 0.8,
  projectSpecificSequestrationRate: 15,
  initialCarbonPriceAssumption: 30,
};
