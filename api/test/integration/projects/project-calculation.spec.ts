import {
  CreateProjectDto,
  ProjectsCalculationService,
} from '@api/modules/projects/projects-calculation.service';
import { TestManager } from '../../utils/test-manager';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from '@shared/entities/activity.enum';
import { PROJECT_PRICE_TYPE } from '@shared/entities/projects.entity';
import { CalculationEngine } from '@api/modules/calculations/calculation.engine';
import { ConservationProjectInput } from '@api/modules/custom-projects/input-factory/conservation-project.input';
import { CreateCustomProjectDto } from '@shared/dtos/custom-projects/create-custom-project.dto';
import { CustomProjectsService } from '@api/modules/custom-projects/custom-projects.service';

describe('ProjectsCalculationService', () => {
  let service: ProjectsCalculationService;
  let testManager: TestManager;
  let engine: CalculationEngine;
  let customProjectService: CustomProjectsService;

  beforeEach(async () => {
    testManager = await TestManager.createTestManager();
    const { jwtToken } = await testManager.setUpTestUser();
    await testManager.ingestCountries();
    await testManager.ingestProjectScoreCards(jwtToken);
    await testManager.ingestExcel(jwtToken);
    service = testManager
      .getApp()
      .get<ProjectsCalculationService>(ProjectsCalculationService);
    engine = testManager.getApp().get<CalculationEngine>(CalculationEngine);
    customProjectService = testManager
      .getApp()
      .get<CustomProjectsService>(CustomProjectsService);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  it('should compute cost for project', async () => {
    const createProjectDTO: CreateProjectDto = {
      projectName: 'United States Mangrove Conservation Small',
      countryCode: 'USA',
      ecosystem: 'Mangrove' as ECOSYSTEM,
      activity: 'Conservation' as ACTIVITY,
      //restorationActivity: 'Planting' as RESTORATION_ACTIVITY_SUBTYPE,
      projectSizeHa: 4000,
      priceType: 'Opex breakeven' as PROJECT_PRICE_TYPE,
      initialCarbonPriceAssumption: 13.19896761,
    };

    const result = await service.computeCostForProject(createProjectDTO);
    console.log(result);
  });

  it('temporal, to check custom projects flow from same project input', async () => {
    const input = {
      activity: 'Conservation',
      countryCode: 'USA',
      carbonRevenuesToCover: 'Opex',
      ecosystem: 'Mangrove',
      projectName: 'United States Mangrove Conservation Small',
      projectSizeHa: 4000,
      initialCarbonPriceAssumption: 13.19896761,
      assumptions: {
        baselineReassessmentFrequency: 10,
        buffer: 0.2,
        carbonPriceIncrease: 0.015,
        projectLength: 20,
        discountRate: 0.04,
        verificationFrequency: 5,
      },
      costInputs: {
        feasibilityAnalysis: 100000,
        conservationPlanningAndAdmin: 166766.666666667,
        dataCollectionAndFieldCost: 26666.6666666667,
        communityRepresentation: 126500,
        blueCarbonProjectPlanning: 100000,
        establishingCarbonRights: 66666.6666666667,
        validation: 50000,
        monitoring: 49700,
        maintenance: 0.0833,
        communityBenefitSharingFund: 0.05,
        carbonStandardFees: 0.2,
        baselineReassessment: 40000,
        mrv: 100000,
        longTermProjectOperatingCost: 130600,
        financingCost: 0.05,
      },
      parameters: {
        lossRateUsed: 'National average',
        plantingSuccessRate: 0.8,
        emissionFactorUsed: 'Tier 1 - Global emission factor',
      },
    } as unknown as ConservationProjectInput;

    const res = await customProjectService.create(input);
    console.log({ res });
  });
});
