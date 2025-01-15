import { HttpStatus } from '@nestjs/common';
import { projectsContract } from '@shared/contracts/projects.contract';
import { PROJECT_KEY_COSTS_FIELDS } from '@shared/dtos/projects/project-key-costs.dto';
import { TestManager } from 'api/test/utils/test-manager';

describe('Projects key costs', () => {
  let testManager: TestManager;
  let jwtToken: string;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    const result = await testManager.setUpTestUser();
    jwtToken = result.jwtToken;

    await testManager.ingestCountries();
  });

  afterEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  describe('ProjectsController', () => {
    it('should return 200 and the key costs for the filtered projects dataset', async () => {
      // Given
      await testManager.ingestProjectScoreCards(jwtToken);
      await Promise.all([
        testManager.mocks().createProject(),
        testManager.mocks().createProject(),
        testManager.mocks().createProject(),
      ]);

      // When
      const projectsResponse = await testManager
        .request()
        .get(projectsContract.getProjects.path)
        .query({ 'sort[0]': ['projectName'] });
      const keyCostsResponse = await testManager
        .request()
        .get(projectsContract.getProjectsKeyCosts.path)
        .query({ 'sort[0]': ['projectName'] });

      // Then
      expect(projectsResponse.status).toBe(HttpStatus.OK);
      expect(keyCostsResponse.status).toBe(HttpStatus.OK);

      const projects = projectsResponse.body.data;
      const projectsKeyCosts = keyCostsResponse.body.data;

      expect(projects.length).toBe(projectsKeyCosts.length);
      expect(projects[0].projectName).toBe(projectsKeyCosts[0].projectName);
      expect(projects[1].projectName).toBe(projectsKeyCosts[1].projectName);
      expect(projects[2].projectName).toBe(projectsKeyCosts[2].projectName);

      for (const project of projectsKeyCosts) {
        for (const expectedField of PROJECT_KEY_COSTS_FIELDS)
          expect(project[expectedField]).toBeDefined();
      }
    });
  });
});
