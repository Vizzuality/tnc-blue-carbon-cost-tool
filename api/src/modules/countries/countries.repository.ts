import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from '@shared/entities/countries/country.entity';

@Injectable()
export class CountryRepository extends Repository<Country> {
  constructor(
    @InjectRepository(Country)
    private readonly repository: Repository<Country>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
