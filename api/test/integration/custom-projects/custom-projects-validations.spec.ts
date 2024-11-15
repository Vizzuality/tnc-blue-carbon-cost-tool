import { TestManager } from '../../utils/test-manager';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';
import { PROJECT_EMISSION_FACTORS } from '@api/modules/custom-projects/dto/conservation-project-params.dto';

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

      expect(response.body.errors).toHaveLength(10);
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

      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].title).toEqual(
        'lossRateUsed must be one of the following values: National average, Project specific',
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
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].title).toEqual(
        'Project Specific Loss Rate must be negative',
      );
    });
    test('If Emission Factor Used is Tier 2, only Mangroves is accepted as ecosystem', async () => {
      const response = await testManager
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
        });
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].title).toEqual(
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
        });
      const errorTitles = response.body.errors.map((error) => error.title);
      expect(errorTitles).toEqual(
        expect.arrayContaining([
          'Project Specific Emission Factor must be provided when emissionFactorUsed is Tier 3 and projectSpecificEmission is One emission factor',
        ]),
      );
    });
  });
});
