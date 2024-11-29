import { TestManager } from '../../utils/test-manager';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';
import { HttpStatus } from '@nestjs/common';

describe('Snapshot Custom Projects', () => {
  let testManager: TestManager;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    const { jwtToken } = await testManager.setUpTestUser();
    await testManager.ingestCountries();
    await testManager.ingestExcel(jwtToken);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  describe('Persist custom project snapshot', () => {
    test.skip('Should persist a custom project in the DB', async () => {
      const response = await testManager
        .request()
        .post(customProjectContract.saveCustomProject.path)
        .send({
          inputSnapshot: {
            countryCode: 'IND',
            activity: 'Conservation',
            ecosystem: 'Mangrove',
            projectName: 'My custom project',
            projectSizeHa: 1000,
            initialCarbonPriceAssumption: 1000,
            carbonRevenuesToCover: 'Opex',
            parameters: {
              lossRateUsed: 'National average',
              emissionFactorUsed: 'Tier 2 - Country-specific emission factor',
            },
            costInputs: {
              feasibilityAnalysis: 50000,
              conservationPlanningAndAdmin: 166766.66666666666,
              dataCollectionAndFieldCost: 26666.666666666668,
              communityRepresentation: 71183.33333333333,
              blueCarbonProjectPlanning: 100000,
              establishingCarbonRights: 46666.666666666664,
              financingCost: 0.05,
              validation: 50000,
              implementationLaborHybrid: null,
              monitoring: 15000,
              maintenance: 0.0833,
              carbonStandardFees: 0.2,
              communityBenefitSharingFund: 0.5,
              baselineReassessment: 40000,
              mrv: 75000,
              longTermProjectOperatingCost: 26400,
            },
            assumptions: {
              verificationFrequency: 5,
              baselineReassessmentFrequency: 10,
              discountRate: 0.04,
              restorationRate: 250,
              carbonPriceIncrease: 0.015,
              buffer: 0.2,
              projectLength: 20,
            },
          },
          outputSnapshot: {
            projectLength: 20,
            annualProjectCashFlow: {
              feasibilityAnalysis: [1],
              conservationPlanningAndAdmin: [2],
              dataCollectionAndFieldCost: [3],
              communityRepresentation: [4],
              blueCarbonProjectPlanning: [5],
              establishingCarbonRights: [6],
              validation: [7],
              implementationLabor: [8],
              totalCapex: [9],
              monitoring: [10],
              maintenance: [11],
              communityBenefitSharingFund: [12],
              carbonStandardFees: [13],
              baselineReassessment: [14],
              mrv: [15],
              longTermProjectOperatingCost: [16],
              totalOpex: [17],
              totalCost: [18],
              estCreditsIssued: [19],
              estRevenue: [20],
              annualNetIncomeRevLessOpex: [21],
              cummulativeNetIncomeRevLessOpex: [22],
              fundingGap: [23],
              irrOpex: [24],
              irrTotalCost: [25],
              irrAnnualNetIncome: [26],
              annualNetCashFlow: [27],
            },
            projectSummary: {
              costPerTCO2e: 1000,
              costPerHa: 2000,
              leftoverAfterOpexTotalCost: 3000,
              irrCoveringOpex: 4000,
              irrCoveringTotalCost: 5000,
              totalCost: 6000,
              capitalExpenditure: 7000,
              operatingExpenditure: 8000,
              creditsIssued: 9000,
              totalRevenue: 10000,
              nonDiscountedTotalRevenue: 1000,
              financingCost: 2000,
              foundingGap: 3000,
              foundingGapPerTCO2e: 4000,
              communityBenefitSharingFundRevenuePc: 40,
            },
            costDetails: [],
          },
        });

      expect(response.status).toBe(HttpStatus.CREATED);
    });
  });
});
