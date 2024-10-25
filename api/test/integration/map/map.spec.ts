import { TestManager } from '../../utils/test-manager';
import { HttpStatus } from '@nestjs/common';

describe('Map', () => {
  let testManager: TestManager;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
  });

  afterEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  test('should return a geojson given a countryCode', async () => {
    await testManager.ingestCountries();
    await testManager.mocks().createBaseData({ countryCode: 'AND' });
    const response = await testManager
      .request()
      .get('/map/geo-features')
      .query({ countryCode: 'AND' });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.features.length).toBe(1);
  });
});
