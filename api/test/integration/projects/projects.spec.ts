import { TestManager } from '../../utils/test-manager';
import { HttpStatus } from '@nestjs/common';
import { projectsContract } from '@shared/contracts/projects.contract';
import { Country } from '@shared/entities/country.entity';
import { Project } from '@shared/entities/projects.entity';

describe('Projects', () => {
  let testManager: TestManager;
  let countriesInDb: Country[];

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    await testManager.ingestCountries();
    countriesInDb = await testManager
      .getDataSource()
      .getRepository(Country)
      .find();
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
      const projects: Project[] = [];
      for (const country of countriesInDb.slice(countriesInDb.length / 2)) {
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

    test('Should return a list of projects filtered by countries', async () => {
      const fiveCountriesWithNoGeometry = countriesInDb
        .slice(0, 5)
        .map((country) => {
          delete country.geometry;
          return country;
        });
      const projects: Project[] = [];
      for (const country of fiveCountriesWithNoGeometry) {
        projects.push(
          await testManager
            .mocks()
            .createProject({ countryCode: country.code }),
        );
      }

      const response = await testManager
        .request()
        .get(projectsContract.getProjects.path)
        .query({
          filter: {
            countryCode: [
              fiveCountriesWithNoGeometry[0].code,
              fiveCountriesWithNoGeometry[1].code,
            ],
          },
        });
      expect(response.body.data).toHaveLength(2);
      expect(
        response.body.data.map((project: Project) => project.projectName),
      ).toEqual(
        projects
          .filter(
            (project) =>
              project.countryCode === fiveCountriesWithNoGeometry[0].code ||
              project.countryCode === fiveCountriesWithNoGeometry[1].code,
          )
          .map((project) => project.projectName),
      );
    });

    test.only('Should return a list of projects filtered by project name', async () => {
      const projects: Project[] = [];
      projects.push(
        await testManager
          .mocks()
          .createProject({ projectName: 'PROJECT_NAME_ABC' }),
        await testManager
          .mocks()
          .createProject({ projectName: 'PROJECT_NAME_DEF' }),
      );

      const response = await testManager
        .request()
        .get(projectsContract.getProjects.path)
        .query({
          filter: {
            projectName: 'ABC',
          },
        });
      expect(response.body.data).toHaveLength(1);
      expect(
        response.body.data.map((project: Project) => project.projectName),
      ).toEqual(['PROJECT_NAME_ABC']);
    });
  });

  describe('Filters for Projects', () => {
    test('Should get a list of countries there are projects in', async () => {
      const fiveCountriesWithNoGeometry = countriesInDb
        .slice(0, 5)
        .map((country) => {
          delete country.geometry;
          return country;
        });

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
