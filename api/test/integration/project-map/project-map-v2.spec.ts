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

  test('should return all projects when no filters are provided (default costRangeSelector = total)', async () => {
    const countryA = countries[0];
    const countryB = countries[1];

    await testManager.mocks().createProject({
      countryCode: countryA.code,
      totalCost: 1000,
      totalCostNPV: 2000,
      abatementPotential: 3000,
      countryAbatementPotential: 3000,
    });

    await testManager.mocks().createProject({
      countryCode: countryA.code,
      totalCost: 1000,
      totalCostNPV: 2000,
      abatementPotential: 3000,
      countryAbatementPotential: 3000,
    });

    await testManager.mocks().createProject({
      countryCode: countryB.code,
      totalCost: 1500,
      totalCostNPV: 2500,
      abatementPotential: 3500,
      countryAbatementPotential: 3500,
    });

    await testManager.mocks().createProject({
      countryCode: countryB.code,
      totalCost: 1500,
      totalCostNPV: 2500,
      abatementPotential: 3500,
      countryAbatementPotential: 3500,
    });

    const response = await testManager
      .request()
      .get(projectsContract.getProjectsMapV2.path)
      .query({});

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.features.length).toBe(2);

    const countryAResult = response.body.features.find(
      (f) => f.properties.country === countryA.name,
    );
    const countryBResult = response.body.features.find(
      (f) => f.properties.country === countryB.name,
    );

    expect(countryAResult.properties.abatementPotential).toBeCloseTo(3000);
    expect(countryBResult.properties.abatementPotential).toBeCloseTo(3500);

    const expectedCostA = 1000 / countryA.areaHa!;
    const expectedCostB = 1500 / countryB.areaHa!;
    expect(countryAResult.properties.cost).toBeCloseTo(expectedCostA);
    expect(countryBResult.properties.cost).toBeCloseTo(expectedCostB);
  });

  test('should return geometries with averages for npv', async () => {
    const projects: Project[] = [];
    const countryAreas: number[] = [];

    for (const [index, country] of Object.entries(countries)) {
      const areaHa = country.areaHa!;
      countryAreas.push(areaHa);

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

    const response = await testManager
      .request()
      .get(projectsContract.getProjectsMapV2.path)
      .query({
        filter: { countryCode: countries.map((c) => c.code) },
        costRangeSelector: 'npv',
      });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.features.length).toBe(2);

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

  test('should return geometries with averages for total cost', async () => {
    const projects: Project[] = [];
    const countryAreas: number[] = [];

    for (const [index, country] of Object.entries(countries)) {
      const areaHa = country.areaHa!;
      countryAreas.push(areaHa);

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

    const response = await testManager
      .request()
      .get(projectsContract.getProjectsMapV2.path)
      .query({
        filter: { countryCode: countries.map((c) => c.code) },
        costRangeSelector: 'total',
      });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.features.length).toBe(2);

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

  test('should return projects filtered by costRange', async () => {
    const country = countries[0];

    await testManager.mocks().createProject({
      countryCode: country.code,
      totalCost: 1500,
      totalCostNPV: 1500,
      abatementPotential: 2500,
      countryAbatementPotential: 2500,
    });

    await testManager.mocks().createProject({
      countryCode: country.code,
      totalCost: 5000,
      totalCostNPV: 5000,
      abatementPotential: 8000,
      countryAbatementPotential: 8000,
    });

    const response = await testManager
      .request()
      .get(projectsContract.getProjectsMapV2.path)
      .query({
        filter: { countryCode: [country.code] },
        costRange: [1000, 2000],
        costRangeSelector: 'total',
      });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.features).toHaveLength(1);
    expect(response.body.features[0].properties.abatementPotential).toBeCloseTo(
      2500,
    );
  });

  test('should return projects filtered by abatementPotentialRange', async () => {
    const country = countries[0];

    await testManager.mocks().createProject({
      countryCode: country.code,
      totalCost: 3000,
      totalCostNPV: 3000,
      abatementPotential: 5000,
      countryAbatementPotential: 5000,
    });

    await testManager.mocks().createProject({
      countryCode: country.code,
      totalCost: 3000,
      totalCostNPV: 3000,
      abatementPotential: 10000,
      countryAbatementPotential: 10000,
    });

    const response = await testManager
      .request()
      .get(projectsContract.getProjectsMapV2.path)
      .query({
        filter: { countryCode: [country.code] },
        abatementPotentialRange: [4000, 6000],
        costRangeSelector: 'npv',
      });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.features).toHaveLength(1);
    expect(response.body.features[0].properties.abatementPotential).toBeCloseTo(
      5000,
    );
  });
});
