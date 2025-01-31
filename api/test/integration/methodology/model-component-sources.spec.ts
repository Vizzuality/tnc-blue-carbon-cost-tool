import { EmissionFactors } from '@shared/entities/carbon-inputs/emission-factors.entity';
import { EmissionFactorsSource } from '@shared/entities/methodology/emission-factor-source.entity';
import { ModelComponentSource } from '@shared/entities/methodology/model-component-source.entity';
import { TestManager } from 'api/test/utils/test-manager';

describe('Model component sources', () => {
  let testManager: TestManager;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    await testManager.clearDatabase();
  });

  beforeEach(async () => {
    const { jwtToken } = await testManager.setUpTestUser();
    await testManager.ingestCountries();
    await testManager.ingestProjectScoreCards(jwtToken);
    await testManager.ingestExcel(jwtToken);
  });

  //   afterEach(async () => {
  //     await testManager.clearDatabase();
  //   });

  afterAll(async () => {
    await testManager.close();
  });

  test('Creation test', async () => {
    const emissionFactorRepo = testManager
      .getDataSource()
      .getRepository(EmissionFactors);

    const modelComponentSourceRepo = testManager
      .getDataSource()
      .getRepository(ModelComponentSource);

    const emissionFactorsSourceRepo = testManager
      .getDataSource()
      .getRepository(EmissionFactorsSource);

    const emissionFactor = (await emissionFactorRepo.find())[0];
    const modelComponentSource = await modelComponentSourceRepo.save({
      name: 'Test',
      reviewedAt: new Date(),
    });

    const emissionFactorSource = new EmissionFactorsSource();
    emissionFactorSource.emissionFactor = emissionFactor;
    emissionFactorSource.source = modelComponentSource;
    emissionFactorSource.emissionFactorType = 'SOC';

    await emissionFactorsSourceRepo.save(emissionFactorSource);

    const savedEmissionFactorSource = (
      await emissionFactorsSourceRepo.find({
        relations: ['emissionFactor', 'source'],
      })
    )[0];
    console.log(savedEmissionFactorSource);

    await modelComponentSourceRepo.delete(modelComponentSource.id);

    console.log(
      await emissionFactorsSourceRepo.find({
        relations: ['emissionFactor', 'source'],
      }),
    );
  });
});
