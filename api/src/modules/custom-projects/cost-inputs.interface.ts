export interface CostInputs {
  feasibilityAnalysis: number;
  conservationPlanningAndAdmin: number;
  dataCollectionAndFieldCost: number;
  communityRepresentation: number;
  blueCarbonProjectPlanning: number;
  establishingCarbonRights: number;
  validation: number;
  implementationLabor: number;
  monitoring: number;
  maintenance: number;
  maintenanceDuration: number;
  communityBenefitSharingFund: number;
  carbonStandardFees: number;
  baselineReassessment: number;
  mrv: number;
  longTermProjectOperating: number;
  financingCost: number;
  lossRate?: number;
  emissionFactor?: number;
  // Not sure if projectSizeHa is a cost input
  projectSizeHa?: number;
  projectDevelopmentType?: string;
}
