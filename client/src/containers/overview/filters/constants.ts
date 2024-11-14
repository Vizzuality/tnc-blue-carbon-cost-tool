import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from "@shared/entities/activity.enum";

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
