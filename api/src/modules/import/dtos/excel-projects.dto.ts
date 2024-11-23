import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from '@shared/entities/activity.enum';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { PROJECT_PRICE_TYPE } from '@shared/entities/projects.entity';

export type ExcelProjects = {
  project_name: string;
  continent: string;
  Country: string;
  country_code: string;
  ecosystem: ECOSYSTEM;
  activity: ACTIVITY;
  activity_type: RESTORATION_ACTIVITY_SUBTYPE;
  project_size_ha: number;
  project_size_filter: string;
  aAbatement_potential: number;
  total_cost_NPV: number;
  total_cost: number;
  '$/tCO2e (NPV)': number;
  '$/tCO2e': number;
  initial_price_assumption: string;
  price_type: PROJECT_PRICE_TYPE;
};
