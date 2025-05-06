import { PROJECT_EMISSION_FACTORS } from '@shared/entities/custom-project.entity';
import { TestManager } from '../../utils/test-manager';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';
import { RestorationCreateCustomProjectDTO } from './fixtures';

describe('Create Custom Projects - Request Validations', () => {
  let testManager: TestManager;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
  });

  afterAll(async () => {
    await testManager.close();
  });

  describe('General Custom Project Validations', () => {
    test('Should fail if common project parameters are not provided', async () => {
      const response = await testManager
        .request()
        .post(customProjectContract.createCustomProject.path)
        .send({});

      const errors = response.body.errors;
      expect(errors).toHaveLength(1);
      expect(errors[0]).toStrictEqual(
        expect.objectContaining({
          status: '400',
          title:
            "Invalid discriminator value. Expected 'Conservation' | 'Restoration'",
        }),
      );
    });
  });
  describe('Conservation Project Validations', () => {
    test('Loss Rate Used should be National Average or Project Specific', async () => {
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
            lossRateUsed: 'Invalid',
            emissionFactorUsed: 'Tier 1 - Global emission factor',
          },
        });

      const errors = response.body.errors;
      expect(errors[0]).toStrictEqual(
        expect.objectContaining({
          status: '400',
          title: 'Required',
          detail:
            '{"code":"invalid_type","expected":"object","received":"undefined","path":["assumptions"],"message":"Required"}',
        }),
      );
      expect(errors[1]).toStrictEqual(
        expect.objectContaining({
          status: '400',
          title: 'Required',
          detail:
            '{"code":"invalid_type","expected":"object","received":"undefined","path":["costInputs"],"message":"Required"}',
        }),
      );
      expect(errors[2]).toStrictEqual(
        expect.objectContaining({
          status: '400',
          title:
            "Invalid enum value. Expected 'National average' | 'Project specific', received 'Invalid'",
        }),
      );
      expect(errors[3]).toStrictEqual(
        expect.objectContaining({
          status: '400',
          title: 'Required',
          detail: `{"expected":"'One emission factor' | 'Two emission factors'","received":"undefined","code":"invalid_type","path":["parameters","projectSpecificEmission"],"message":"Required"}`,
        }),
      );
    });
    test('If Loss Rate used is Project Specific, Project Specific Loss Rate should be provided and be negative', async () => {
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
            lossRateUsed: 'Project specific',
            emissionFactorUsed: 'Tier 1 - Global emission factor',
            projectSpecificLossRate: 0.5,
          },
        });

      expect(response.body.errors).toBeDefined();
      const expectedError = response.body.errors.map(
        (err) => err.title === 'Project Specific Loss Rate must be negative',
      );
      expect(expectedError).toBeDefined();
    });
    test('If Emission Factor Used is Tier 2, only Mangroves is accepted as ecosystem', async () => {
      const res = await testManager
        .request()
        .post(customProjectContract.createCustomProject.path)
        .send({
          countryCode: 'IND',
          activity: 'Conservation',
          ecosystem: 'Seagrass',
          projectName: 'My custom project',
          projectSizeHa: 1000,
          initialCarbonPriceAssumption: 1000,
          carbonRevenuesToCover: 'Opex',
          parameters: {
            lossRateUsed: 'National average',
            emissionFactorUsed: PROJECT_EMISSION_FACTORS.TIER_2,
            projectSpecificEmission: 'One emission factor',
          },
          assumptions: {
            verificationFrequency: 1,
            baselineReassessmentFrequency: 1,
            discountRate: 1,
            restorationRate: 1,
            carbonPriceIncrease: 1,
            buffer: 1,
            projectLength: 1,
          },
          costInputs: {
            feasibilityAnalysis: 1,
            conservationPlanningAndAdmin: 1,
            dataCollectionAndFieldCost: 1,
            communityRepresentation: 1,
            blueCarbonProjectPlanning: 1,
            establishingCarbonRights: 1,
            validation: 1,
            implementationLabor: 1,
            monitoring: 1,
            maintenance: 1,
            communityBenefitSharingFund: 1,
            carbonStandardFees: 1,
            baselineReassessment: 1,
            mrv: 1,
            longTermProjectOperatingCost: 1,
            financingCost: 1,
          },
        });

      expect(res.body.errors[0].title).toEqual(
        'There is only Tier 2 emission factor for Mangrove ecosystems',
      );
    });
    test('If Emission Factor Used is Tier 3 and Project Specific Emission is Two Emission Factors, AGB and SOC should be provided', async () => {
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
            emissionFactorUsed: PROJECT_EMISSION_FACTORS.TIER_3,
            projectSpecificEmission: 'Two emission factors',
          },
          assumptions: {
            verificationFrequency: 1,
            baselineReassessmentFrequency: 1,
            discountRate: 1,
            restorationRate: 1,
            carbonPriceIncrease: 1,
            buffer: 1,
            projectLength: 1,
          },
          costInputs: {
            feasibilityAnalysis: 1,
            conservationPlanningAndAdmin: 1,
            dataCollectionAndFieldCost: 1,
            communityRepresentation: 1,
            blueCarbonProjectPlanning: 1,
            establishingCarbonRights: 1,
            validation: 1,
            implementationLabor: 1,
            monitoring: 1,
            maintenance: 1,
            communityBenefitSharingFund: 1,
            carbonStandardFees: 1,
            baselineReassessment: 1,
            mrv: 1,
            longTermProjectOperatingCost: 1,
            financingCost: 1,
          },
        });
      const errorTitles = response.body.errors.map((error) => error.title);
      expect(errorTitles).toEqual(
        expect.arrayContaining([
          'Emission Factor AGB is required when emissionFactorUsed is Tier 3 and projectSpecificEmission is Two emission factors',
          'Emission Factor SOC is required when emissionFactorUsed is Tier 3 and projectSpecificEmission is Two emission factors',
        ]),
      );
    });
    test('If Emission Factor Used is Tier 3 and Project Specific Emission is One Emission Factor, then Project Specific Emission Factor should be provided', async () => {
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
            emissionFactorUsed: PROJECT_EMISSION_FACTORS.TIER_3,
            projectSpecificEmission: 'One emission factor',
          },
          assumptions: {
            verificationFrequency: 1,
            baselineReassessmentFrequency: 1,
            discountRate: 1,
            carbonPriceIncrease: 1,
            buffer: 1,
            projectLength: 1,
          },
          costInputs: {
            feasibilityAnalysis: 1,
            conservationPlanningAndAdmin: 1,
            dataCollectionAndFieldCost: 1,
            communityRepresentation: 1,
            blueCarbonProjectPlanning: 1,
            establishingCarbonRights: 1,
            validation: 1,
            implementationLabor: 1,
            monitoring: 1,
            maintenance: 1,
            communityBenefitSharingFund: 1,
            carbonStandardFees: 1,
            baselineReassessment: 1,
            mrv: 1,
            longTermProjectOperatingCost: 1,
            financingCost: 1,
          },
        });
      const errorTitles = response.body.errors.map((error) => error.title);
      expect(errorTitles).toEqual(
        expect.arrayContaining([
          'Project Specific Emission Factor must be provided when emissionFactorUsed is Tier 3 and projectSpecificEmission is One emission factor',
        ]),
      );
    });
  });
  describe('Restoration Project Validations', () => {
    describe('Restoration Yearly Breakdown', () => {
      test('Should fail if restored areas has negative values', async () => {
        const { parameters, ...rest } = RestorationCreateCustomProjectDTO;
        const yearlyBreakdown = [
          {
            year: -1,
            annualHectaresRestored: -100,
          },
          {
            year: 1,
            annualHectaresRestored: 200,
          },
        ];
        parameters.restorationPlan = yearlyBreakdown;
        const response = await testManager
          .request()
          .post(customProjectContract.createCustomProject.path)
          .send({
            ...rest,
            parameters,
          });

        expect(response.status).toEqual(400);
        expect(response.body.errors[0].title).toEqual(
          'Annual hectares restored cannot be negative',
        );
      });
      test('Should fail if year or annual hectares restored are not numbers', async () => {
        const { parameters, ...rest } = RestorationCreateCustomProjectDTO;
        const yearlyBreakdown = [
          {
            year: 'Invalid',
            annualHectaresRestored: 200,
          },
          {
            year: 1,
            annualHectaresRestored: 'Invalid',
          },
        ];
        parameters.restorationPlan = yearlyBreakdown;
        const response = await testManager
          .request()
          .post(customProjectContract.createCustomProject.path)
          .send({
            ...rest,
            parameters,
          });

        expect(response.status).toEqual(400);
        expect(response.body.errors).toHaveLength(2);
        expect(response.body.errors[0].title).toEqual(
          'Year should be a number',
        );
        expect(response.body.errors[1].title).toEqual(
          'Annual hectares restored should be a number',
        );
      });
    });
  });
});
