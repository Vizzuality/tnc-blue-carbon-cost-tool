import { PROJECT_SIZE_FILTER } from '@shared/entities/projects.entity';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { ACTIVITY } from '@shared/entities/activity.enum';

// TODO: As was questioned previously, it seems that size filter criteria is not a single criteria but it's a combination of
//       (at least) activity and ecosystem. Additionally we do have this data in the DB which can change, so we might need to
//       be able to change the criteria dynamically. Double check with the science team.
//       for reference, check cell number 6 in https://github.com/Vizzuality/tnc-blue-carbon-cost-tool/blob/96f57ab451d4171f341365cdba75f7bd89a1e66d/data/notebooks/High_level_overview.ipynb

type Thresholds = Record<PROJECT_SIZE_FILTER, number>;

const PROJECT_SIZE_THRESHOLDS: Record<
  ECOSYSTEM,
  Record<ACTIVITY, Thresholds>
> = {
  [ECOSYSTEM.MANGROVE]: {
    [ACTIVITY.CONSERVATION]: {
      [PROJECT_SIZE_FILTER.SMALL]: 4000,
      [PROJECT_SIZE_FILTER.MEDIUM]: 20000,
      [PROJECT_SIZE_FILTER.LARGE]: 40000,
    },
    [ACTIVITY.RESTORATION]: {
      [PROJECT_SIZE_FILTER.SMALL]: 100,
      [PROJECT_SIZE_FILTER.MEDIUM]: 500,
      [PROJECT_SIZE_FILTER.LARGE]: 1000,
    },
  },
  [ECOSYSTEM.SALT_MARSH]: {
    [ACTIVITY.CONSERVATION]: {
      [PROJECT_SIZE_FILTER.SMALL]: 800,
      [PROJECT_SIZE_FILTER.MEDIUM]: 4000,
      [PROJECT_SIZE_FILTER.LARGE]: 8000,
    },
    [ACTIVITY.RESTORATION]: {
      [PROJECT_SIZE_FILTER.SMALL]: 100,
      [PROJECT_SIZE_FILTER.MEDIUM]: 500,
      [PROJECT_SIZE_FILTER.LARGE]: 1000,
    },
  },
  [ECOSYSTEM.SEAGRASS]: {
    [ACTIVITY.CONSERVATION]: {
      [PROJECT_SIZE_FILTER.SMALL]: 400,
      [PROJECT_SIZE_FILTER.MEDIUM]: 2000,
      [PROJECT_SIZE_FILTER.LARGE]: 4000,
    },
    [ACTIVITY.RESTORATION]: {
      [PROJECT_SIZE_FILTER.SMALL]: 100,
      [PROJECT_SIZE_FILTER.MEDIUM]: 500,
      [PROJECT_SIZE_FILTER.LARGE]: 1000,
    },
  },
};

export function getProjectSizeFilter(
  ecosystem: ECOSYSTEM,
  activity: ACTIVITY,
  sizeHa: number,
): PROJECT_SIZE_FILTER {
  const thresholds = PROJECT_SIZE_THRESHOLDS[ecosystem][activity];

  if (sizeHa <= thresholds[PROJECT_SIZE_FILTER.SMALL]) {
    return PROJECT_SIZE_FILTER.SMALL;
  }
  if (sizeHa <= thresholds[PROJECT_SIZE_FILTER.MEDIUM]) {
    return PROJECT_SIZE_FILTER.MEDIUM;
  }
  return PROJECT_SIZE_FILTER.LARGE;
}
