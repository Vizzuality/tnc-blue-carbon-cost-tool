export type ExcelEmissionFactors = {
  Country: string;
  'Country code': string;

  'Selection (only for mangroves)': string;
  'Mangrove emission factor': number;
  'Mangrove emission factor - AGB': number;
  'Mangrove emission factor - SOC': number;
  'Mangrove - Tier 1 - Global emission factor': number;
  'Mangrove - Tier 2 - Country-specific emission factor - AGB': number;
  'Mangrove - Tier 2 - Country-specific emission factor - SOC': number;

  'Selection (only for seagrass)': string;
  'Seagrass emission factor': number;
  'Seagrass emission factor - AGB': number;
  'Seagrass emission factor - SOC': number;
  'Seagrass - Tier 1 - Global emission factor': number;
  'Seagrass - Tier 2 - Country-specific emission factor - AGB': number;
  'Seagrass - Tier 2 - Country-specific emission factor - SOC': number;

  'Selection (only for salt marsh)': string;
  'Salt marsh emission factor': number;
  'Salt Marsh emission factor - AGB': number;
  'Salt Marsh emission factor - SOC': number;
  'Salt marsh - Tier 1 - Global emission factor': number;
  'Salt Marsh - Tier 2 - Country-specific emission factor - AGB': number;
  'Salt Marsh - Tier 2 - Country-specific emission factor - SOC': number;
};
