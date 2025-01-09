import { TestManager } from '../../utils/test-manager';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';
import { CustomProject } from '@shared/entities/custom-project.entity';
import { User } from '@shared/entities/users/user.entity';

describe('Read Custom projects', () => {
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

  describe('Read Custom Projects', () => {
    test('An anonymous user should be UNAUTHORIZED to read a custom project by its id', async () => {
      // Given
      const customProject = await testManager.mocks().createCustomProject({
        user: { id: user.id } as User,
      });

      // When
      const response = await testManager
        .request()
        .get(
          `${customProjectContract.getCustomProject.path.replace(':id', customProject.id)}`,
        )
        .send();

      // Then
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    test('An anonymous user should be UNAUTHORIZED to read any custom projects', async () => {
      // Given
      const customProject = await testManager.mocks().createCustomProject({
        user: { id: user.id } as User,
      });

      // When
      const response = await testManager
        .request()
        .get(
          `${customProjectContract.getCustomProject.path.replace(':id', customProject.id)}`,
        )
        .send();

      // Then
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    test('An authenticated user should be able to read one of its custom projects by id', async () => {
      // Given
      const customProject = await testManager.mocks().createCustomProject({
        user: { id: user.id } as User,
      });

      // When
      const response = await testManager
        .request()
        .get(
          `${customProjectContract.getCustomProject.path.replace(':id', customProject.id)}`,
        )
        .set('Authorization', `Bearer ${jwtToken}`)
        .send();

      // Then
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(customProject.id);
    });

    test('An authenticated user should be able to retrieve its custom projects', async () => {
      // Given
      const { createCustomProject } = testManager.mocks();
      const [customProject1, customProject2] = await Promise.all([
        createCustomProject({
          user: { id: user.id } as User,
        }),
        createCustomProject({
          id: '2d8fdf38-3295-4970-b194-af503a2a6039',
          user: { id: user.id } as User,
        }),
      ]);

      // When
      const response = await testManager
        .request()
        .get(customProjectContract.getCustomProjects.path)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send();

      // Then
      expect(response.status).toBe(200);
      const responseData = response.body.data;
      expect(responseData.length).toBe(2);
      expect(
        responseData.find((cp: CustomProject) => cp.id === customProject1.id),
      ).toBeDefined();
      expect(
        responseData.find((cp: CustomProject) => cp.id === customProject2.id),
      ).toBeDefined();
    });

    test('An authenticated user should be able to retrieve its custom projects filtering by partialProjectName', async () => {
      // Given
      const { createCustomProject } = testManager.mocks();
      const [customProject1, customProject2] = await Promise.all([
        createCustomProject({
          id: '2d8fdf38-3295-4970-b194-af503a2a6031',
          projectName: 'Should not be found',
          user: { id: user.id } as User,
        }),
        createCustomProject({
          id: '2d8fdf38-3295-4970-b194-af503a2a6039',
          projectName: 'Seagrass',
          user: { id: user.id } as User,
        }),
      ]);

      // When
      const response = await testManager
        .request()
        .get(customProjectContract.getCustomProjects.path)
        .set('Authorization', `Bearer ${jwtToken}`)
        .query({ partialProjectName: 'Sea' })
        .send();

      // Then
      expect(response.status).toBe(200);
      const responseData = response.body.data;
      expect(responseData.length).toBe(1);
      expect(
        responseData.find((cp: CustomProject) => cp.id === customProject2.id),
      ).toBeDefined();
    });
  });
});
