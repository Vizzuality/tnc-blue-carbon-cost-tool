const tooltip = {
  title: "Info",
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

const mockData = {
  totalCost: 38023789,
  capEx: 1500000,
  opEx: 36500000,
  leftover: 4106132,
  totalRevenue: 40600000,
  opExRevenue: 36500000,
  details: [
    [
      {
        label: "Country",
        value: "Indonesia",
        countryCode: "ID",
      },
      {
        label: "Ecosystem",
        value: "Seagrass",
      },
      {
        label: "Carbon revenues to cover",
        value: "Only Opex",
      },
    ],
    [
      {
        label: "Project size",
        value: 20,
        unit: "hectares",
      },
      {
        label: "Activity type",
        value: "Conservation",
      },
      {
        label: "Initial carbon price",
        value: 30,
        unit: "$",
      },
    ],
    [
      {
        label: "Project length",
        value: 20,
        unit: "years",
      },
      {
        label: "Loss rate",
        value: "-0.10",
        unit: "%",
      },
      {
        label: "Emission factor",
        subValues: [
          {
            label: "AGB",
            value: 355,
            unit: "tCO2e/ha/yr",
          },
          {
            label: "SOC",
            value: 72,
            unit: "tCO2e/ha/yr",
          },
        ],
      },
    ],
  ],
  summary: [
    {
      name: "$/tCO2e (total cost, NPV)",
      value: 16,
      unit: "$",
      tooltip,
    },
    {
      name: "$/ha",
      value: 358,
      unit: "$",
      tooltip,
    },
    {
      name: "Leftover after OpEx / total cost",
      value: 392807,
      unit: "$",
      tooltip,
    },
    {
      name: "IRR when priced to cover opex",
      value: 18.5,
      unit: "%",
      tooltip,
    },
    {
      name: "IRR when priced to cover total costs",
      value: -1.1,
      unit: "%",
      tooltip,
    },
    {
      name: "Funding gap (NPV)",
      unit: "%",
      tooltip,
    },
  ],
  costDetails: [
    {
      name: "capitalExpenditure",
      value: 1514218,
      label: "Capital expenditure",
    },
    {
      name: "feasibilityAnalysis",
      value: 70000,
      label: "Feasibility analysis",
    },
    {
      name: "conservationPlanningAndAdmin",
      value: 629559,
      label: "Conservation planning and admin",
    },
    {
      name: "dataCollectionAndFieldCosts",
      value: 76963,
      label: "Data collection and field costs",
    },
    {
      name: "communityRepresentation",
      value: 286112,
      label: "Community representation",
    },
    {
      name: "blueCarbonProjectPlanning",
      value: 111125,
      label: "Blue carbon project planning",
    },
    {
      name: "establishingCarbonRights",
      value: 296010,
      label: "Establishing carbon rights",
    },
    {
      name: "validation",
      value: 44450,
      label: "Validation",
    },
    {
      name: "implementationLabor",
      value: 0,
      label: "Implementation labor",
    },
    {
      name: "operatingExpenditure",
      value: 36509571,
      label: "Operating expenditure",
    },
    {
      name: "monitoringAndMaintenance",
      value: 402322,
      label: "Monitoring and Maintenance",
    },
    {
      name: "communityBenefitSharingFund",
      value: 34523347,
      label: "Community benefit sharing fund",
    },
    {
      name: "carbonStandardFees",
      value: 227875,
      label: "Carbon standard fees",
    },
    {
      name: "baselineReassessment",
      value: 75812,
      label: "Baseline reassessment",
    },
    {
      name: "mrv",
      value: 223062,
      label: "MRV",
    },
    {
      name: "totalCost",
      value: 38023789,
      label: "Total cost",
    },
  ],
};

export default mockData;
