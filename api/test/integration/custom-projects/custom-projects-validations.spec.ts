import { TestManager } from '../../utils/test-manager';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';
import { LOSS_RATE_USED } from '@shared/schemas/custom-projects/create-custom-project.schema';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';

describe('Create Custom Projects - Request Validations', () => {
  let testManager: TestManager;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
  });

  afterAll(async () => {
    await testManager.close();
  });

  test(`if lossRateUsed is ${LOSS_RATE_USED.NATIONAL_AVERAGE} then project specific loss rate should not be provided`, async () => {
    const response = await testManager
      .request()
      .post(customProjectContract.createConservationCustomProject.path)
      .send({
        activity: ACTIVITY.CONSERVATION,
        countryCode: 'USA',
        ecosystem: ECOSYSTEM.MANGROVE,
        lossRateUsed: LOSS_RATE_USED.NATIONAL_AVERAGE,
        projectSpecificLossRate: 10,
      });

    expect(response.status).toBe(400);
    expect(response.body.errors[0].title).toBe(
      `Project Specific Loss Rate should not be provided when lossRateUsed is ${LOSS_RATE_USED.NATIONAL_AVERAGE}`,
    );
  });
  test('If loss rate used is project specific, then project specific loss rate should be provided, and it should be a negative number', async () => {
    const noProjectSpecificLossRateProvided = await testManager
      .request()
      .post(customProjectContract.createConservationCustomProject.path)
      .send({
        activity: ACTIVITY.CONSERVATION,
        countryCode: 'USA',
        ecosystem: ECOSYSTEM.MANGROVE,
        lossRateUsed: LOSS_RATE_USED.PROJECT_SPECIFIC,
      });

    expect(noProjectSpecificLossRateProvided.status).toBe(400);
    expect(noProjectSpecificLossRateProvided.body.title).toBe(
      `Project Specific Loss Rate is required when lossRateUsed is ${LOSS_RATE_USED.PROJECT_SPECIFIC}`,
    );

    const positiveProjectSpecificLossRate = await testManager
      .request()
      .post(customProjectContract.createConservationCustomProject.path)
      .send({
        activity: ACTIVITY.CONSERVATION,
        countryCode: 'USA',
        ecosystem: ECOSYSTEM.MANGROVE,
        lossRateUsed: LOSS_RATE_USED.PROJECT_SPECIFIC,
        projectSpecificLossRate: 10,
      });

    expect(positiveProjectSpecificLossRate.status).toBe(400);
    expect(positiveProjectSpecificLossRate.body.title).toBe(
      'Project Specific Loss Rate should be negative',
    );
  });
});
