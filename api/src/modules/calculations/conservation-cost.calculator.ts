import { ConservationProject } from '@api/modules/custom-projects/conservation.project';
import { DEFAULT_STUFF } from '@api/modules/custom-projects/project-config.interface';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import { BaseSize } from '@shared/entities/base-size.entity';
import { SequestrationRatesCalculator } from '@api/modules/calculations/sequestration-rate.calculator';
import { RESTORATION_ACTIVITY_SUBTYPE } from '@shared/entities/projects.entity';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { RevenueProfitCalculator } from '@api/modules/calculations/revenue-profit.calculators';
import { Finance } from 'financejs';

export class ConservationCostCalculator {
  project: ConservationProject;
  // TODO: Project length and starting point scaling depend on the activity and it seems to only be used in the calculation, so we can probably remove it from project instantiation
  conservationProjectLength: number = DEFAULT_STUFF.CONSERVATION_PROJECT_LENGTH;
  startingPointScaling: number =
    DEFAULT_STUFF.CONSERVATION_STARTING_POINT_SCALING;
  defaultProjectLength: number = DEFAULT_STUFF.DEFAULT_PROJECT_LENGTH;
  restorationRate: number = DEFAULT_STUFF.RESTORATION_RATE;
  discountRate: number = DEFAULT_STUFF.DISCOUNT_RATE;
  // TODO: Maybe instead of using capexTotal and opexTotal, we can use just totalCostPlan if the only difference is the type of cost
  baselineReassessmentFrequency: number =
    DEFAULT_STUFF.BASELINE_REASSESSMENT_FREQUENCY;
  capexTotalCostPlan: { [year: number]: number } = {};
  opexTotalCostPlan: { [year: number]: number } = {};
  totalCostPlan: { [year: number]: number } = {};
  totalCapex: number;
  totalCapexNPV: number;
  totalOpexNPV: number;
  totalNPV: number;
  baseIncrease: BaseIncrease;
  baseSize: BaseSize;
  public sequestrationCreditsCalculator: SequestrationRatesCalculator;
  public revenueProfitCalculator: RevenueProfitCalculator;
  estimatedRevenuePlan: { [year: number]: number } = {};
  totalRevenue: number;
  totalRevenueNPV: number;
  totalCreditsPlan: { [year: number]: number } = {};
  creditsIssued: number;
  costPertCO2eSequestered: number;
  costPerHa: number;
  NPVCoveringCosts: number;
  financingCost: number;
  fundingGapNPV: number;
  fundingGapPerTCO2NPV: number;
  communityBenefitSharingFundPlan: { [year: number]: number } = {};
  totalCommunityBenefitSharingFundNPV: number;
  communityBenefitSharingFund: number;
  fundingGap: number;
  IRROpex: number;
  IRRTotalCost: number;
  proforma: any;
  constructor(
    project: ConservationProject,
    baseIncrease: BaseIncrease,
    baseSize: BaseSize,
  ) {
    this.project = project;
    this.sequestrationCreditsCalculator = new SequestrationRatesCalculator(
      project,
      this.conservationProjectLength,
      this.defaultProjectLength,
      ACTIVITY.CONSERVATION,
      RESTORATION_ACTIVITY_SUBTYPE.PLANTING,
    );
    this.revenueProfitCalculator = new RevenueProfitCalculator(
      this.project,
      this.conservationProjectLength,
      this.defaultProjectLength,
      this.sequestrationCreditsCalculator,
    );
    this.baseIncrease = baseIncrease;
    this.baseSize = baseSize;
    this.capexTotalCostPlan = this.initializeCostPlan();
    this.opexTotalCostPlan = this.initializeCostPlan();
    this.totalCostPlan = this.initializeCostPlan();
    this.calculateCapexTotal();
    this.calculateOpexTotal();
    this.totalCapex = Object.values(this.capexTotalCostPlan).reduce(
      (sum, value) => sum + value,
      0,
    );
    this.totalCapexNPV = this.calculateNPV(
      this.capexTotalCostPlan,
      this.discountRate,
    );
    this.totalOpexNPV = this.calculateNPV(
      this.opexTotalCostPlan,
      this.discountRate,
    );
    this.totalNPV = this.totalCapexNPV + this.totalOpexNPV;

    this.estimatedRevenuePlan =
      this.revenueProfitCalculator.calculateEstimatedRevenue();
    this.totalRevenue = Object.values(this.estimatedRevenuePlan).reduce(
      (sum, value) => sum + value,
      0,
    );
    this.totalRevenueNPV = this.calculateNPV(
      this.estimatedRevenuePlan,
      this.discountRate,
    );
    this.totalCreditsPlan =
      this.sequestrationCreditsCalculator.calculateEstimatedCreditsIssued();
    this.creditsIssued = Object.values(this.totalCreditsPlan).reduce(
      (sum, value) => sum + value,
      0,
    );
    this.costPertCO2eSequestered = this.totalNPV / this.creditsIssued;
    this.costPerHa = this.totalNPV / this.project.projectSizeHa;
    this.NPVCoveringCosts =
      this.project.carbonRevenuesToCover === 'Opex'
        ? this.totalRevenueNPV - this.totalOpexNPV
        : this.totalRevenueNPV - this.totalCapexNPV;

    this.financingCost =
      this.project.costInputs.financingCost * this.totalCapex;

    this.fundingGapNPV = this.NPVCoveringCosts < 0 ? -this.NPVCoveringCosts : 0;
    this.fundingGapPerTCO2NPV = this.fundingGapNPV / this.creditsIssued;
    this.communityBenefitSharingFundPlan =
      this.calculateCommunityBenefitSharingFund();
    this.totalCommunityBenefitSharingFundNPV = this.calculateNPV(
      this.communityBenefitSharingFundPlan,
      this.project.discountRate,
    );
    this.communityBenefitSharingFund =
      this.totalCommunityBenefitSharingFundNPV / this.totalRevenueNPV;

    const referenceNPV =
      this.project.carbonRevenuesToCover === 'Opex'
        ? this.totalOpexNPV
        : this.totalNPV;
    this.fundingGap = this.calculateFundingGap(
      referenceNPV,
      this.totalRevenueNPV,
    );

    this.IRROpex = this.calculateIRR(
      this.revenueProfitCalculator.calculateAnnualNetCashFlow(
        this.capexTotalCostPlan,
        this.opexTotalCostPlan,
      ),
      this.revenueProfitCalculator.calculateAnnualNetIncome(
        this.opexTotalCostPlan,
      ),
      false,
    );

    this.IRRTotalCost = this.calculateIRR(
      this.revenueProfitCalculator.calculateAnnualNetCashFlow(
        this.capexTotalCostPlan,
        this.opexTotalCostPlan,
      ),
      this.revenueProfitCalculator.calculateAnnualNetIncome(
        this.opexTotalCostPlan,
      ),
      true,
    );
    this.proforma = this.getYearlyCostBreakdown();
  }

  private initializeCostPlan(): { [year: number]: number } {
    const costPlan: { [year: number]: number } = {};
    for (let i = -4; i <= this.defaultProjectLength; i++) {
      if (i !== 0) {
        costPlan[i] = 0;
      }
    }
    return costPlan;
  }

  // TODO: CAPEX TOTAL
  private calculateCapexTotal(): { [year: number]: number } {
    const costFunctions = [
      this.calculateFeasibilityAnalysisCost,
      this.calculateConservationPlanningAndAdmin,
      this.calculateDataCollectionAndFieldCost,
      this.calculateCommunityRepresentation,
      this.calculateBlueCarbonProjectPlanning,
      this.calculateEstablishingCarbonRights,
      this.calculateValidation,
      this.calculateImplementationLabor,
    ];

    for (const costFunc of costFunctions) {
      const costPlan = costFunc.call(this);
      this.aggregateCosts(costPlan, this.capexTotalCostPlan);
    }

    return this.capexTotalCostPlan;
  }

  private calculateFeasibilityAnalysisCost(): { [year: number]: number } {
    const totalBaseCost = this.calculateCostPlan('feasibilityAnalysis');
    const feasibilityAnalysisCostPlan = this.createSimplePlan(totalBaseCost, [
      -4,
    ]);
    return feasibilityAnalysisCostPlan;
  }

  private calculateConservationPlanningAndAdmin(): { [year: number]: number } {
    const totalBaseCost = this.calculateCostPlan(
      'conservationPlanningAndAdmin',
    );
    const conservationPlanningAndAdminCostPlan = this.createSimplePlan(
      totalBaseCost,
      [-4, -3, -2, -1],
    );
    return conservationPlanningAndAdminCostPlan;
  }

  private calculateDataCollectionAndFieldCost(): { [year: number]: number } {
    const totalBaseCost = this.calculateCostPlan('dataCollectionAndFieldCost');
    const dataCollectionAndFieldCostPlan = this.createSimplePlan(
      totalBaseCost,
      [-4, -3, -2],
    );
    return dataCollectionAndFieldCostPlan;
  }

  private calculateCommunityRepresentation(): { [year: number]: number } {
    const totalBaseCost = this.calculateCostPlan('communityRepresentation');
    const projectDevelopmentType =
      this.project.costInputs.projectDevelopmentType;
    const initialCostPlan =
      projectDevelopmentType === 'Development' ? totalBaseCost : 0;
    const communityRepresentationCostPlan = this.createSimplePlan(
      totalBaseCost,
      [-4, -3, -2],
    );
    communityRepresentationCostPlan[-4] = initialCostPlan;
    return communityRepresentationCostPlan;
  }

  private calculateBlueCarbonProjectPlanning(): { [year: number]: number } {
    const totalBaseCost = this.calculateCostPlan('blueCarbonProjectPlanning');
    const blueCarbonProjectPlanningCostPlan = this.createSimplePlan(
      totalBaseCost,
      [-1],
    );
    return blueCarbonProjectPlanningCostPlan;
  }

  private calculateEstablishingCarbonRights(): { [year: number]: number } {
    const totalBaseCost = this.calculateCostPlan('establishingCarbonRights');
    const establishingCarbonRightsCostPlan = this.createSimplePlan(
      totalBaseCost,
      [-3, -2, -1],
    );
    return establishingCarbonRightsCostPlan;
  }

  private calculateValidation(): { [year: number]: number } {
    const totalBaseCost = this.calculateCostPlan('validation');
    const validationCostPlan = this.createSimplePlan(totalBaseCost, [-1]);
    return validationCostPlan;
  }

  private calculateImplementationLabor(): { [year: number]: number } {
    const baseCost = this.project.costInputs.implementationLabor;

    const areaRestoredOrConservedPlan =
      this.sequestrationCreditsCalculator.calculateAreaRestoredOrConserved();
    const implementationLaborCostPlan: { [year: number]: number } = {};

    for (let year = -4; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        implementationLaborCostPlan[year] = 0;
      }
    }

    for (let year = 1; year <= this.conservationProjectLength; year++) {
      const laborCost =
        baseCost *
        ((areaRestoredOrConservedPlan[year] || 0) -
          (areaRestoredOrConservedPlan[year - 1] || 0));
      implementationLaborCostPlan[year] = laborCost;
    }

    return implementationLaborCostPlan;
  }

  // TODO: OPEX TOTAL COST CALCULATION
  private calculateOpexTotal(): { [year: number]: number } {
    const costFunctions = [
      this.calculateMonitoring,
      this.calculateMaintenance,
      this.calculateCommunityBenefitSharingFund,
      this.calculateCarbonStandardFees,
      this.calculateBaselineReassessment,
      this.calculateMRV,
      this.calculateLongTermProjectOperating,
    ];

    for (const costFunc of costFunctions) {
      try {
        const costPlan = costFunc.call(this);
        this.aggregateCosts(costPlan, this.opexTotalCostPlan);
      } catch (error) {
        console.error(`Error calculating ${costFunc.name}`);
      }
    }

    return this.opexTotalCostPlan;
  }

  private calculateMonitoring(): { [year: number]: number } {
    const totalBaseCost = this.calculateCostPlan('monitoring');
    const monitoringCostPlan: { [year: number]: number } = {};

    for (let year = -4; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        monitoringCostPlan[year] =
          year >= 1 && year <= this.defaultProjectLength ? totalBaseCost : 0;
      }
    }

    return monitoringCostPlan;
  }

  private calculateMaintenance(): { [year: number]: number } {
    const baseCost = this.project.costInputs.maintenance;
    const maintenanceDuration = this.project.costInputs.maintenanceDuration;
    const implementationLaborCostPlan = this.calculateImplementationLabor();
    // TODO: Should I get the first year where value is 0 where key is greater or equal than 1?
    const firstZeroValue = Number(
      Object.keys(implementationLaborCostPlan).find((key) => {
        return implementationLaborCostPlan[key] === 0 && Number(key) >= 1;
      }),
    );
    let maintenanceEndYear: number;
    if (this.project.costInputs.projectSizeHa / this.restorationRate <= 20) {
      maintenanceEndYear = firstZeroValue + maintenanceDuration - 1;
    } else {
      maintenanceEndYear = this.defaultProjectLength + maintenanceDuration;
    }
    const maintenanceCostPlan: { [year: number]: number } = {};

    // Initialize the cost plan with zeros
    for (let year = -4; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        maintenanceCostPlan[year] = 0;
      }
    }
    // For Conservation projects, apply the base cost over the project length
    for (let year = 1; year <= this.conservationProjectLength; year++) {
      if (year <= maintenanceEndYear) {
        maintenanceCostPlan[year] = baseCost;
      }
    }

    return maintenanceCostPlan;
  }

  private calculateCommunityBenefitSharingFund(): { [year: number]: number } {
    const baseCost = this.project.costInputs.communityBenefitSharingFund;
    const communityBenefitSharingFundCostPlan: { [year: number]: number } = {};

    for (let year = -4; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        communityBenefitSharingFundCostPlan[year] = 0;
      }
    }
    // TODO: This needs RevenueProfitCalculator to be implemented

    const estimatedRevenue: { [year: number]: number } =
      this.revenueProfitCalculator.calculateEstimatedRevenue() || {};

    for (const year in communityBenefitSharingFundCostPlan) {
      if (+year <= this.conservationProjectLength) {
        communityBenefitSharingFundCostPlan[+year] =
          (estimatedRevenue[+year] || 0) * baseCost;
      }
    }

    return communityBenefitSharingFundCostPlan;
  }

  private calculateCarbonStandardFees(): { [year: number]: number } {
    const baseCost = this.project.costInputs.carbonStandardFees;
    const carbonStandardFeesCostPlan: { [year: number]: number } = {};

    for (let year = -4; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        carbonStandardFeesCostPlan[year] = 0;
      }
    }
    const estimatedCreditsIssued: { [year: number]: number } =
      this.sequestrationCreditsCalculator.calculateEstimatedCreditsIssued() ||
      {};

    for (let year = 1; year <= this.conservationProjectLength; year++) {
      carbonStandardFeesCostPlan[year] =
        (estimatedCreditsIssued[year] || 0) * baseCost;
    }

    return carbonStandardFeesCostPlan;
  }

  private calculateBaselineReassessment(): { [year: number]: number } {
    const baseCost = this.project.costInputs.baselineReassessment;
    const baselineReassessmentCostPlan: { [year: number]: number } = {};

    for (let year = -4; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        baselineReassessmentCostPlan[year] = 0;
      }
    }

    for (let year = 1; year <= this.conservationProjectLength; year++) {
      if (year % this.baselineReassessmentFrequency === 0) {
        baselineReassessmentCostPlan[year] = baseCost;
      }
    }

    return baselineReassessmentCostPlan;
  }

  private calculateMRV(): { [year: number]: number } {
    const baseCost = this.project.costInputs.mrv;
    const mrvCostPlan: { [year: number]: number } = {};

    for (let year = -4; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        mrvCostPlan[year] = 0;
      }
    }

    for (let year = 1; year <= this.conservationProjectLength; year++) {
      if (year % this.project.verificationFrequency === 0) {
        mrvCostPlan[year] = baseCost;
      }
    }

    return mrvCostPlan;
  }

  private calculateLongTermProjectOperating(): { [year: number]: number } {
    const baseCost = this.project.costInputs.longTermProjectOperating;
    const longTermProjectOperatingCostPlan: { [year: number]: number } = {};

    for (let year = -4; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        longTermProjectOperatingCostPlan[year] = 0;
      }
    }

    for (let year = 1; year <= this.conservationProjectLength; year++) {
      longTermProjectOperatingCostPlan[year] = baseCost;
    }

    return longTermProjectOperatingCostPlan;
  }

  private aggregateCosts(
    costPlan: { [year: number]: number },
    totalCostPlan: { [year: number]: number },
  ): void {
    for (const yearStr of Object.keys(costPlan)) {
      const year = Number(yearStr);
      totalCostPlan[year] += costPlan[year];
    }
  }

  private calculateCostPlan(baseKey: any): number {
    const increasedBy: number = parseFloat(this.baseIncrease[baseKey]);
    const baseCostValue: number = parseFloat(this.baseSize[baseKey]);
    const sizeDifference =
      this.project.projectSizeHa - this.startingPointScaling;
    const value = Math.max(Math.round(sizeDifference / baseCostValue), 0);

    const totalBaseCost = baseCostValue + increasedBy * value * baseCostValue;
    return totalBaseCost;
  }

  private createSimplePlan(
    totalBaseCost: number,
    years?: number[],
  ): { [year: number]: number } {
    if (!years) {
      years = [-4, -3, -2, -1];
    }
    const plan: { [year: number]: number } = {};
    for (const year of years) {
      plan[year] = totalBaseCost;
    }
    return plan;
  }

  private calculateNPV(
    costPlan: { [year: number]: number },
    discountRate: number,
    actualYear: number = -4,
  ): number {
    let npv = 0;

    for (const [yearStr, cost] of Object.entries(costPlan)) {
      const year = Number(yearStr);

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

  private calculateFundingGap(
    referenceNPV: number,
    totalRevenueNPV: number,
  ): number {
    const value = totalRevenueNPV - referenceNPV;
    if (value > 0) {
      return 0;
    }
    return -value;
  }

  calculateIRR(
    netCashFlow: { [year: number]: number },
    netIncome: { [year: number]: number },
    useCapex: boolean = false,
  ): number {
    const finance = new Finance();
    const cashFlowArray = useCapex
      ? Object.values(netCashFlow)
      : Object.values(netIncome);
    const [cfs, ...cashFlows] = cashFlowArray;

    // TODO: On first tests, I am only getting negavite values for cashFlows, so the library crashes. For now I am setting them to 0
    let irr: number;
    try {
      irr = finance.IRR(cfs, ...cashFlows);
    } catch (error) {
      irr = 0;
    }

    return irr;
  }

  getYearlyCostBreakdown(): any[] {
    // Helper function to extend the cost plan for each year
    const extendCostPlan = (costPlan: { [year: number]: number }): number[] => {
      return Array.from({ length: this.conservationProjectLength + 4 })
        .map((_, idx) => idx - 4)
        .filter((year) => year !== 0)
        .map((year) => costPlan[year] ?? 0);
    };

    // Define the years, including 'Total' and 'NPV'
    const years: (number | string)[] = [
      ...Array.from({ length: this.conservationProjectLength + 4 })
        .map((_, idx) => idx - 4)
        .filter((year) => year !== 0),
      'Total',
      'NPV',
    ];

    // Extend the cost plans for each category
    const costPlans = {
      feasibility_analysis: this.calculateFeasibilityAnalysisCost(),
      conservation_planning_and_admin:
        this.calculateConservationPlanningAndAdmin(),
      data_collection_and_field: this.calculateDataCollectionAndFieldCost(),
      community_representation: this.calculateCommunityRepresentation(),
      blue_carbon_project_planning: this.calculateBlueCarbonProjectPlanning(),
      establishing_carbon_rights: this.calculateEstablishingCarbonRights(),
      validation: this.calculateValidation(),
      implementation_labor: this.calculateImplementationLabor(),
      monitoring: this.calculateMonitoring(),
      maintenance: this.calculateMaintenance(),
      community_benefit_sharing_fund:
        this.calculateCommunityBenefitSharingFund(),
      carbon_standard_fees: this.calculateCarbonStandardFees(),
      baseline_reassessment: this.calculateBaselineReassessment(),
      MRV: this.calculateMRV(),
      long_term_project_operating: this.calculateLongTermProjectOperating(),
      capex_total: this.capexTotalCostPlan,
      opex_total: this.opexTotalCostPlan,
    };

    // Negate costs to represent outflows
    for (const key in costPlans) {
      if (costPlans.hasOwnProperty(key)) {
        costPlans[key] = Object.fromEntries(
          Object.entries(costPlans[key]).map(([k, v]) => [Number(k), -v]),
        );
      }
    }

    // Create the extended cost structure
    const extendedCosts: { [key: string]: number[] } = {};
    for (const [name, plan] of Object.entries(costPlans)) {
      extendedCosts[name] = extendCostPlan(plan);
      extendedCosts[name].push(
        Object.values(plan).reduce((sum, value) => sum + value, 0), // Total
        this.calculateNPV(plan, this.project.discountRate), // NPV
      );
    }

    // Convert to array of objects with each year as a row
    return years.map((year, index) => {
      // @ts-ignore
      const row: { year: number; [key: string]: number } = { year };
      for (const [name, values] of Object.entries(extendedCosts)) {
        row[name] = values[index];
      }
      return row;
    });
  }

  getSummary(): { [key: string]: string } {
    return {
      Project: `${this.project.countryCode} ${this.project.ecosystem}\n${this.project.activity} (${this.project.projectSizeHa} ha)`,
      name: this.project.name,
      '$/tCO2e (total cost, NPV)': `$${this.costPertCO2eSequestered}`,
      '$/ha': `$${this.costPerHa}`,
      'NPV covering cost': `$${this.NPVCoveringCosts}`,
      'IRR when priced to cover opex': `${this.IRROpex * 100}%`,
      'IRR when priced to cover total costs': `${this.IRRTotalCost * 100}%`,
      'Total cost (NPV)': `$${this.totalNPV}`,
      'Capital expenditure (NPV)': `$${this.totalCapexNPV}`,
      'Operating expenditure (NPV)': `$${this.totalOpexNPV}`,
      'Credits issued': `${this.creditsIssued}`,
      'Total revenue (NPV)': `$${this.totalRevenueNPV}`,
      'Total revenue (non-discounted)': `$${this.totalRevenue}`,
      'Financing cost': `$${this.financingCost}`,
    };
  }

  getCostEstimates(): { costCategory: string; costEstimateUSD: string }[] {
    const costCategories = [
      {
        name: 'Feasibility Analysis',
        cost: this.calculateFeasibilityAnalysisCost(),
      },
      {
        name: 'Conservation Planning and Admin',
        cost: this.calculateConservationPlanningAndAdmin(),
      },
      {
        name: 'Data Collection and Field',
        cost: this.calculateDataCollectionAndFieldCost(),
      },
      {
        name: 'Community Representation',
        cost: this.calculateCommunityRepresentation(),
      },
      {
        name: 'Blue Carbon Project Planning',
        cost: this.calculateBlueCarbonProjectPlanning(),
      },
      {
        name: 'Establishing Carbon Rights',
        cost: this.calculateEstablishingCarbonRights(),
      },
      { name: 'OPEX Total Cost', cost: this.opexTotalCostPlan },
      { name: 'Monitoring', cost: this.calculateMonitoring() },
      { name: 'Maintenance', cost: this.calculateMaintenance() },
      {
        name: 'Community Benefit Sharing Fund',
        cost: this.calculateCommunityBenefitSharingFund(),
      },
      {
        name: 'Baseline Reassessment',
        cost: this.calculateNPV(
          this.calculateBaselineReassessment(),
          this.project.discountRate,
        ),
      },
      {
        name: 'MRV',
        cost: this.calculateNPV(this.calculateMRV(), this.project.discountRate),
      },
      {
        name: 'Long Term Project Operating',
        cost: this.calculateNPV(
          this.calculateLongTermProjectOperating(),
          this.project.discountRate,
        ),
      },
      {
        name: 'Total CAPEX + OPEX NPV',
        cost: this.totalCapexNPV + this.totalOpexNPV,
      },
    ];

    // Map cost estimates to a structured output
    return costCategories.map((category) => {
      const cost =
        typeof category.cost === 'object'
          ? Object.values(category.cost as { [year: number]: number }).reduce(
              (sum, value) => sum + value,
              0,
            )
          : category.cost;
      return {
        costCategory: category.name,
        costEstimateUSD: `$${cost.toLocaleString()}`,
      };
    });
  }
}
