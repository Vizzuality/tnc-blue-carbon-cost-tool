import {
  CreateProjectDto,
  ProjectsCalculationService,
} from '@api/modules/projects/calculation/projects-calculation.service';
import { TestManager } from '../../utils/test-manager';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { PROJECT_PRICE_TYPE } from '@shared/entities/projects.entity';
import { CalculationEngine } from '@api/modules/calculations/calculation.engine';
import { CustomProjectsService } from '@api/modules/custom-projects/custom-projects.service';
import { ProjectsService } from '@api/modules/projects/projects.service';

// TODO: No point adding tests now as we need a validated scenarios to replicate in the tests

describe.skip('ProjectsCalculationService', () => {
  let projectsCalculationService: ProjectsCalculationService;
  let testManager: TestManager;
  let engine: CalculationEngine;
  let customProjectService: CustomProjectsService;
  let projectsService: ProjectsService;

  beforeEach(async () => {
    testManager = await TestManager.createTestManager();
    const { jwtToken } = await testManager.setUpTestUser();
    await testManager.ingestCountries();
    await testManager.ingestProjectScoreCards(jwtToken);
    await testManager.ingestExcel(jwtToken);
    projectsCalculationService = testManager
      .getApp()
      .get<ProjectsCalculationService>(ProjectsCalculationService);
    engine = testManager.getApp().get<CalculationEngine>(CalculationEngine);
    customProjectService = testManager
      .getApp()
      .get<CustomProjectsService>(CustomProjectsService);
    projectsService = testManager
      .getApp()
      .get<ProjectsService>(ProjectsService);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  test('should compute cost for project', async () => {
    const createProjectDTO: CreateProjectDto = {
      projectName: 'United States Mangrove Conservation Small',
      countryCode: 'USA',
      ecosystem: 'Seagrass' as ECOSYSTEM,
      activity: 'Conservation' as ACTIVITY,
      //restorationActivity: 'Planting' as RESTORATION_ACTIVITY_SUBTYPE,
      projectSizeHa: 4000,
      priceType: 'Opex breakeven' as PROJECT_PRICE_TYPE,
      initialCarbonPriceAssumption: 13.19896761,
    };

    const result =
      await projectsCalculationService.computeCostForProject(createProjectDTO);
  });
});
