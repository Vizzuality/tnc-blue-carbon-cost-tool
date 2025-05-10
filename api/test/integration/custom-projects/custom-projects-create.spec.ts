import { TestManager } from '../../utils/test-manager';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';
import { RestorationCreateCustomProjectDTO } from './fixtures';

describe('Create Custom Projects - Setup', () => {
  let testManager: TestManager;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    const { jwtToken } = await testManager.setUpTestUser();
    await testManager.ingestCountries();
    await testManager.ingestProjectScoreCards(jwtToken);
    await testManager.ingestExcel(jwtToken);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  describe('Conservation project', () => {
    test('Should do the computations for a given custom conservation project', async () => {
      const response = await testManager
        .request()
        .post(customProjectContract.createCustomProject.path)
        .send({
          countryCode: 'IND',
          projectName: 'Conservation project',
          ecosystem: 'Mangrove',
          activity: 'Conservation',
          projectSizeHa: 10000,
          carbonRevenuesToCover: 'Opex',
          initialCarbonPriceAssumption: 20,
          assumptions: {
            verificationFrequency: 5,
            baselineReassessmentFrequency: 10,
            discountRate: 0.04,
            // restorationRate: 250,
            carbonPriceIncrease: 0.015,
            buffer: 0.2,
            projectLength: 20,
          },
          costInputs: {
            feasibilityAnalysis: 50000,
            conservationPlanningAndAdmin: 166766.666666667,
            dataCollectionAndFieldCost: 26666.6666666667,
            communityRepresentation: 67633.3333333333,
            blueCarbonProjectPlanning: 100000,
            establishingCarbonRights: 46666.6666666667,
            validation: 50000,
            implementationLabor: 0,
            monitoring: 8400,
            maintenance: 0.0833,
            communityBenefitSharingFund: 0.5,
            carbonStandardFees: 0.2,
            baselineReassessment: 40000,
            mrv: 75000,
            longTermProjectOperatingCost: 22200,
            financingCost: 0.05,
          },
          parameters: {
            lossRateUsed: 'Project specific',
            emissionFactorUsed: 'Tier 2 - Country-specific emission factor',
            projectSpecificEmission: 'One emission factor',
            projectSpecificLossRate: -0.001,
            projectSpecificEmissionFactor: 0,
            emissionFactorAGB: 0,
            emissionFactorSOC: 0,
          },
        });

      expect(response.status).toBe(201);
      const responseData = response.body.data;
      // Values after the excel/model migration
      // expect(responseData.totalCostNPV).toEqual(2735614.8569899863);
      expect(responseData.totalCostNPV).toEqual(2735327.4666152457);
      // expect(responseData.totalCost).toEqual(3932640.485410141);
      expect(responseData.totalCost).toEqual(3932111.1306914072);
      // expect(responseData.breakevenTotalCost).toEqual(3555542.034883479);
      expect(responseData.breakevenTotalCost).toEqual(3555520.043565897);
      // expect(responseData.breakevenTotalCostNPV).toEqual(2528399.502417404);
      expect(responseData.breakevenTotalCostNPV).toEqual(2528390.040644521);
      const output = responseData.output;
      // expect(output.breakevenPriceComputationOutput.initialCarbonPrice).toEqual(
      //   15.031201985489698,
      // );
      expect(output.breakevenPriceComputationOutput.initialCarbonPrice).toEqual(
        15.0361842060739,
      );
      const yearlyBreakdown =
        output.initialCarbonPriceComputationOutput.yearlyBreakdown;
      for (const breakdown of yearlyBreakdown) {
        expect(breakdown.costValues[0]).toBeUndefined();
      }
      expect(
        responseData.output.initialCarbonPriceComputationOutput
          .initialCarbonPrice,
      ).toEqual(20);
    });
  });
});
