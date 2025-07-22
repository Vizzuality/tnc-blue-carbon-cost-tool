import { methodologyContract } from '@shared/contracts/methodology.contract';
import { EmissionFactors } from '@shared/entities/carbon-inputs/emission-factors.entity';
import { ModelComponentSource } from '@shared/entities/methodology/model-component-source.entity';
import { ModelComponentSourceM2M } from '@shared/entities/methodology/model-source-m2m.entity';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { DataIngestionEntity } from '@shared/entities/model-versioning/data-ingestion.entity';
import { METHODOLOGY_SOURCES_RESPONSE_BODY } from 'api/test/integration/methodology/methodology-sources.response';
import { MethodologySourcesUtils } from 'api/test/integration/methodology/methodology-sources.utils';
import { TestManager } from 'api/test/utils/test-manager';

describe('Methodology', () => {
  let testManager: TestManager;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
  });

  afterAll(async () => {
    await testManager.close();
  });

  describe('Controller', () => {
    beforeAll(async () => {
      const { jwtToken } = await testManager.setUpTestUser();
      await testManager.ingestCountries();
      await testManager.ingestProjectScoreCards(jwtToken);
      await testManager.ingestExcel(jwtToken);
    });

    afterAll(async () => {
      await testManager.clearDatabase();
    });

    it(`should return all model assumptions when a GET request is made to the ${methodologyContract.getAllModelAssumptions.path} endpoint`, async () => {
      const modelAssumptions = await testManager
        .getDataSource()
        .getRepository(ModelAssumptions)
        .find();
      const response = await testManager
        .request()
        .get(methodologyContract.getAllModelAssumptions.path)
        .expect(200);

      expect(response.body.data).toEqual(modelAssumptions);
    });

    it(`should return all model assumptions when a GET request is made to the ${methodologyContract.getMethodologySources.path} endpoint`, async () => {
      const dataSource = testManager.getDataSource();
      const modelComponentSourcesRepo =
        dataSource.getRepository(ModelComponentSource);
      const emissionsFactorsRepo = dataSource.getRepository(EmissionFactors);
      const modelComponentSourceM2MRepo = dataSource.getRepository(
        ModelComponentSourceM2M,
      );

      // Create sources
      const sources = await Promise.all([
        modelComponentSourcesRepo.save({
          name: 'Test Source 1',
          reviewedAt: new Date(),
        }),
        modelComponentSourcesRepo.save({
          name: 'Test Source 2',
          reviewedAt: new Date(),
        }),
      ]);

      // Get emission factors
      const emissionsFactor = await emissionsFactorsRepo.find({ take: 2 });

      await Promise.all([
        modelComponentSourceM2MRepo.save({
          entityName: EmissionFactors.name,
          entityId: emissionsFactor[0].id,
          sourceType: 'AGB',
          source: sources[0],
        }),
        modelComponentSourceM2MRepo.save({
          entityName: EmissionFactors.name,
          entityId: emissionsFactor[1].id,
          sourceType: 'SOC',
          source: sources[1],
        }),
      ]);

      const res = await testManager
        .request()
        .get(methodologyContract.getMethodologySources.path)
        .expect(200);

      expect(res.status).toBe(200);
      expect(
        MethodologySourcesUtils.removeSourceIds(res.body.data),
      ).toStrictEqual(
        MethodologySourcesUtils.removeSourceIds(
          METHODOLOGY_SOURCES_RESPONSE_BODY,
        ),
      );
    });

    it(`should return paginated changelogs when a GET request is made to the ${methodologyContract.getChangeLogs.path} endpoint`, async () => {
      const dataSource = testManager.getDataSource();
      const dataIngestionRepo = dataSource.getRepository(DataIngestionEntity);

      // Clear existing data
      await dataIngestionRepo.delete({});

      // Create test data
      const testChangelogs = [
        {
          createdAt: new Date('2024-01-01T00:00:00Z'),
          versionName: 'v1.0.0',
          versionNotes: 'Initial version',
          filePath: '/path/to/file1.xlsx',
        },
        {
          createdAt: new Date('2024-02-01T00:00:00Z'),
          versionName: 'v1.1.0',
          versionNotes: 'Bug fixes and improvements',
          filePath: '/path/to/file2.xlsx',
        },
        {
          createdAt: new Date('2024-03-01T00:00:00Z'),
          versionName: 'v2.0.0',
          versionNotes: 'Major update with new features',
          filePath: null,
        },
      ];

      await dataIngestionRepo.save(testChangelogs);

      // Test basic pagination
      const response = await testManager
        .request()
        .get(methodologyContract.getChangeLogs.path)
        .query({ pageSize: 10, pageNumber: 1 })
        .expect(200);

      expect(response.body.data).toHaveLength(3);
      expect(response.body.metadata).toEqual({
        size: 10,
        page: 1,
        totalItems: 3,
        totalPages: 1,
      });

      // Verify the response contains only Changelog fields (no filePath)
      response.body.data.forEach((changelog: any) => {
        expect(changelog).toHaveProperty('createdAt');
        expect(changelog).toHaveProperty('versionName');
        expect(changelog).toHaveProperty('versionNotes');
        expect(changelog).not.toHaveProperty('filePath');
      });

      // Test sorting by createdAt descending (most recent first)
      const sortedResponse = await testManager
        .request()
        .get(methodologyContract.getChangeLogs.path)
        .query({ 'sort[0]': '-createdAt' })
        .expect(200);

      expect(sortedResponse.body.data[0].versionName).toBe('v2.0.0');
      expect(sortedResponse.body.data[1].versionName).toBe('v1.1.0');
      expect(sortedResponse.body.data[2].versionName).toBe('v1.0.0');
    });

    it(`should return limited results when pageSize is specified for ${methodologyContract.getChangeLogs.path} endpoint`, async () => {
      const response = await testManager
        .request()
        .get(methodologyContract.getChangeLogs.path)
        .query({ pageSize: 2, pageNumber: 1 })
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.metadata).toEqual({
        size: 2,
        page: 1,
        totalItems: 3,
        totalPages: 2,
      });
    });
  });

  describe('ModelComponentSource', () => {
    beforeAll(async () => {
      const { jwtToken } = await testManager.setUpTestUser();
      await testManager.ingestCountries();
      await testManager.ingestProjectScoreCards(jwtToken);
      await testManager.ingestExcel(jwtToken);
    });

    afterAll(async () => {
      await testManager.clearDatabase();
    });

    it('should cascade delete related rows in the ModelComponentSourceM2M table when a referenced entity is deleted', async () => {
      const dataSource = testManager.getDataSource();
      const modelComponentSourcesRepo =
        dataSource.getRepository(ModelComponentSource);
      const emissionsFactorsRepo = dataSource.getRepository(EmissionFactors);
      const modelComponentSourceM2MRepo = dataSource.getRepository(
        ModelComponentSourceM2M,
      );
      // Remove current relationships as the current excel file create them
      await modelComponentSourceM2MRepo.delete({});

      const source = await modelComponentSourcesRepo.save({
        name: 'Test Source',
        reviewedAt: new Date(),
      });

      const emissionsFactor = (await emissionsFactorsRepo.find())[0];

      const modelComponentSourceM2M = await modelComponentSourceM2MRepo.save({
        entityName: EmissionFactors.name,
        entityId: emissionsFactor.id,
        sourceType: 'SOC',
        source,
      });
      expect(modelComponentSourceM2M).toBeDefined();

      await modelComponentSourcesRepo.remove(source);
      const remainingSourcesM2M = await modelComponentSourceM2MRepo.find();
      expect(remainingSourcesM2M).toHaveLength(0);
    });
  });
});
