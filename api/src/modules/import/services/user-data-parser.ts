// I feel dirty doing this...

import { UserUploadCostInputs } from '@shared/entities/user-project-data.entity';

export const userDataInputJson = {
  'Program name (if willing to share)': 'test name',
  'Intended length of project': 2000,
  Country: 'Basque Country',
  Currency: 'Euro',
  'Project start year': 1,
  'Project activity': 'Conservation',
  Ecosystem: 'Mangrove',
  'Project size': 'something',
  'Validation standard / accrediting organization': 'Verra',
  'Number of local individuals who own, work, and/or live in the project site (e.g., land tenure)':
    'land tenure',
  'City / province / region / state of project': 'Azpeiti',
  'Intended alternative use of land': 'commercial',
  'Land ownership before project': 'private',
  'SDGs benefitted / co-benefitted': 'sdg',
  'Project eligible for voluntary carbon credits?': 'no',
  'Are you willing to speak with us about your carbon credit pricing?': 'yes',
  'Are you able to provide additional detailed cost documentation for the project?':
    'yes',
  'Cost categories ': 'Detailed activities...',
  'Establishing community engagement / buy-in': 1,
  'Conservation project planning & administration ': 2,
  'Carbon project planning & administration': 3,
  'Land cost': 4,
  'Financing cost': 5,
  'Materials (e.g., seeds, fertilizer, seedlings)': 6,
  'Materials (e.g., machinery, equipment, etc.)': 7,
  'Project labor / activity': 8,
  'Engineering / construction intervention': 9,
  'Ongoing community engagement': 10,
  'Other project running cost': 11,
  'Project monitoring': 12,
  '1) Other cost (please specify activities)': 13,
  '2) Other cost (please specify activities)': 14,
  '3) Other cost (please specify activities)': 15,
  'Project site cumulative sequestration / carbon stock': 'something',
  'Please describe in detail the project activity (e.g., planted mangrove seedlings, set up perimeter around conservation area)':
    'question 1',
  'When you kicked off the project, how did you spend to engage the community...':
    'question 2',
  'How did you acquire the rights to establish the project on the land?...':
    'question 3',
  'What was the hourly wage rate paid for labor? How many hours worked for each activity?':
    'question 4',
  'Please describe the ongoing community engagement for your project.':
    'question 5',
  'Did you undertake any engineering / construction interventions for your project?':
    'question 6',
};

// Función para transformar el JSON
export function userDataMapJsonToEntity(
  inputJson: Record<string, any>,
  userId: string,
): Partial<UserUploadCostInputs> {
  return {
    programName: inputJson['Program name (if willing to share)'],
    intendedLengthOfProject: inputJson['Intended length of project'],
    country: inputJson['Country'],
    currency: inputJson['Currency'],
    projectStartYear: inputJson['Project start year'],
    projectActivity: inputJson['Project activity'],
    ecosystem: inputJson['Ecosystem'],
    projectSize: inputJson['Project size'],
    validationStandard:
      inputJson['Validation standard / accrediting organization'],
    numberOfLocalIndividuals:
      inputJson[
        'Number of local individuals who own, work, and/or live in the project site (e.g., land tenure)'
      ],
    cityOrRegion: inputJson['City / province / region / state of project'],
    intendedAlternativeUseOfLand: inputJson['Intended alternative use of land'],
    landOwnershipBeforeProject: inputJson['Land ownership before project'],
    sdgsBenefitted: inputJson['SDGs benefitted / co-benefitted'],
    projectEligibleForCarbonCredits:
      inputJson['Project eligible for voluntary carbon credits?'] === 'yes',
    willingToSpeakAboutPricing:
      inputJson[
        'Are you willing to speak with us about your carbon credit pricing?'
      ] === 'yes',
    ableToProvideDetailedCostDocumentation:
      inputJson[
        'Are you able to provide additional detailed cost documentation for the project?'
      ] === 'yes',
    costCategories: inputJson['Cost categories '],
    establishingCommunityEngagement:
      inputJson['Establishing community engagement / buy-in'],
    conservationProjectPlanning:
      inputJson['Conservation project planning & administration '],
    carbonProjectPlanning:
      inputJson['Carbon project planning & administration'],
    landCost: inputJson['Land cost'],
    financingCost: inputJson['Financing cost'],
    materialsSeedsFertilizer:
      inputJson['Materials (e.g., seeds, fertilizer, seedlings)'],
    materialsMachineryEquipment:
      inputJson['Materials (e.g., machinery, equipment, etc.)'],
    projectLaborActivity: inputJson['Project labor / activity'],
    engineeringIntervention:
      inputJson['Engineering / construction intervention'],
    ongoingCommunityEngagement: inputJson['Ongoing community engagement'],
    otherProjectRunningCost: inputJson['Other project running cost'],
    projectMonitoring: inputJson['Project monitoring'],
    otherCost1: inputJson['1) Other cost (please specify activities)'],
    otherCost2: inputJson['2) Other cost (please specify activities)'],
    otherCost3: inputJson['3) Other cost (please specify activities)'],
    projectCumulativeSequestration:
      inputJson['Project site cumulative sequestration / carbon stock'],
    detailedProjectActivity:
      inputJson[
        'Please describe in detail the project activity (e.g., planted mangrove seedlings, set up perimeter around conservation area)'
      ],
    communityEngagementSpending:
      inputJson[
        'When you kicked off the project, how did you spend to engage the community...'
      ],
    landRightsAndEasements:
      inputJson[
        'How did you acquire the rights to establish the project on the land?...'
      ],
    hourlyWageRate:
      inputJson[
        'What was the hourly wage rate paid for labor? How many hours worked for each activity?'
      ],
    ongoingCommunityCompensation:
      inputJson[
        'Please describe the ongoing community engagement for your project.'
      ],
    engineeringDetails:
      inputJson[
        'Did you undertake any engineering / construction interventions for your project?'
      ],
    user: { id: userId } as any,
  };
}
