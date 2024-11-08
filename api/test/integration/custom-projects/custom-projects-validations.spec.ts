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

  describe('General Custom Project Validations', () => {
    test('Should fail if common project parameters are not provided', async () => {
      const response = await testManager
        .request()
        .post(customProjectContract.createCustomProject.path)
        .send({});

      expect(response.body.errors).toHaveLength(10);
      expect(response.body.errors).toMatchObject(GENERAL_VALIDATION_ERRORS);
    });
  });
});

const GENERAL_VALIDATION_ERRORS = [
  {
    status: '400',
    title: 'countryCode must be longer than or equal to 3 characters',
  },
  {
    status: '400',
    title: 'countryCode must be a string',
  },
  {
    status: '400',
    title: 'projectName must be a string',
  },
  {
    status: '400',
    title:
      'activity must be one of the following values: Restoration, Conservation',
  },
  {
    status: '400',
    title:
      'ecosystem must be one of the following values: Mangrove, Seagrass, Salt marsh',
  },
  {
    status: '400',
    title:
      'projectSizeHa must be a number conforming to the specified constraints',
  },
  {
    status: '400',
    title:
      'initialCarbonPriceAssumption must be a number conforming to the specified constraints',
  },
  {
    status: '400',
    title:
      'carbonRevenuesToCover must be one of the following values: Opex, Capex and Opex',
  },
  {
    status: '400',
    title: 'Invalid project parameters for the selected activity type.',
  },
  {
    status: '400',
    title: 'parameters should not be empty',
  },
];
