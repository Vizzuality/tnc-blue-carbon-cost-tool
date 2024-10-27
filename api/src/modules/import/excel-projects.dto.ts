import { ACTIVITY, ECOSYSTEM } from '@shared/entities/base-data.entity';
import { PROJECT_PRICE_TYPE } from '@shared/entities/users/projects.entity';

export type ExcelProjects = {
  Project_name: string;
  Continent: string;
  Country: string;
  'Country code': string;
  Ecosystem: ECOSYSTEM;
  Activity: ACTIVITY;
  Activity_type: string;
  Project_size: number;
  Project_size_filter: string;
  Abatement_potential: number;
  Total_cost_NPV: number;
  Total_cost: number;
  '$/tCO2e (NPV)': number;
  '$/tCO2e': number;
  'Initial price assumption': string;
  'Price type': PROJECT_PRICE_TYPE;
};
