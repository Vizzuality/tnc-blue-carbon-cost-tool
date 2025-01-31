import { ProjectScorecard } from '@shared/entities/project-scorecard.entity';
import { TestManager } from '../../utils/test-manager';

describe('Import Repository', () => {
  let testManager: TestManager;
  let jwtToken: string;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    const response = await testManager.setUpTestUser();
    jwtToken = response.jwtToken;
  });

  afterEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  it('should wipe previous project scorecards before importing new ones', async () => {
    // Given
    await testManager.ingestCountries();
    await testManager.ingestProjectScoreCards(jwtToken);
    const scorecardRepository =
      testManager.dataSource.getRepository(ProjectScorecard);

    const scorecardCount = await scorecardRepository.count();

    // When
    await testManager.ingestProjectScoreCards(jwtToken);
    const latestScorecardCount = await scorecardRepository.count();

    // Then
    expect(scorecardCount).toEqual(latestScorecardCount);
  });
});
