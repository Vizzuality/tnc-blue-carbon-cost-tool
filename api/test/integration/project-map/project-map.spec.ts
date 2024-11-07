import { TestManager } from '../../utils/test-manager';
import { HttpStatus } from '@nestjs/common';
import { Project } from '@shared/entities/projects.entity';
import { Country } from '@shared/entities/country.entity';
import { projectsContract } from '@shared/contracts/projects.contract';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';

describe('Project Map', () => {
  let testManager: TestManager;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    await testManager.ingestCountries();
  });

  afterEach(async () => {
    await testManager.clearTablesByEntities([Project]);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  test('Should return unique country geometries, with project cost aggregated values', async () => {
    const countries = await testManager
      .getDataSource()
      .getRepository(Country)
      .find({ take: 2 });

    for (const [index, country] of Object.entries(countries)) {
      await testManager.mocks().createProject({
        countryCode: country.code,
        totalCost: 1000 + parseInt(index),
        abatementPotential: 2000 + parseInt(index),
      });
      await testManager.mocks().createProject({
        countryCode: country.code,
        totalCost: 1000 + parseInt(index),
        abatementPotential: 2000 + parseInt(index),
      });
    }

    const response = await testManager
      .request()
      .get(projectsContract.getProjectsMap.path);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.features.length).toBe(2);
    expect(response.body.features[0].properties.cost).toBe(2000);
    expect(response.body.features[0].properties.abatementPotential).toBe(4000);
    expect(response.body.features[1].properties.cost).toBe(2002);
    expect(response.body.features[1].properties.abatementPotential).toBe(4002);
  });

  test('Should return the aggregated values for the filtered projects', async () => {
    const mangroveProjectInSpain1 = await testManager.mocks().createProject({
      countryCode: 'ESP',
      totalCost: 1111,
      abatementPotential: 2222,
      ecosystem: ECOSYSTEM.MANGROVE,
    });
    const mangroveProjectInSpain2 = await testManager.mocks().createProject({
      countryCode: 'ESP',
      totalCost: 3333,
      abatementPotential: 4444,
      ecosystem: ECOSYSTEM.MANGROVE,
    });
    const seagrassProjectInSpain = await testManager.mocks().createProject({
      countryCode: 'ESP',
      totalCost: 5555,
      abatementPotential: 6666,
      ecosystem: ECOSYSTEM.SEAGRASS,
    });
    const mangroveProjectInPortugal = await testManager.mocks().createProject({
      countryCode: 'PRT',
      totalCost: 7777,
      abatementPotential: 8888,
      ecosystem: ECOSYSTEM.MANGROVE,
    });
    const seagrassProjectInPortugal = await testManager.mocks().createProject({
      countryCode: 'PRT',
      totalCost: 9999,
      abatementPotential: 10000,
      ecosystem: ECOSYSTEM.SEAGRASS,
    });

    const response = await testManager
      .request()
      .get(projectsContract.getProjectsMap.path)
      .query({ filter: { ecosystem: [ECOSYSTEM.MANGROVE] } });

    expect(response.body.features).toHaveLength(2);
    expect(response.body.features[0].properties.cost).toBe(
      mangroveProjectInSpain1.totalCost + mangroveProjectInSpain2.totalCost,
    );
    expect(response.body.features[1].properties.abatementPotential).toBe(
      mangroveProjectInPortugal.abatementPotential,
    );
  });

  test('Should return the geometries of the countries filtered by country code', async () => {
    const countries = await testManager
      .getDataSource()
      .getRepository(Country)
      .find({ take: 4 });

    const savedProjects: Project[] = [];

    for (const [index, country] of Object.entries(countries)) {
      const project = await testManager.mocks().createProject({
        countryCode: country.code,
        totalCost: 1000 + parseInt(index),
        abatementPotential: 2000 + parseInt(index),
      });
      savedProjects.push(project);
    }

    const response = await testManager
      .request()
      .get(projectsContract.getProjectsMap.path)
      .query({
        filter: { countryCode: [countries[0].code] },
      });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.features.length).toBe(1);
    expect(response.body.features[0].properties.country).toBe(
      countries[0].name,
    );
    expect(response.body.features[1].properties.country).toBe(
      countries[1].name,
    );
  });
});
