import { ACTIVITY } from "@shared/entities/activity.enum";

export type ConvervationActivityDefaults = {
  ecosystemExtent: number;
  ecosystemLossRate: number;
  emissionFactor: {
    tier1: number;
    tier2: {
      emissionFactorAgb: number;
      emissionFactorSoc: number;
    };
  };
};

export type RestorationActivityDefaults = {
  sequestrationRate: {
    tier1: number;
    tier2: number;
  };
  plantingSuccessRate: number;
};

export type ActivityTypesDefaults = {
  [ACTIVITY.CONSERVATION]: ConvervationActivityDefaults;
  [ACTIVITY.RESTORATION]: RestorationActivityDefaults;
};
