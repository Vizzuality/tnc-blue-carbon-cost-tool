export enum ECOSYSTEM_RESTORATION_RATE_NAMES {
  MANGROVE = "Mangrove restoration rate",
  SEAGRASS = "Seagrass restoration rate",
  SALT_MARSH = "Salt marsh restoration rate",
}

export enum ACTIVITY_PROJECT_LENGTH_NAMES {
  CONSERVATION = "Conservation project length",
  RESTORATION = "Restoration project length",
}

export const COMMON_OVERRIDABLE_ASSUMPTION_NAMES = [
  "Baseline reassessment frequency",
  "Buffer",
  "Carbon price",
  "Carbon price increase",
  "Discount rate",
  "Verification frequency",
] as const;

export const ASSUMPTIONS_NAME_TO_DTO_MAP = {
  "Baseline reassessment frequency": "baselineReassessmentFrequency",
  Buffer: "buffer",
  "Carbon price increase": "carbonPriceIncrease",
  "Discount rate": "discountRate",
  "Verification frequency": "verificationFrequency",
  "Mangrove restoration rate": "restorationRate",
  "Seagrass restoration rate": "restorationRate",
  "Salt marsh restoration rate": "restorationRate",
  "Conservation project length": "projectLength",
  "Restoration project length": "projectLength",
} as const;

export const ASSUMPTIONS_NAME_TO_TOOLTIP_MAP = {
  "Baseline reassessment frequency": "BASELINE_REASSESSMENT_FREQUENCY",
  Buffer: "BUFFER",
  "Carbon price increase": "CARBON_PRICE_INCREASE",
  "Discount rate": "DISCOUNT_RATE",
  "Verification frequency": "VERIFICATION_FREQUENCY",
  "Seagrass restoration rate": "RESTORATION_RATE",
  "Conservation project length": "CONSERVATION_PROJECT_LENGTH",
  "Restoration project length": "RESTORATION_PROJECT_LENGTH",
} as const;

export const COSTS_DTO_MAP = {
  feasibilityAnalysis: {
    label: "Feasibility analysis",
    unit: "$/project",
    tooltipContent:
      "The production of a feasibility assessment, evaluating GHG mitigation potential and financial and non-financial considerations (e.g., legal, social).",
  },
  conservationPlanningAndAdmin: {
    label: "Conservation planning and admin",
    unit: "$/yr",
    tooltipContent:
      "Activities involved in the project start-up phase, such as project management, vendor coordination, fundraising, research, and travel.",
  },
  dataCollectionAndFieldCost: {
    label: "Data collection and field cost",
    unit: "$/yr",
    tooltipContent:
      "The expenses associated with onsite and field sampling to gather necessary data for project baseline and monitoring (e.g., carbon stock, vegetation and soil characteristics, hydrological data).",
  },
  communityRepresentation: {
    label: "Community representation",
    unit: "$/yr",
    tooltipContent:
      "Expenses incurred to support activiites aimed at supporting a free, prior and informed consent process with communities who are involved with or may be impacted by the project. This can include assessing community needs, conducting stakeholder surveys and trainings, providing education about blue carbon market projects, and supporting a community-led design.",
  },
  blueCarbonProjectPlanning: {
    label: "Blue carbon project planning",
    unit: "$/project",
    tooltipContent:
      "The preparation of the project design document (PD), which may include contracted services.",
  },
  establishingCarbonRights: {
    label: "Establishing carbon rights",
    unit: "$/yr",
    tooltipContent:
      "Legal expenses related to clarifying carbon rights, establishing conservation and community agreements, and packaging carbon benefits for legally valid sales.",
  },
  validation: {
    label: "Validation",
    unit: "$/project",
    tooltipContent:
      "The fee or price associated with the validation of the PD (e.g., by Verra).",
  },
  implementationLabor: {
    label: "Implementation labor",
    unit: "$/ha",
    tooltipContent:
      "Only applicable to restoration. The costs associated with labor and materials required for rehabilitating the degraded area (hydrology, planting or hybrid). Note: Certain countries, ecosystems and activity types don’t have implementation labor estimates.",
  },
  monitoring: {
    label: "Monitoring",
    unit: "$/yr",
    tooltipContent:
      "The expenses related to individuals moving throughout the project site to prevent degradation and report necessary actions/changes.",
  },
  maintenance: {
    label: "Maintenance",
    unit: "%",
    tooltipContent:
      "Only applicable to restoration. The costs associated with the physical upkeep of the original implementation, such as pest control, removing blockages, and rebuilding small portions.",
  },
  communityBenefitSharingFund: {
    label: "Landowner/community benefit share",
    unit: "%",
    tooltipContent:
      "Approximated as a percent (%) of the carbon credit revenues for the landowner/community residing where the project takes place. Best practice is to use the benefit share to meet the community's socio-economic and financial priorities, per the benefit sharing agreement. This benefit share may be used to compensate for alternative livelihoods and/or opportunity cost, which can be realized through goods, services, infrastructure, and/or cash.",
  },
  carbonStandardFees: {
    label: "Carbon standard fees",
    unit: "$/credit",
    tooltipContent:
      "Administrative fees charged by the carbon standard (e.g., Verra).",
  },
  baselineReassessment: {
    label: "Baseline reassessment",
    unit: "$/event",
    tooltipContent:
      "The costs associated with a third-party assessment to ensure the initial GHG emission/reduction estimates are accurate and remain so over time.",
  },
  mrv: {
    label: "MRV",
    unit: "$/event",
    tooltipContent:
      "The costs associated with measuring, reporting, and verifying GHG emissions that occur post-implementation to enable carbon benefit sales through a third party. Most standards require this at least every 5 years.",
  },
  longTermProjectOperatingCost: {
    label: "Long term project operating cost",
    unit: "$/yr",
    tooltipContent:
      "The expenses related to project oversight, vendor coordination, community engagement, stakeholder management, etc., during the ongoing operating years of the project.",
  },
  financingCost: {
    label: "Financing cost",
    unit: "%",
    tooltipContent:
      "The time, effort, and cost associated with securing financing for the set-up phase of the project.",
  },
} as const;
