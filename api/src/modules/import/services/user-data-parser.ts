// I feel dirty doing this...

import { UserUploadCostInputs } from '@shared/entities/users/user-upload-cost-inputs.entity';
import { UserUploadRestorationInputs } from '@shared/entities/users/user-upload-restoration-inputs.entity';
import { UserUploadConservationInputs } from '@shared/entities/users/user-upload-conservation-inputs.entity';

export function userDataCostInputsMapJsonToEntity(
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

export function userDataRestorationInputMapJsonToEntity(
  data: Record<string, any>,
  userId: string,
): Partial<UserUploadRestorationInputs> {
  return {
    projectName: data['Project name'],
    country: data['Country'],
    cityOrRegion: data['City / province / region / state of project'],
    projectStartYear: data['Project start year'],
    mostRecentYearOfData: data['Most recent year of data collection'],
    ecosystem: data['Ecosystem'],
    projectActivity: data['Project activity']?.toString(), // Convertir a string si es numérico
    projectSizeAreaStudied: data['Project size / area studied'],
    categories: data['Categories'],
    projectArea: data['Project area '],
    abovegroundBiomassStock: data['Aboveground biomass stock'],
    belowgroundBiomassStock: data['Belowground biomass stock '],
    soilOrganicCarbonStock: data['Soil organic carbon stock '],
    methaneEmissions: data['Methane emissions '],
    nitrousOxideEmissions: data['Nitrous oxide emissions '],
    abovegroundBiomassEmissionsFactor:
      data['Aboveground biomass emissions factor'],
    belowgroundBiomassEmissionsFactor:
      data['Belowground biomass emissions factor'],
    soilOrganicCarbonEmissionsFactor:
      data['Soil organic carbon emissions factor '],
    user: { id: userId } as any,
  };
}

export function userDataConservationInputMapJsonToEntity(
  data: Record<string, any>,
  userId: string,
): Partial<UserUploadConservationInputs> {
  return {
    projectName: data['Project name'],
    country: data['Country'],
    cityOrRegion: data['City / province / region / state of project'],
    projectStartYear: data['Project start year'],
    mostRecentYearOfData: data['Most recent year of data collection'],
    ecosystem: data['Ecosystem'],
    projectActivity: data['Project activity']?.toString(), // Convertir a string si es numérico
    projectSizeAreaStudied: data['Project size / area studied'],
    categories: data['Categories'],
    projectArea: data['Project area '],
    abovegroundBiomassStock: data['Aboveground biomass stock'],
    belowgroundBiomassStock: data['Belowground biomass stock '],
    soilOrganicCarbonStock: data['Soil organic carbon stock '],
    methaneEmissions: data['Methane emissions '],
    nitrousOxideEmissions: data['Nitrous oxide emissions '],
    abovegroundBiomassEmissionsFactor:
      data['Aboveground biomass emissions factor'],
    belowgroundBiomassEmissionsFactor:
      data['Belowground biomass emissions factor'],
    soilOrganicCarbonEmissionsFactor:
      data['Soil organic carbon emissions factor '],
    user: { id: userId } as any,
  };
}
