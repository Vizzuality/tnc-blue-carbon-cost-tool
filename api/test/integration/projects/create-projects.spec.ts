import { projectsContract } from '@shared/contracts/projects.contract';
import { CreateProjectDto } from '@shared/dtos/projects/create-project.dto';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { ProjectScorecard } from '@shared/entities/project-scorecard.entity';
import { Project, PROJECT_PRICE_TYPE } from '@shared/entities/projects.entity';
import { TestManager } from 'api/test/utils/test-manager';
import { TestUser } from 'api/test/utils/user.auth';

describe('Create projects', () => {
  let testManager: TestManager;
  let user: TestUser;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    user = await testManager.setUpTestUser();
    await testManager.ingestCountries();
    await testManager.ingestProjectScoreCards(user.jwtToken);
    await testManager.ingestExcel(user.jwtToken);
  });

  afterEach(async () => {
    await testManager.getDataSource().getRepository(Project).delete({});
    await testManager
      .getDataSource()
      .getRepository(ProjectScorecard)
      .delete({});
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  test('Create a conservation project with the minimum required fields', async () => {
    const requestBody: CreateProjectDto = {
      countryCode: 'IND',
      projectName: 'Conservation project',
      ecosystem: ECOSYSTEM.MANGROVE,
      activity: ACTIVITY.CONSERVATION,
      projectSizeHa: 10000,
      initialCarbonPriceAssumption: 20,
      priceType: PROJECT_PRICE_TYPE.OPEN_BREAK_EVEN_PRICE,
    };

    const res = await testManager
      .request()
      .post(projectsContract.createProject.path)
      .set('Cookie', user.backofficeSessionCookie)
      .send(requestBody);

    expect(res.status).toBe(201);
  });
});
