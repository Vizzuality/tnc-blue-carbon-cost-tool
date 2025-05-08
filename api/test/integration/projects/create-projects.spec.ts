import { projectsContract } from '@shared/contracts/projects.contract';
import { CreateProjectDto } from '@shared/dtos/projects/create-project.dto';
import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from '@shared/entities/activity.enum';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { Project } from '@shared/entities/projects.entity';
import { TestManager } from '../../utils/test-manager';
import { TestUser } from '../../utils/user.auth';
import { LOSS_RATE_USED } from '@shared/schemas/custom-projects/create-custom-project.schema';
import { EMISSION_FACTORS_TIER_TYPES } from '@shared/entities/carbon-inputs/emission-factors.entity';
import { CARBON_REVENUES_TO_COVER } from '@shared/entities/custom-project.entity';
import { SEQUESTRATION_RATE_TIER_TYPES } from '@shared/entities/carbon-inputs/sequestration-rate.entity';

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
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  describe('Conservation project', () => {
    test('Create a conservation project with the minimum required fields', async () => {
      const requestBody: CreateProjectDto = {
        countryCode: 'IND',
        projectName: 'Conservation project',
        ecosystem: ECOSYSTEM.SEAGRASS,
        activity: ACTIVITY.CONSERVATION,
        projectSizeHa: 10000,
        carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
        initialCarbonPriceAssumption: 20,
        parameters: {
          lossRateUsed: LOSS_RATE_USED.PROJECT_SPECIFIC,
          emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_1,
          projectSpecificLossRate: -0.5,
        },
      };

      const res = await testManager
        .request()
        .post(projectsContract.createProject.path)
        .set('Cookie', user.backofficeSessionCookie)
        .send(requestBody);

      expect(res.status).toBe(201);
      const { id, ...project } = res.body.data;
      expect(project).toEqual(expectedConservationProjectOutput);
    });
  });

  describe('Restoration project', () => {
    test('Create a Restoration project with the minimum required fields', async () => {
      const requestBody: CreateProjectDto = {
        countryCode: 'USA',
        projectName: 'Missing Sequestration Rate',
        ecosystem: ECOSYSTEM.MANGROVE,
        activity: ACTIVITY.RESTORATION,
        projectSizeHa: 100,
        initialCarbonPriceAssumption: 50,
        carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
        parameters: {
          restorationActivity: RESTORATION_ACTIVITY_SUBTYPE.PLANTING,
          tierSelector: SEQUESTRATION_RATE_TIER_TYPES.TIER_3,
          projectSpecificSequestrationRate: 2.5,
        },
      };

      const res = await testManager
        .request()
        .post(projectsContract.createProject.path)
        .set('Cookie', user.backofficeSessionCookie)
        .send(requestBody);

      expect(res.status).toBe(201);
      //const { id, ...project } = res.body.data;
      //expect(project).toEqual(expectedRestorationProjectOutput);
    });
  });
});

const expectedConservationProjectOutput = {
  projectName: 'Conservation project',
  countryCode: 'IND',
  ecosystem: 'Seagrass',
  activity: 'Conservation',
  restorationActivity: null,
  projectSize: 10000,
  priceType: 'Market price',
  initialPriceAssumption: 20,
  scoreCardRating: 'medium',
  countryAbatementPotential: 81911.08475289373,
  abatementPotential: 231318.71246113727,
  totalCostNPV: 3104197.8022359656,
  totalCost: 4690771.214017419,
  capexNPV: '1274697.5648611756',
  capex: '1357600.0000000014',
  opexNPV: '1829500.23737479',
  opex: '3333171.214017418',
  costPerTCO2eNPV: 16.77446330005342,
  costPerTCO2e: 16.77446330005342,
  feasibilityAnalysisNPV: '50000',
  feasibilityAnalysis: '50000',
  conservationPlanningNPV: '629559.347974512',
  conservationPlanning: '667066.666666668',
  dataCollectionNPV: '76962.52465483244',
  dataCollection: '80000.0000000001',
  communityRepresentationNPV: '255321.99021392793',
  communityRepresentation: '270533.3333333332',
  blueCarbonProjectPlanningNPV: '88899.63586709148',
  blueCarbonProjectPlanning: '100000',
  establishingCarbonRightsNPV: '129504.24821726605',
  establishingCarbonRights: '140000.00000000012',
  validationNPV: '44449.81793354574',
  validation: '50000',
  implementationLaborNPV: '0',
  implementationLabor: '0',
  monitoringNPV: '101486.70532413566',
  monitoring: '168000',
  maintenanceNPV: '0',
  maintenance: '0',
  monitoringMaintenanceNPV: '101486.70532413566',
  monitoringMaintenance: '168000',
  communityBenefitNPV: '1196842.5711581379',
  communityBenefit: '2264160.220023636',
  carbonStandardFeesNPV: '19847.819786706998',
  carbonStandardFees: '37010.99399378197',
  baselineReassessmentNPV: '75811.8711249392',
  baselineReassessment: '120000',
  mrvNPV: '167296.40590994002',
  mrv: '300000',
  longTermProjectOperatingNPV: '268214.86407093',
  longTermProjectOperating: '444000',
  totalRevenueNPV: '2393685.1423162757',
  totalRevenue: '4528320.440047272',
  creditsIssued: '185054.96996890983',
  projectSizeFilter: 'Medium',
  totalWeightedCost: null,
  totalWeightedCostNPV: null,
  leftoverAfterOpexNPV: '0',
  leftoverAfterOpex: '0',
} as unknown as Project;

const expectedRestorationProjectOutput = {
  projectName: 'Restoration project',
  countryCode: 'IND',
  ecosystem: 'Mangrove',
  activity: 'Restoration',
  restorationActivity: 'Planting',
  projectSize: 10000,
  priceType: 'Market price',
  initialPriceAssumption: 20,
  scoreCardRating: 'medium',
  countryAbatementPotential: 105368.13621180001,
  abatementPotential: 249480,
  totalCostNPV: 6502102.945303573,
  totalCost: 10766906.983822854,
  capexNPV: '3499180.6740743406',
  capex: '4959100.000000002',
  opexNPV: '3002922.2712292327',
  opex: '5807806.983822852',
  costPerTCO2eNPV: 32.57827754380899,
  costPerTCO2e: 32.57827754380899,
  feasibilityAnalysisNPV: '50000',
  feasibilityAnalysis: '50000',
  conservationPlanningNPV: '629559.347974512',
  conservationPlanning: '667066.666666668',
  dataCollectionNPV: '76962.52465483244',
  dataCollection: '80000.0000000001',
  communityRepresentationNPV: '255321.99021392793',
  communityRepresentation: '270533.3333333332',
  blueCarbonProjectPlanningNPV: '88899.63586709148',
  blueCarbonProjectPlanning: '100000',
  establishingCarbonRightsNPV: '129504.24821726605',
  establishingCarbonRights: '140000.00000000012',
  validationNPV: '44449.81793354574',
  validation: '50000',
  implementationLaborNPV: '2224483.109213165',
  implementationLabor: '3601500',
  monitoringNPV: '202973.41064827133',
  monitoring: '336000',
  maintenanceNPV: '717948.6494182559',
  maintenance: '1671456.150000001',
  monitoringMaintenanceNPV: '202973.41064827133',
  monitoringMaintenance: '336000',
  communityBenefitNPV: '1281313.4585320817',
  communityBenefit: '2452434.0338228587',
  carbonStandardFeesNPV: '21148.747453885157',
  carbonStandardFees: '39916.80000000001',
  baselineReassessmentNPV: '75811.8711249392',
  baselineReassessment: '120000',
  mrvNPV: '167296.40590994002',
  mrv: '300000',
  longTermProjectOperatingNPV: '536429.72814186',
  longTermProjectOperating: '888000',
  totalRevenueNPV: '2562626.9170641634',
  totalRevenue: '4904868.067645717',
  creditsIssued: '199584',
  projectSizeFilter: 'Medium',
  totalWeightedCost: null,
  totalWeightedCostNPV: null,
  leftoverAfterOpexNPV: '0',
  leftoverAfterOpex: '0',
} as unknown as Project;
