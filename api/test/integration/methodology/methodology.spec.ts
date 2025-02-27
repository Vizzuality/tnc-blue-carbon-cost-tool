import { methodologyContract } from '@shared/contracts/methodology.contract';
import { EmissionFactors } from '@shared/entities/carbon-inputs/emission-factors.entity';
import { ModelComponentSource } from '@shared/entities/methodology/model-component-source.entity';
import { ModelComponentSourceM2M } from '@shared/entities/methodology/model-source-m2m.entity';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
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
