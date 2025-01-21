import { TestManager } from '../../utils/test-manager';
import { methodologyContract } from '@shared/contracts/methodology.contract';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';

describe('Methodology tests', () => {
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
  });

  describe('Model Assumptions', () => {
    test('Should return all model assumptions', async () => {
      const modelAssumptions = await testManager
        .getDataSource()
        .getRepository(ModelAssumptions)
        .find();
      const response = await testManager
        .request()
        .get(methodologyContract.getAllModelAssumptions.path)
        .expect(200);

      expect(response.body.data).toEqual(modelAssumptions);
    });
  });
});
