import { TestManager } from '../../utils/test-manager';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';

describe('Create Custom Projects - Setup', () => {
  let testManager: TestManager;
  let jwtToken: string;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    const { jwtToken: token } = await testManager.setUpTestUser();
    jwtToken = token;
    await testManager.ingestCountries();
    await testManager.ingestExcel(jwtToken);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  test('Should return the list of countries that are available to create a custom project', async () => {
    const response = await testManager
      .request()
      .get(customProjectContract.getAvailableCountries.path);

    expect(response.body.data).toHaveLength(9);
  });
  test('Should return default model assumptions', async () => {
    const response = await testManager
      .request()
      .get(customProjectContract.getDefaultAssumptions.path);

    expect(response.body.data).toHaveLength(18);
  });
});
