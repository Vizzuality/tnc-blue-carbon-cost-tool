import { EmissionFactors } from '@shared/entities/carbon-inputs/emission-factors.entity';
import { EmissionFactorsSource } from '@shared/entities/methodology/emission-factor-source.entity';
import { EMISSION_FACTOR_TYPE } from '@shared/entities/methodology/emission-factor.type';
import { ModelComponentSource } from '@shared/entities/methodology/model-component-source.entity';
import { TestManager } from 'api/test/utils/test-manager';
import { Repository } from 'typeorm';

describe('Model component sources', () => {
  let testManager: TestManager;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  describe('Creation of a EmissionFactorsSource m2m relationship between a EmissionFactors and ModelComponentSource', () => {
    let emissionFactorRepo: Repository<EmissionFactors>;
    let modelComponentSourceRepo: Repository<ModelComponentSource>;
    let emissionFactorsSourceRepo: Repository<EmissionFactorsSource>;
    let emissionFactor: EmissionFactors;
    let modelComponentSource: ModelComponentSource;

    afterAll(async () => {
      await testManager.clearDatabase();
    });

    beforeAll(async () => {
      const { jwtToken } = await testManager.setUpTestUser();
      await testManager.ingestCountries();
      await testManager.ingestProjectScoreCards(jwtToken);
      await testManager.ingestExcel(jwtToken);

      emissionFactorRepo = testManager
        .getDataSource()
        .getRepository(EmissionFactors);

      modelComponentSourceRepo = testManager
        .getDataSource()
        .getRepository(ModelComponentSource);

      emissionFactorsSourceRepo = testManager
        .getDataSource()
        .getRepository(EmissionFactorsSource);

      emissionFactor = (await emissionFactorRepo.find())[0];
      modelComponentSource = await modelComponentSourceRepo.save({
        name: 'Test',
        reviewedAt: new Date(),
      });
    });

    test('Check if the m2m relationship was created thourgh the intermediate table', async () => {
      const emissionFactorSource = new EmissionFactorsSource();
      emissionFactorSource.emissionFactor = emissionFactor;
      emissionFactorSource.source = modelComponentSource;
      emissionFactorSource.emissionFactorType = EMISSION_FACTOR_TYPE.SOC;

      await emissionFactorsSourceRepo.save(emissionFactorSource);

      const savedEmissionFactorSource = (
        await emissionFactorsSourceRepo.find({
          relations: ['emissionFactor', 'source'],
        })
      )[0];

      expect(savedEmissionFactorSource).toBeDefined();
    });

    test("Check if the row in the intermediate table was deleted when the related row in ModelComponentSource's table was deleted", async () => {
      await modelComponentSourceRepo.delete(modelComponentSource.id);

      expect(
        await emissionFactorsSourceRepo.find({
          relations: ['emissionFactor', 'source'],
        }),
      ).toHaveLength(0);
    });

    test('Check that a deletion of a row in the intermediation table (EmissionFactorsSource) doest not delete the related ModelComponentSource', async () => {
      // Given
      modelComponentSource = await modelComponentSourceRepo.save({
        name: 'Test',
        reviewedAt: new Date(),
      });
      const emissionFactorSource = new EmissionFactorsSource();
      emissionFactorSource.emissionFactor = emissionFactor;
      emissionFactorSource.source = modelComponentSource;
      emissionFactorSource.emissionFactorType = EMISSION_FACTOR_TYPE.SOC;

      await emissionFactorsSourceRepo.save(emissionFactorSource);

      // When
      await emissionFactorsSourceRepo.delete({
        emissionFactor: emissionFactor,
        source: modelComponentSource,
      });

      // Then
      const expectedModelComponentSource = (
        await modelComponentSourceRepo.findBy({ id: modelComponentSource.id })
      )[0];
      expect(expectedModelComponentSource).toBeDefined();
    });
  });
});
