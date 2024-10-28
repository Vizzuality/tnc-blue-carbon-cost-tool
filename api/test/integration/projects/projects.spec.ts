import { TestManager } from '../../utils/test-manager';
import { HttpStatus } from '@nestjs/common';
import { projectsContract } from '@shared/contracts/projects.contract';
import { Country } from '@shared/entities/country.entity';
import { Project } from '@shared/entities/projects.entity';

describe('Projects', () => {
  let testManager: TestManager;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    await testManager.ingestCountries();
  });

  afterEach(async () => {
    await testManager.getDataSource().getRepository(Project).delete({});
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  describe('Get Projects', () => {
    test('Should return a list of Projects', async () => {
      const countries = await testManager
        .getDataSource()
        .getRepository(Country)
        .find();

      const projects: Project[] = [];
      for (const country of countries.slice(countries.length / 2)) {
        projects.push(
          await testManager
            .mocks()
            .createProject({ countryCode: country.code }),
        );
      }

      const response = await testManager
        .request()
        .get(projectsContract.getProjects.path)
        .query({ disablePagination: true });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.length).toBe(projects.length);
    });
  });

  describe('Filters for Projects', () => {
    test('Should get a list of countries there are projects in', async () => {
      const fiveCountriesWithNoGeometry = await testManager
        .getDataSource()
        .getRepository(Country)
        .find()
        .then((countries) =>
          countries.slice(0, 5).map((c) => {
            const { geometry, ...rest } = c;
            return rest;
          }),
        );

      for (const country of fiveCountriesWithNoGeometry) {
        await testManager.mocks().createProject({ countryCode: country.code });
      }
      const response = await testManager
        .request()
        .get(projectsContract.getProjectCountries.path);

      expect(fiveCountriesWithNoGeometry).toEqual(
        expect.arrayContaining(response.body.data),
      );
    });
  });
});
