import { TestManager } from '../../utils/test-manager';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';
import { User } from '@shared/entities/users/user.entity';

describe('Update custom projects', () => {
  let testManager: TestManager;
  let jwtToken: string;
  let user: User;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
  });

  beforeEach(async () => {
    ({ jwtToken, user } = await testManager.setUpTestUser());
    await testManager.ingestCountries();
    await testManager.ingestExcel(jwtToken);
  });

  afterEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  describe('Update Custom Projects', () => {
    test('An authenticated user should be able to update/edit one of their custom projects by id', async () => {
      // Given
      const customProject = await testManager.mocks().createCustomProject({
        user: { id: user.id } as User,
        projectName: 'A',
      });

      // When
      const response = await testManager
        .request()
        .patch(
          `${customProjectContract.updateCustomProject.path.replace(':id', customProject.id)}`,
        )
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          projectName: 'B',
        });

      // Then
      expect(response.status).toBe(200);
      expect(response.body.projectName).toBe('B');
    });

    test('An authenticated user should not be able to update projects that do not belong to them', async () => {
      // Given a custom project exists
      const customProject = await testManager.mocks().createCustomProject();

      // When updating the custom project
      const response = await testManager
        .request()
        .patch(
          `${customProjectContract.updateCustomProject.path.replace(':id', customProject.id)}`,
        )
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          projectName: 'B',
        });

      // Then
      expect(response.status).toBe(401);
    });

    test('An unauthenticated user should not be able to update a custom project', async () => {
      // Given a custom project exists
      const customProject = await testManager.mocks().createCustomProject();

      // When updating the custom project
      const response = await testManager
        .request()
        .patch(
          `${customProjectContract.updateCustomProject.path.replace(':id', customProject.id)}`,
        )
        .send({
          projectName: 'B',
        });

      // Then
      expect(response.status).toBe(401);
    });
  });
});
