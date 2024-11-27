// TODO: First approach to get the summary and yearly cost breakdown, the cost calculator is already way too big and complex
import {
  CostPlanMap,
  CostPlans,
} from '@api/modules/calculations/cost.calculator';
import { sum } from 'lodash';
import { SequestrationRateCalculator } from '@api/modules/calculations/sequestration-rate.calculator';

export class SummaryGenerator {
  costs: CostPlans;
  capexCostPlan: CostPlanMap;
  opexCostPlan: CostPlanMap;
  discountRate: number;
  totalCapexNPV: number;
  totalOpexNPV: number;
  totalNPV: number;
  sequestrationRateCalculator: SequestrationRateCalculator;
  constructor(
    costs: CostPlans,
    capexCostPlan: CostPlanMap,
    opexCostPlan: CostPlanMap,
    discountRate: number,
    sequestrationRateCalculator: SequestrationRateCalculator,
  ) {
    this.costs = costs;
    this.capexCostPlan = capexCostPlan;
    this.opexCostPlan = opexCostPlan;
    this.discountRate = discountRate;
    this.totalCapexNPV = this.calculateNpv(capexCostPlan, discountRate);
    this.totalOpexNPV = sum(Object.values(opexCostPlan));
    this.totalNPV = this.totalCapexNPV + this.totalOpexNPV;
    this.sequestrationRateCalculator = sequestrationRateCalculator;
  }
  calculateNpv(
    costPlan: CostPlanMap,
    discountRate: number,
    actualYear: number = -4,
  ): number {
    let npv = 0;

    for (const yearStr in costPlan) {
      const year = Number(yearStr);
      const cost = costPlan[year];

      if (year === actualYear) {
        npv += cost;
      } else if (year > 0) {
        npv += cost / Math.pow(1 + discountRate, year + (-actualYear - 1));
      } else {
        npv += cost / Math.pow(1 + discountRate, -actualYear + year);
      }
    }

    return npv;
  }

  // TODO: strongly type this and share it
  getCostEstimates(): any {
    return {
      costEstimatesUds: {
        total: {
          capitalExpenditure: sum(Object.values(this.capexCostPlan)),
          feasibilityAnalysis: sum(
            Object.values(this.costs.feasibilityAnalysis),
          ),
          conservationPlanningAndAdmin: sum(
            Object.values(this.costs.conservationPlanningAndAdmin),
          ),
          dataCollectionAndFieldCost: sum(
            Object.values(this.costs.dataCollectionAndFieldCost),
          ),
          communityRepresentation: sum(
            Object.values(this.costs.communityRepresentation),
          ),
          blueCarbonProjectPlanning: sum(
            Object.values(this.costs.blueCarbonProjectPlanning),
          ),
          establishingCarbonRights: sum(
            Object.values(this.costs.establishingCarbonRights),
          ),
          validation: sum(Object.values(this.costs.validation)),
          implementationLabor: sum(
            Object.values(this.costs.implementationLabor),
          ),
          operationExpenditure: sum(Object.values(this.opexCostPlan)),
          monitoring: sum(Object.values(this.costs.monitoring)),
          maintenance: sum(Object.values(this.costs.maintenance)),
          communityBenefitSharingFund: sum(
            Object.values(this.costs.communityBenefitSharingFund),
          ),
          carbonStandardFees: sum(Object.values(this.costs.carbonStandardFees)),
          baselineReassessment: sum(
            Object.values(this.costs.baselineReassessment),
          ),
          mrv: sum(Object.values(this.costs.mrv)),
          longTermProjectOperatingCost: sum(
            Object.values(this.costs.longTermProjectOperatingCost),
          ),
          totalCost:
            sum(Object.values(this.capexCostPlan)) +
            sum(Object.values(this.opexCostPlan)),
        },
        npv: {
          capitalExpenditure: this.totalCapexNPV,
          feasibilityAnalysis: this.calculateNpv(
            this.costs.feasibilityAnalysis,
            this.discountRate,
          ),
          conservationPlanningAndAdmin: this.calculateNpv(
            this.costs.conservationPlanningAndAdmin,
            this.discountRate,
          ),
          dataCollectionAndFieldCost: this.calculateNpv(
            this.costs.dataCollectionAndFieldCost,
            this.discountRate,
          ),
          communityRepresentation: this.calculateNpv(
            this.costs.communityRepresentation,
            this.discountRate,
          ),
          blueCarbonProjectPlanning: this.calculateNpv(
            this.costs.blueCarbonProjectPlanning,
            this.discountRate,
          ),
          establishingCarbonRights: this.calculateNpv(
            this.costs.establishingCarbonRights,
            this.discountRate,
          ),
          validation: this.calculateNpv(
            this.costs.validation,
            this.discountRate,
          ),
          implementationLabor: this.calculateNpv(
            this.costs.implementationLabor,
            this.discountRate,
          ),
          operationExpenditure: this.totalOpexNPV,
          monitoring: this.calculateNpv(
            this.costs.monitoring,
            this.discountRate,
          ),
          maintenance: this.calculateNpv(
            this.costs.maintenance,
            this.discountRate,
          ),
          communityBenefitSharingFund: this.calculateNpv(
            this.costs.communityBenefitSharingFund,
            this.discountRate,
          ),
          carbonStandardFees: this.calculateNpv(
            this.costs.carbonStandardFees,
            this.discountRate,
          ),
          baselineReassessment: this.calculateNpv(
            this.costs.baselineReassessment,
            this.discountRate,
          ),
          mrv: this.calculateNpv(this.costs.mrv, this.discountRate),
          longTermProjectOperatingCost: this.calculateNpv(
            this.costs.longTermProjectOperatingCost,
            this.discountRate,
          ),
          totalCost: this.totalOpexNPV + this.totalCapexNPV,
        },
      },
    };
  }

  getSummary(): any {
    return {
      '$/tCO2e (total cost, NPV': null,
      '$/ha': null,
      'Leftover after OpEx / total cost': null,
      'NPV covering cost': null,
      'IRR when priced to cover OpEx': null,
      'IRR when priced to cover total cost': null,
      'Total cost (NPV)': this.totalNPV,
      'Capital expenditure (NPV)': this.totalCapexNPV,
      'Operating expenditure (NPV)': this.totalOpexNPV,
      'Credits issued': null,
      'Total revenue (NPV)': null,
      'Total revenue (non-discounted)': null,
      'Financing cost': null,
      'Funding gap': null,
      'Funding gap (NPV)': null,
      'Funding gap per tCO2e (NPV)': null,
      'Community benefit sharing fund': null,
    };
  }
}
