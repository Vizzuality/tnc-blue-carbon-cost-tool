import { Injectable } from '@nestjs/common';
import { AppBaseService } from '@api/utils/app-base.service';
import { Project } from '@shared/entities/projects.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CountryWithNoGeometry } from '@shared/entities/country.entity';
import { CountriesService } from '@api/modules/countries/countries.service';

@Injectable()
export class ProjectsService extends AppBaseService<
  Project,
  unknown,
  unknown,
  unknown
> {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly countryService: CountriesService,
  ) {
    super(projectRepository, 'project', 'projects');
  }

  async getProjectCountries(): Promise<CountryWithNoGeometry[]> {
    const projects = await this.projectRepository.find();
    const [countries] = await this.countryService.findAll({
      filter: { code: In(projects.map((p) => p.countryCode)) },
      omitFields: ['geometry'],
    });
    return countries as CountryWithNoGeometry[];
  }
}
