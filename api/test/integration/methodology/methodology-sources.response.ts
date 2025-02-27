import { MethodologySourcesDto } from '@shared/dtos/methodology/methodology-sources.dto';

export const METHODOLOGY_SOURCES_RESPONSE_BODY: MethodologySourcesDto = [
  {
    category: 'Carbon',
    sourcesByComponentName: [
      {
        name: 'Ecosystem extent',
        sources: {
          extent: [
            {
              id: 4119,
              name: 'Global Mangrove Watch dataset for mangrove extent v4',
            },
            {
              id: 4122,
              name: 'Salt marsh extent from WCMC',
            },
            {
              id: 4121,
              name: 'Seagrass extent from WCMC',
            },
          ],
          historicExtent: [
            {
              id: 4119,
              name: 'Global Mangrove Watch dataset for mangrove extent v4',
            },
          ],
          unprotectedExtent: [
            {
              id: 4119,
              name: 'Global Mangrove Watch dataset for mangrove extent v4',
            },
          ],
        },
      },
      {
        name: 'Emission factors',
        sources: null,
      },
      {
        name: 'Loss rate',
        sources: [
          {
            id: 4123,
            name: 'Global Mangrove Watch dataset for mangrove protected extent',
          },
        ],
      },
      {
        name: 'Restorable land',
        sources: [
          {
            id: 4124,
            name: 'Restorable mangrove area from Mapping Ocean Wealth',
          },
        ],
      },
      {
        name: 'Sequestration rate',
        sources: {
          tier1Factor: [
            {
              id: 4125,
              name: 'Academic studies.',
            },
          ],
          tier2Factor: [],
        },
      },
    ],
  },
  {
    category: 'Costs',
    sourcesByComponentName: [
      {
        name: 'Baseline reassessment',
        sources: [
          {
            id: 4104,
            name: 'Numbers from Scott Settlemyer (Terracarbon), this cost is incremental to monitoring and verification. Between $20k and $40k estimations (see email)',
          },
        ],
      },
      {
        name: 'Blue carbon project planning',
        sources: [
          {
            id: 4071,
            name: 'TNC Feasibility Studies - Herring River, New Jersey Salt Marsh, Fruit Farm Creek',
          },
          {
            id: 4073,
            name: 'TNC Feasibility Studies - Herring River, New Jersey Salt Marsh, Fruit Farm Creek plus TNC Australia input',
          },
          {
            id: 4107,
            name: 'TNC Feasibility Study - Caribbean',
          },
          {
            id: 4072,
            name: 'TNC Feasibility Study - North Kenya',
          },
        ],
      },
      {
        name: 'Carbon standard fees',
        sources: [
          {
            id: 4117,
            name: 'VCS fee per creditper Verra website https://verra.org/wp-content/uploads/2023/03/Program-Fee-Schedule-v4.3-FINAL.pdf',
          },
        ],
      },
      {
        name: 'Community benefit sharing',
        sources: [
          {
            id: 4102,
            name: 'Using 50% for developing nations.',
          },
          {
            id: 4101,
            name: 'Using 5% as placeholder for developed countries.',
          },
          {
            id: 4103,
            name: 'Using 85% based on The Nassau Guardian article.',
          },
        ],
      },
      {
        name: 'Community cash flow',
        sources: [],
      },
      {
        name: 'Community liaison',
        sources: [
          {
            id: 4056,
            name: 'Starts by taking the 25% portion from the conservation activity planning and admin componenet. 1 Project Coordinator ($59,089) and 1 Conservation Coordinator ($49,474).',
          },
        ],
      },
      {
        name: 'Conservation planning',
        sources: [
          {
            id: 4054,
            name: 'Program Manager (1): $81,2000. Program Coordinator (2): $52,045. Additional 20% of salaries is added to account for meetings / expenses. 25% of costs are applied to community representation.',
          },
        ],
      },
      {
        name: 'Data collection',
        sources: [
          {
            id: 4055,
            name: 'Discussions with experts suggest $80k starting point',
          },
        ],
      },
      {
        name: 'Establishing carbon rights',
        sources: [
          {
            id: 4068,
            name: 'Assumes internal legal team expenses ($20,000), external international carbon focused legal team ($100,000), and local counsel ($10,000). ',
          },
          {
            id: 4067,
            name: 'Assumes internal legal team expenses ($20,000), external international carbon focused legal team ($100,000), and local counsel ($20,000). ',
          },
          {
            id: 4069,
            name: 'Assumes internal legal team expenses ($20,000), external international carbon focused legal team ($100,000), and local counsel ($30,000). ',
          },
          {
            id: 4061,
            name: 'Assumes internal legal team expenses ($20,000), external international carbon focused legal team ($100,000), and local counsel ($80,000). USA has had multiple projects, so no inflator applied.',
          },
          {
            id: 4063,
            name: 'Assumes internal legal team expenses ($40,000), external international carbon focused legal team ($200,000), and local counsel ($120,000). Legal costs are likely high for Australia given that so few projects to date.',
          },
          {
            id: 4064,
            name: 'Assumes internal legal team expenses ($40,000), external international carbon focused legal team ($200,000), and local counsel ($80,000). Legal costs are likely high for Caribbean given that so few projects to date.',
          },
        ],
      },
      {
        name: 'Feasibility analysis',
        sources: [
          {
            id: 4053,
            name: 'TNC feasibility bid list',
          },
        ],
      },
      {
        name: 'Financing costs',
        sources: [
          {
            id: 4070,
            name: '5% of capex allotted for gathering project financing. From TNC Feasibility Study - Aotearoa New Zealand',
          },
        ],
      },
      {
        name: 'Implementation',
        sources: {
          hybridCost: [
            {
              id: 4090,
              name: 'Antonio Santa Marta - estimates for their reforestation project in Ecuador - he can provide more numbers in August 2023 when the project starts with Fabian',
            },
            {
              id: 4077,
              name: 'TNC Hurricane Paper',
            },
          ],
          plantingCost: [
            {
              id: 4090,
              name: 'Antonio Santa Marta - estimates for their reforestation project in Ecuador - he can provide more numbers in August 2023 when the project starts with Fabian',
            },
            {
              id: 4085,
              name: 'Bayraktarov study.',
            },
            {
              id: 4083,
              name: 'Figure comes from conversation with expert.',
            },
            {
              id: 4080,
              name: 'Figure derived in relation to US costs',
            },
            {
              id: 4084,
              name: 'Mangrove Restoration in Colombia study',
            },
            {
              id: 4086,
              name: 'Meta-analysis',
            },
            {
              id: 4078,
              name: 'Provided by TNC Indonesia',
            },
            {
              id: 4077,
              name: 'TNC Hurricane Paper',
            },
            {
              id: 4082,
              name: 'TNC Reducing Caribbean Risk with Mangroves study.',
            },
          ],
          hydrologyCost: [
            {
              id: 4090,
              name: 'Antonio Santa Marta - estimates for their reforestation project in Ecuador - he can provide more numbers in August 2023 when the project starts with Fabian',
            },
            {
              id: 4087,
              name: 'Backing out implementation cost from China Mangrove study.',
            },
            {
              id: 4085,
              name: 'Bayraktarov study.',
            },
            {
              id: 4079,
              name: 'Indonesian Government Estimate.',
            },
            {
              id: 4081,
              name: 'Planting costs plus hydrological intervention installation cost.',
            },
            {
              id: 4077,
              name: 'TNC Hurricane Paper',
            },
          ],
        },
      },
      {
        name: 'Long term project operating',
        sources: [
          {
            id: 4115,
            name: 'Project Coordinator: ($10,045). Conservation Coordinator: ($8,457). Apply 20% increase for meetings and expenses.',
          },
          {
            id: 4109,
            name: 'Project Coordinator: ($13,000). Conservation Coordinator: ($9,000). Apply 20% increase for meetings and expenses.',
          },
          {
            id: 4113,
            name: 'Project Coordinator: ($14,181). Conservation Coordinator: ($11,939). Apply 20% increase for meetings and expenses.',
          },
          {
            id: 4116,
            name: 'Project Coordinator: ($23,045). Conservation Coordinator: ($19,401). Apply 20% increase for meetings and expenses.',
          },
          {
            id: 4111,
            name: 'Project Coordinator: ($39,590). Conservation Coordinator: ($33,330). Apply 20% increase for meetings and expenses.',
          },
          {
            id: 4110,
            name: 'Project Coordinator: ($47,862). Conservation Coordinator: ($40,295). Apply 20% increase for meetings and expenses.',
          },
          {
            id: 4108,
            name: 'Project Coordinator: ($59,089). Conservation Coordinator: ($49,747). Apply 20% increase for meetings and expenses.',
          },
          {
            id: 4114,
            name: 'Project Coordinator: ($7,682). Conservation Coordinator: ($6,467). Apply 20% increase for meetings and expenses.',
          },
          {
            id: 4112,
            name: 'Project Coordinator: ($8,723). Conservation Coordinator: ($6,000). Apply 20% increase for meetings and expenses.',
          },
        ],
      },
      {
        name: 'Maintenance',
        sources: {
          maintenanceCost: [
            {
              id: 4100,
              name: 'Figure determined based on analyzing the amount of maintenance costs in relation to other capex costs.',
            },
          ],
          maintenanceDuration: [
            {
              id: 4100,
              name: 'Figure determined based on analyzing the amount of maintenance costs in relation to other capex costs.',
            },
          ],
          maintenance: [],
        },
      },
      {
        name: 'Monitoring',
        sources: [
          {
            id: 4092,
            name: 'Based on estimate of TNC Indonesia on community members costs.',
          },
          {
            id: 4095,
            name: 'Expert opinion of what individuals guarding would cost in Kenya.',
          },
          {
            id: 4096,
            name: 'Park Ranger salary of $11,900.',
          },
          {
            id: 4099,
            name: 'Park Ranger salary of $19,400.',
          },
          {
            id: 4094,
            name: 'Park Ranger salary of $33,300.',
          },
          {
            id: 4093,
            name: 'Park Ranger salary of $40,200.',
          },
          {
            id: 4091,
            name: 'Park Ranger salary of $49,700.',
          },
          {
            id: 4097,
            name: 'Park Ranger salary of $6,500.',
          },
          {
            id: 4098,
            name: 'Park Ranger salary of $8,400.',
          },
        ],
      },
      {
        name: 'MRV',
        sources: [
          {
            id: 4107,
            name: 'TNC Feasibility Study - Caribbean',
          },
          {
            id: 4105,
            name: 'TNC Feasibility Study -  New Jersey Salt Marsh',
          },
          {
            id: 4106,
            name: 'TNC Feasibility Study -  North Kenya ',
          },
        ],
      },
      {
        name: 'Validation costs',
        sources: [
          {
            id: 4071,
            name: 'TNC Feasibility Studies - Herring River, New Jersey Salt Marsh, Fruit Farm Creek',
          },
          {
            id: 4073,
            name: 'TNC Feasibility Studies - Herring River, New Jersey Salt Marsh, Fruit Farm Creek plus TNC Australia input',
          },
          {
            id: 4107,
            name: 'TNC Feasibility Study - Caribbean',
          },
          {
            id: 4072,
            name: 'TNC Feasibility Study - North Kenya',
          },
        ],
      },
    ],
  },
  {
    category: 'Economic factors',
    sourcesByComponentName: [
      {
        name: 'Model assumptions',
        sources: [
          {
            id: 4052,
            name: 'TNC feasibility study – Fruit Farm Creek, North Kenya, Bahamas',
          },
        ],
      },
    ],
  },
];
