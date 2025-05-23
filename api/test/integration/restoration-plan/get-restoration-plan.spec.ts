import { TestManager } from '../../utils/test-manager';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';
import { GetRestorationPlan } from '@api/modules/custom-projects/restoration-plan.service';

describe('Restoration Plan - Get Tests', () => {
  let testManager: TestManager;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
  });

  afterEach(async () => {
    await testManager.close();
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  test('Should get a restoration plan using by splitting all hectares in the first 2 years', async () => {
    const query: GetRestorationPlan = {
      projectSizeHa: 1000,
      restorationProjectLength: 20,
      restorationRate: 900,
    };
    const response = await testManager
      .request()
      .get(customProjectContract.getRestorationPlan.path)
      .query(query);

    const { data } = response.body;

    expect(data).toHaveLength(query.restorationProjectLength + 1); // To account for the first -1 year
    expect(data[0].annualHectaresRestored).toEqual(900);
    expect(data[1].annualHectaresRestored).toEqual(100);
    expect(data[2].annualHectaresRestored).toEqual(0);
  });

  test('Should get a restoration plan with the only the restoration rate for the first year as the rate is bigger than the project size', async () => {
    const query: GetRestorationPlan = {
      projectSizeHa: 1000,
      restorationProjectLength: 10,
      restorationRate: 1200,
    };
    const response = await testManager
      .request()
      .get(customProjectContract.getRestorationPlan.path)
      .query(query);

    const { data } = response.body;

    expect(data).toHaveLength(query.restorationProjectLength + 1); // To account for the first -1 year
    expect(data[0].annualHectaresRestored).toEqual(query.projectSizeHa);
    expect(data[1].annualHectaresRestored).toEqual(0);
    expect(data[2].annualHectaresRestored).toEqual(0);
  });
});
