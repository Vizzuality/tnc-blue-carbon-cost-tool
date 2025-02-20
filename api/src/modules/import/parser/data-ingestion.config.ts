export const DATA_INGESTION_CONFIG = {
  Projects: {},
  Base_size_table: {},
  Base_increase: {},
  // Sources >>
  'Sources table': {
    expectedColumns: ['Id', 'Source', 'Reviewed'],
  },
  // Asumptions >>
  'Model assumptions': {
    expectedColumns: ['Assumptions', 'Units', 'Value', 'Source'],
  },
  // Cost Inputs >>
  'Project size': {
    expectedColumns: [
      'Country',
      'Country code',
      'Activity',
      'Ecosystem',
      'Size Ha',
      'Source',
    ],
  },
  'Feasibility analysis': {
    expectedColumns: [
      'Country',
      'Country code',
      'Ecosystem',
      'Feasibility Analysis Cost',
      'Source',
    ],
  },
  'Conservation planning and admin': {
    expectedColumns: [
      'Country',
      'Country code',
      'Activity',
      'Ecosystem',
      'Planning and admin cost',
      'Source',
    ],
  },
  'Data collection and field costs': {
    expectedColumns: [
      'Country',
      'Country code',
      'Ecosystem',
      'Data collection and field cost',
      'Source',
    ],
  },
  'Community representation': {
    expectedColumns: [
      'Country',
      'Country code',
      'Ecosystem',
      'Community representation / liaison cost',
      'Source',
    ],
  },
  'Blue carbon project planning': {
    expectedColumns: [
      'Country',
      'Country code',
      'Blue carbon project planning cost',
      'Source',
    ],
  },
  'Establishing carbon rights': {
    expectedColumns: [
      'Country',
      'Country code',
      'Establishing carbon rights',
      'Source',
    ],
  },
  'Financing cost': {
    expectedColumns: ['Country', 'Country code', 'Financing cost', 'Source'],
  },
  Validation: {
    expectedColumns: ['Country', 'Country code', 'Validation cost', 'Source'],
  },
  'Implementation labor': {
    expectedColumns: [
      'Country',
      'Country code',
      'Ecosystem',
      'Planting cost',
      'Hybrid cost',
      'Hydrology cost',
      'Source planting',
      'Source hybrid',
      'Source hydrology',
    ],
  },
  Monitoring: {
    expectedColumns: [
      'Country',
      'Country code',
      'Ecosystem',
      'Monitoring cost',
      'Source',
    ],
  },
  Maintenance: {
    expectedColumns: [
      'Country',
      'Country code',
      'Maintenance',
      'Maintenance duration',
      'Source maintenance',
      'Source maintenance duration',
    ],
  },
  'Carbon standard fees': {
    expectedColumns: [
      'Country',
      'Country code',
      'Carbon standard fees',
      'Source',
    ],
  },
  'Community benefit sharing fund': {
    expectedColumns: [
      'Country',
      'Country code',
      'Community benefit sharing fund cost',
      'Source',
    ],
  },
  'Baseline reassessment': {
    expectedColumns: [
      'Country',
      'Country code',
      'Baseline reassessment cost',
      'Source',
    ],
  },
  MRV: {
    expectedColumns: ['Country', 'Country code', 'MRV cost', 'Source'],
  },
  'Long-term project operating': {
    expectedColumns: [
      'Country',
      'Country code',
      'Ecosystem',
      'Long-term project operating cost',
      'Source',
    ],
  },
  'Community cash flow': {
    expectedColumns: [
      'Country',
      'Country code',
      'Other community cash flow',
      'Source',
    ],
  },
  'Ecosystem extent': {
    expectedColumns: [
      'Country',
      'Country code',
      'Ecosystem',
      'Extent',
      'Extent historic',
      'Unprotected extent',
      'Source extent',
      'Source extent historic',
      'Source unprotected extent',
    ],
  },
  'Ecosystem loss': {
    expectedColumns: [
      'Country',
      'Country code',
      'Ecosystem',
      'Loss rate',
      'Source',
    ],
  },
  'Restorable land': {
    expectedColumns: [
      'Country',
      'Country code',
      'Ecosystem',
      'Restorable land',
      'Source',
    ],
  },
  'Sequestration rate': {
    expectedColumns: [
      'Country',
      'Country code',
      'Ecosystem',
      'Tier 1 - IPCC default value',
      'Tier 2 - country-specific rate',
      'Source - Tier 1 - IPCC default value',
      'Source - Tier 2 - country-specific rate',
    ],
  },
  'Emission factors': {
    expectedColumns: [
      'Country',
      'Country code',
      'Ecosystem',
      'Tier 1 - Global emission factor',
      'Tier 2 - Country-specific emission factor - AGB',
      'Tier 2 - Country-specific emission factor - SOC',
      'Source - Tier 1 - Global emission factor',
      'Source - Tier 2 - Country-specific emission factor - AGB',
      'Source - Tier 2 - Country-specific emission factor - SOC',
    ],
  },
} as const;
