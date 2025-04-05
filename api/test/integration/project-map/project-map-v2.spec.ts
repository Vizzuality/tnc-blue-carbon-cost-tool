import { TestManager } from '../../utils/test-manager';
import { HttpStatus } from '@nestjs/common';
import { Project } from '@shared/entities/projects.entity';
import { Country } from '@shared/entities/country.entity';
import { projectsContract } from '@shared/contracts/projects.contract';

describe('Project Map V2', () => {
  let testManager: TestManager;
  let countries: Country[];

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    await testManager.ingestCountries();
    countries = await testManager
      .getDataSource()
      .getRepository(Country)
      .find({ take: 2 });
  });

  afterEach(async () => {
    await testManager.clearTablesByEntities([Project]);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  test('should fail if no projectIds are provided and or cost selector is provided', async () => {
    const response = await testManager
      .request()
      .get(projectsContract.getProjectsMapV2.path)
      .query({});

    console.log(response.body);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.errors).toHaveLength(2);
  });

  test('should return geometries with averages for npv', async () => {
    const projects: Project[] = [];
    const countryAreas: number[] = [];

    for (const [index, country] of Object.entries(countries)) {
      const areaHa = country.areaHa;
      countryAreas.push(areaHa!);

      const p1 = await testManager.mocks().createProject({
        countryCode: country.code,
        totalCost: 1000 + parseInt(index),
        totalCostNPV: 2000 + parseInt(index),
        abatementPotential: 3000 + parseInt(index),
        countryAbatementPotential: 3000 + parseInt(index),
      });

      const p2 = await testManager.mocks().createProject({
        countryCode: country.code,
        totalCost: 1000 + parseInt(index),
        totalCostNPV: 2000 + parseInt(index),
        abatementPotential: 3000 + parseInt(index),
        countryAbatementPotential: 3000 + parseInt(index),
      });

      projects.push(p1, p2);
    }

    const projectIds = projects.map((p) => p.id);

    const response = await testManager
      .request()
      .get(projectsContract.getProjectsMapV2.path)
      .query({
        projectIds,
        costRangeSelector: 'npv',
      });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.features).toHaveLength(2);

    for (let i = 0; i < 2; i++) {
      const expectedAbatement = 3000 + i;
      const expectedWeightedCost = (2000 + i) / countryAreas[i];
      expect(
        response.body.features[i].properties.abatementPotential,
      ).toBeCloseTo(expectedAbatement);
      expect(response.body.features[i].properties.cost).toBeCloseTo(
        expectedWeightedCost,
      );
    }
  });

  test('should return geometries with averages using projectIds and costRangeSelector total', async () => {
    const projects: Project[] = [];
    const countryAreas: number[] = [];

    for (const [index, country] of Object.entries(countries)) {
      const areaHa = country.areaHa;
      countryAreas.push(areaHa!);

      const p1 = await testManager.mocks().createProject({
        countryCode: country.code,
        totalCost: 1000 + parseInt(index),
        totalCostNPV: 2000 + parseInt(index),
        abatementPotential: 3000 + parseInt(index),
        countryAbatementPotential: 3000 + parseInt(index),
      });

      const p2 = await testManager.mocks().createProject({
        countryCode: country.code,
        totalCost: 1000 + parseInt(index),
        totalCostNPV: 2000 + parseInt(index),
        abatementPotential: 3000 + parseInt(index),
        countryAbatementPotential: 3000 + parseInt(index),
      });

      projects.push(p1, p2);
    }

    const projectIds = projects.map((p) => p.id);

    const response = await testManager
      .request()
      .get(projectsContract.getProjectsMapV2.path)
      .query({
        projectIds,
        costRangeSelector: 'total',
      });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.features).toHaveLength(2);

    for (let i = 0; i < 2; i++) {
      const expectedAbatement = 3000 + i;
      const expectedWeightedCost = (1000 + i) / countryAreas[i];
      expect(
        response.body.features[i].properties.abatementPotential,
      ).toBeCloseTo(expectedAbatement);
      expect(response.body.features[i].properties.cost).toBeCloseTo(
        expectedWeightedCost,
      );
    }
  });
});
