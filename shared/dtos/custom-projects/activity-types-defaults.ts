import { ACTIVITY } from "@shared/entities/activity.enum";

export type ConvervationActivityDefaults = {
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
  activity: string;
  sequestrationRate: {
    tier1: number;
    tier2: number;
  };
};

export type ActivityTypesDefaults = {
  [ACTIVITY.CONSERVATION]: ConvervationActivityDefaults;
  [ACTIVITY.RESTORATION]: RestorationActivityDefaults;
};
