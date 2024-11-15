import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from "@shared/entities/activity.enum";
import { COST_TYPE_SELECTOR } from "@shared/entities/projects.entity";

export const ACTIVITIES = [
  {
    label: ACTIVITY.CONSERVATION,
    value: ACTIVITY.CONSERVATION,
  },
  {
    label: ACTIVITY.RESTORATION,
    value: ACTIVITY.RESTORATION,
    children: [
      {
        label: RESTORATION_ACTIVITY_SUBTYPE.HYBRID,
        value: RESTORATION_ACTIVITY_SUBTYPE.HYBRID,
      },
      {
        label: RESTORATION_ACTIVITY_SUBTYPE.HYDROLOGY,
        value: RESTORATION_ACTIVITY_SUBTYPE.HYDROLOGY,
      },
      {
        label: RESTORATION_ACTIVITY_SUBTYPE.PLANTING,
        value: RESTORATION_ACTIVITY_SUBTYPE.PLANTING,
      },
    ],
  },
];

export const INITIAL_COST_RANGE: Record<COST_TYPE_SELECTOR, [number, number]> =
  {
    [COST_TYPE_SELECTOR.NPV]: [0, 309534971],
    [COST_TYPE_SELECTOR.TOTAL]: [0, 400907159],
  };
export const INITIAL_ABATEMENT_POTENTIAL_RANGE: [number, number] = [
  0, 10199230,
];
