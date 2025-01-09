import { TestManager } from '../../utils/test-manager';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';
import { User } from '@shared/entities/users/user.entity';
import { HttpStatus } from '@nestjs/common';

describe('Delete Custom projects', () => {
  let testManager: TestManager;
  let jwtToken: string;
  let user: User;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
  });

  beforeEach(async () => {
    ({ jwtToken, user } = await testManager.setUpTestUser());
    await testManager.ingestCountries();
    await testManager.ingestProjectScoreCards(jwtToken);
    await testManager.ingestExcel(jwtToken);
  });

  afterEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  describe('Delete Custom Projects', () => {
    test('An anonymous user should be UNAUTHORIZED to delete a custom project', async () => {
      // Given
      const customProject = await testManager.mocks().createCustomProject({
        user: { id: user.id } as User,
      });

      // When deleting the custom project
      const response = await testManager
        .request()
        .delete(customProjectContract.deleteCustomProjects.path)
        .send({ ids: [customProject.id] });

      // Then
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.errors).toBeDefined();
    });

    test.only('An authenticated user should not be able to delete projects that do not belong to them', async () => {
      // Given a custom project exists
      const customProject = await testManager.mocks().createCustomProject();

      // When deleting the custom project
      const response = await testManager
        .request()
        .delete(customProjectContract.deleteCustomProjects.path)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ ids: [customProject.id] });

      // Then
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    test('An authenticated user should be able to delete projects', async () => {
      // Given a custom project exists
      const customProject = await testManager.mocks().createCustomProject({
        user: { id: user.id } as User,
      });

      // When deleting the custom project
      const response = await testManager
        .request()
        .delete(customProjectContract.deleteCustomProjects.path)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ ids: [customProject.id] });

      expect(response.status).toBe(HttpStatus.OK);

      // Then the project should no longer exist
      const getProjectResponse = await testManager
        .request()
        .get(
          `${customProjectContract.getCustomProject.path}/${customProject.id}`,
        )
        .set('Authorization', `Bearer ${jwtToken}`);
      expect(getProjectResponse.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
