import { TestManager } from '../../utils/test-manager';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';
import { User } from '@shared/entities/users/user.entity';
import { LOSS_RATE_USED } from '@shared/schemas/custom-projects/create-custom-project.schema';
import { EMISSION_FACTORS_TIER_TYPES } from '@shared/entities/carbon-inputs/emission-factors.entity';
import { CustomProject } from '@shared/entities/custom-project.entity';
import { CreateCustomProjectDto } from '@shared/dtos/custom-projects/create-custom-project.dto';

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
    await testManager.ingestProjectScoreCards(jwtToken);
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
        projectName: 'New Project',
      });

      // Updating a custom projects could mean recalculating everything but keeping the same id, so that we need to
      // send the same input shape
      const { input } = customProject;
      const newCreateDTO: CreateCustomProjectDto = {
        ...input,
        projectName: 'Updated Project',
        initialCarbonPriceAssumption: 69,
        parameters: {
          ...input.parameters,
          lossRateUsed: LOSS_RATE_USED.NATIONAL_AVERAGE,
          emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_1,
          projectSpecificEmission: 'One emission factor',
          // These should be undefined
          // projectSpecificLossRate: -0.5,
          // projectSpecificEmissionFactor: 0.5,
          projectSpecificLossRate: undefined,
          projectSpecificEmissionFactor: undefined,
        },
      };

      // When
      const response = await testManager
        .request()
        .patch(
          `${customProjectContract.updateCustomProject.path.replace(':id', customProject.id)}`,
        )
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(newCreateDTO);

      const updatedCustomProject: CustomProject = response.body.data;
      const updatedInput: CustomProject['input'] = updatedCustomProject.input;
      // Then
      expect(response.status).toBe(200);
      expect(updatedCustomProject.id).toMatch(customProject.id);
      expect(updatedCustomProject.projectName).toBe(newCreateDTO.projectName);
      expect(updatedInput.initialCarbonPriceAssumption).toEqual(
        newCreateDTO.initialCarbonPriceAssumption,
      );
    });

    // TODO: Resolve this doubt in PR
    test.skip('An authenticated user should not be able to update projects that do not belong to them', async () => {
      // Given a custom project exists
      const customProject = await testManager.mocks().createCustomProject();

      const { input } = customProject;

      // When updating the custom project
      const response = await testManager
        .request()
        .patch(
          `${customProjectContract.updateCustomProject.path.replace(':id', customProject.id)}`,
        )
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ ...input, projectName: 'Trying to update name' });

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
