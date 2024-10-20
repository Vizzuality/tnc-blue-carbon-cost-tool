import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from '@shared/entities/countries/country.entity';
import { CountriesController } from '@api/modules/countries/countries.controller';

import { MapController } from './map/map.controller';
import { CountryRepository } from '@api/modules/countries/countries.repository';
import { MapRepository } from '@api/modules/countries/map/map.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  controllers: [CountriesController, MapController],
  providers: [CountryRepository, MapRepository],
  exports: [],
})
export class CountriesModule {}
