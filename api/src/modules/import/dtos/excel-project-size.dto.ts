import { ACTIVITY } from '@shared/entities/activity.enum';

export type ExcelProjectSize = {
  Country: string;
  'Country code': string;
  Activity: ACTIVITY;
  Ecosystem: string;
  'Size Ha': number;
  Source: string;
};
