import { UPLOAD_DATA_FILE_KEYS } from '@shared/dtos/users/upload-data-files.dto';
import { z } from 'zod';

type ExpectedFieldConfig = {
  name: string;
  fieldPosition: string;
  dataPosition: string;
  descriptionPosition: string;
  validation?: z.ZodType<any, any, any>;
};

export const IMPORT_CONFIG: {
  [key in (typeof UPLOAD_DATA_FILE_KEYS)[keyof typeof UPLOAD_DATA_FILE_KEYS]]: {
    expectedTabs: {
      name: string;
      expectedFields: ExpectedFieldConfig[];
    }[];
  };
} = {
  [UPLOAD_DATA_FILE_KEYS.CARBON_INPUTS_TEMPLATE]: {
    expectedTabs: [
      {
        name: 'Restoration',
        expectedFields: [
          {
            name: 'Project name',
            fieldPosition: 'B2',
            dataPosition: 'B3',
            descriptionPosition: 'B4',
            validation: z.string(),
          },
          {
            name: 'Country',
            fieldPosition: 'C2',
            dataPosition: 'C3',
            descriptionPosition: 'C4',
            validation: z.string(),
          },
          {
            name: 'City / province / region / state of project',
            fieldPosition: 'D2',
            dataPosition: 'D3',
            descriptionPosition: 'D4',
            validation: z.string(),
          },
          {
            name: 'Project start year',
            fieldPosition: 'E2',
            dataPosition: 'E3',
            descriptionPosition: 'E4',
          },
          {
            name: 'Most recent year of data collection',
            fieldPosition: 'F2',
            dataPosition: 'F3',
            descriptionPosition: 'F4',
          },
          {
            name: 'Ecosystem',
            fieldPosition: 'G2',
            dataPosition: 'G3',
            descriptionPosition: 'G4',
          },
          {
            name: 'Project activity',
            fieldPosition: 'H2',
            dataPosition: 'H3',
            descriptionPosition: 'H4',
          },
          {
            name: 'Project size / area studied',
            fieldPosition: 'I2',
            dataPosition: 'I3',
            descriptionPosition: 'I4',
          },
          {
            name: 'Project area',
            fieldPosition: 'J2',
            dataPosition: 'J3',
            descriptionPosition: 'J4',
          },
          {
            name: 'Restoration rate',
            fieldPosition: 'K2',
            dataPosition: 'K3',
            descriptionPosition: 'K4',
          },
          {
            name: 'Aboveground biomass sequestration rate',
            fieldPosition: 'L2',
            dataPosition: 'L3',
            descriptionPosition: 'L4',
          },
          {
            name: 'Belowground biomass sequestration rate',
            fieldPosition: 'M2',
            dataPosition: 'M3',
            descriptionPosition: 'M4',
          },
          {
            name: 'Soil organic carbon sequestration rate',
            fieldPosition: 'N2',
            dataPosition: 'N3',
            descriptionPosition: 'N4',
          },
          {
            name: 'Methane emissions',
            fieldPosition: 'O2',
            dataPosition: 'O3',
            descriptionPosition: 'O4',
          },
          {
            name: 'Nitrous oxide emissions',
            fieldPosition: 'P2',
            dataPosition: 'P3',
            descriptionPosition: 'P4',
          },
          {
            name: 'Success rate',
            fieldPosition: 'Q2',
            dataPosition: 'Q3',
            descriptionPosition: 'Q4',
          },
          {
            name: 'Background recovery rate',
            fieldPosition: 'R2',
            dataPosition: 'R3',
            descriptionPosition: 'R4',
          },
        ],
      },
      {
        name: 'Conservation',
        expectedFields: [
          {
            name: 'Project name',
            fieldPosition: 'B2',
            dataPosition: 'B3',
            descriptionPosition: 'B4',
          },
          {
            name: 'Country',
            fieldPosition: 'C2',
            dataPosition: 'C3',
            descriptionPosition: 'C4',
          },
          {
            name: 'City / province / region / state of project',
            fieldPosition: 'D2',
            dataPosition: 'D3',
            descriptionPosition: 'D4',
          },
          {
            name: 'Project start year',
            fieldPosition: 'E2',
            dataPosition: 'E3',
            descriptionPosition: 'E4',
          },
          {
            name: 'Most recent year of data collection',
            fieldPosition: 'F2',
            dataPosition: 'F3',
            descriptionPosition: 'F4',
          },
          {
            name: 'Ecosystem',
            fieldPosition: 'G2',
            dataPosition: 'G3',
            descriptionPosition: 'G4',
          },
          {
            name: 'Project activity',
            fieldPosition: 'H2',
            dataPosition: 'H3',
            descriptionPosition: 'H4',
          },
          {
            name: 'Project size / area studied',
            fieldPosition: 'I2',
            dataPosition: 'I3',
            descriptionPosition: 'I4',
          },
          {
            name: 'Project area',
            fieldPosition: 'J2',
            dataPosition: 'J3',
            descriptionPosition: 'J4',
          },
          {
            name: 'Aboveground biomass stock',
            fieldPosition: 'K2',
            dataPosition: 'K3',
            descriptionPosition: 'K4',
          },
          {
            name: 'Belowground biomass stock',
            fieldPosition: 'L2',
            dataPosition: 'L3',
            descriptionPosition: 'L4',
          },
          {
            name: 'Soil organic carbon stock',
            fieldPosition: 'M2',
            dataPosition: 'M3',
            descriptionPosition: 'M4',
          },
          {
            name: 'Methane emissions',
            fieldPosition: 'N2',
            dataPosition: 'N3',
            descriptionPosition: 'N4',
          },
          {
            name: 'Nitrous oxide emissions',
            fieldPosition: 'O2',
            dataPosition: 'O3',
            descriptionPosition: 'O4',
          },
          {
            name: 'Aboveground biomass emissions factor',
            fieldPosition: 'P2',
            dataPosition: 'P3',
            descriptionPosition: 'P4',
          },
          {
            name: 'Belowground biomass emissions factor',
            fieldPosition: 'Q2',
            dataPosition: 'Q3',
            descriptionPosition: 'Q4',
          },
          {
            name: 'Soil organic carbon emissions factor',
            fieldPosition: 'R2',
            dataPosition: 'R3',
            descriptionPosition: 'R4',
          },
        ],
      },
    ],
  },
  [UPLOAD_DATA_FILE_KEYS.COST_INPUTS_TEMPLATE]: {
    expectedTabs: [
      {
        name: 'Input',
        expectedFields: [
          {
            name: 'Program name (if willing to share)',
            fieldPosition: 'B2',
            dataPosition: 'B3',
            descriptionPosition: 'B4',
          },
          {
            name: 'Intended length of project',
            fieldPosition: 'C2',
            dataPosition: 'C3',
            descriptionPosition: 'C4',
          },
          {
            name: 'Country',
            fieldPosition: 'D2',
            dataPosition: 'D3',
            descriptionPosition: 'D4',
          },
          {
            name: 'Currency',
            fieldPosition: 'E2',
            dataPosition: 'E3',
            descriptionPosition: 'E4',
          },
          {
            name: 'Project start year',
            fieldPosition: 'F2',
            dataPosition: 'F3',
            descriptionPosition: 'F4',
          },
          {
            name: 'Project activity',
            fieldPosition: 'G2',
            dataPosition: 'G3',
            descriptionPosition: 'G4',
          },
          {
            name: 'Ecosystem',
            fieldPosition: 'H2',
            dataPosition: 'H3',
            descriptionPosition: 'H4',
          },
          {
            name: 'Project size',
            fieldPosition: 'I2',
            dataPosition: 'I3',
            descriptionPosition: 'I4',
          },
          {
            name: 'Validation standard / accrediting organization',
            fieldPosition: 'J2',
            dataPosition: 'J3',
            descriptionPosition: 'J4',
          },

          {
            name: 'Number of local individuals who own, work, and/or live in the project site (e.g., land tenure)',
            fieldPosition: 'K2',
            dataPosition: 'K3',
            descriptionPosition: 'K4',
          },
          {
            name: 'City / province / region / state of project',
            fieldPosition: 'L2',
            dataPosition: 'L3',
            descriptionPosition: 'L4',
          },
          {
            name: 'Intended alternative use of land',
            fieldPosition: 'M2',
            dataPosition: 'M3',
            descriptionPosition: 'M4',
          },
          {
            name: 'Land ownership before project',
            fieldPosition: 'N2',
            dataPosition: 'N3',
            descriptionPosition: 'N4',
          },
          {
            name: 'SDGs benefitted / co-benefitted',
            fieldPosition: 'O2',
            dataPosition: 'O3',
            descriptionPosition: 'O4',
          },
          {
            name: 'Project eligible for voluntary carbon credits?',
            fieldPosition: 'P2',
            dataPosition: 'P3',
            descriptionPosition: 'P4',
          },
          {
            name: 'Are you willing to speak with us about your carbon credit pricing?',
            fieldPosition: 'Q2',
            dataPosition: 'Q3',
            descriptionPosition: 'Q4',
          },
          {
            name: 'Are you able to provide additional detailed cost documentation for the project?',
            fieldPosition: 'R2',
            dataPosition: 'R3',
            descriptionPosition: 'R4',
          },

          {
            name: 'Establishing community engagement / buy-in',
            fieldPosition: 'S2',
            dataPosition: 'S3',
            descriptionPosition: 'S4',
          },
          {
            name: 'Conservation project planning & administration',
            fieldPosition: 'T2',
            dataPosition: 'T3',
            descriptionPosition: 'T4',
          },
          {
            name: 'Carbon project planning & administration',
            fieldPosition: 'U2',
            dataPosition: 'U3',
            descriptionPosition: 'U4',
          },
          {
            name: 'Land cost',
            fieldPosition: 'V2',
            dataPosition: 'V3',
            descriptionPosition: 'V4',
          },
          {
            name: 'Financing cost',
            fieldPosition: 'W2',
            dataPosition: 'W3',
            descriptionPosition: 'W4',
          },
          {
            name: 'Materials (e.g., seeds, fertilizer, seedlings)',
            fieldPosition: 'X2',
            dataPosition: 'X3',
            descriptionPosition: 'X4',
          },
          {
            name: 'Materials (e.g., machinery, equipment, etc.)',
            fieldPosition: 'Y2',
            dataPosition: 'Y3',
            descriptionPosition: 'Y4',
          },
          {
            name: 'Project labor / activity',
            fieldPosition: 'Z2',
            dataPosition: 'Z3',
            descriptionPosition: 'Z4',
          },
          {
            name: 'Engineering / construction intervention',
            fieldPosition: 'AA2',
            dataPosition: 'AA3',
            descriptionPosition: 'AA4',
          },
          {
            name: 'Ongoing community engagement',
            fieldPosition: 'AB2',
            dataPosition: 'AB3',
            descriptionPosition: 'AB4',
          },
          {
            name: 'Other project running cost',
            fieldPosition: 'AC2',
            dataPosition: 'AC3',
            descriptionPosition: 'AC4',
          },
          {
            name: 'Project monitoring',
            fieldPosition: 'AD2',
            dataPosition: 'AD3',
            descriptionPosition: 'AD4',
          },
          {
            name: '1) Other cost (please specify activities)',
            fieldPosition: 'AE2',
            dataPosition: 'AE3',
            descriptionPosition: 'AE4',
          },
          {
            name: '2) Other cost (please specify activities)',
            fieldPosition: 'AF2',
            dataPosition: 'AF3',
            descriptionPosition: 'AF4',
          },
          {
            name: '3) Other cost (please specify activities)',
            fieldPosition: 'AG2',
            dataPosition: 'AG3',
            descriptionPosition: 'AG4',
          },

          {
            name: 'Project site cumulative sequestration / carbon stock',
            fieldPosition: 'AH2',
            dataPosition: 'AH3',
            descriptionPosition: 'AH4',
          },
          {
            name: 'Project size',
            fieldPosition: 'AI2',
            dataPosition: 'AI3',
            descriptionPosition: 'AI4',
          },

          {
            name: 'Please describe in detail the project activity (e.g., planted mangrove seedlings, set up perimeter around conservation area)',
            fieldPosition: 'AJ2',
            dataPosition: 'AJ3',
            descriptionPosition: 'AJ4',
          },
          {
            name: 'When you kicked off the project, how did you spend to engage the community, build trust, introduce the project goals, etc.? (E.g., How many hours of community meetings? How much do you think you spent per household?)',
            fieldPosition: 'AK2',
            dataPosition: 'AK3',
            descriptionPosition: 'AK4',
          },
          {
            name: 'How did you acquire the rights to establish the project on the land? Did you establish a conservation easement or conservation agreements? What was the land used for before the project?',
            fieldPosition: 'AL2',
            dataPosition: 'AL3',
            descriptionPosition: 'AL4',
          },
          {
            name: 'What was the hourly wage rate paid for labor? How many hours worked for each activity? How many hours worked total?',
            fieldPosition: 'AM2',
            dataPosition: 'AM3',
            descriptionPosition: 'AM4',
          },
          {
            name: 'Please describe the ongoing community engagement for your project. How were individuals compensated?',
            fieldPosition: 'AN2',
            dataPosition: 'AN3',
            descriptionPosition: 'AN4',
          },
          {
            name: 'Did you undertake any engineering / construction interventions for your project? (e.g., building / removing a bridge, road, retaining wall) If so, please describe the activity in detail.',
            fieldPosition: 'AO2',
            dataPosition: 'AO3',
            descriptionPosition: 'AO4',
          },
        ],
      },
    ],
  },
};
