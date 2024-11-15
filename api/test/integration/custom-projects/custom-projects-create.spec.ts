import { TestManager } from '../../utils/test-manager';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';

describe('Create Custom Projects - Setup', () => {
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

  describe('TEMPORAL, FOR REFERENCE', () => {
    test('Should generate a conservation project input object that will be used for calculations', async () => {
      const response = await testManager
        .request()
        .post(customProjectContract.createCustomProject.path)
        .send({
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
        });

      expect(response.body).toMatchObject({
        data: {
          carbonInputs: {
            lossRate: -0.0016,
            emissionFactor: null,
            emissionFactorAgb: 67.7,
            emissionFactorSoc: 85.5,
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
          modelAssumptions: {
            verificationFrequency: 5,
            baselineReassessmentFrequency: 10,
            discountRate: 0.04,
            restorationRate: 250,
            carbonPriceIncrease: 0.015,
            buffer: 0.2,
            projectLength: 20,
          },
          projectName: 'My custom project',
          countryCode: 'IND',
          activity: 'Conservation',
          ecosystem: 'Mangrove',
          projectSizeHa: 1000,
          initialCarbonPriceAssumption: 1000,
          carbonRevenuesToCover: 'Opex',
        },
      });
    });
  });
});
