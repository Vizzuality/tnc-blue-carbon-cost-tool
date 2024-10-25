import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesController } from '@api/modules/countries/countries.controller';
import { MapController } from './map/map.controller';
import { MapRepository } from '@api/modules/countries/map/map.repository';
import { Country } from '@shared/entities/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  controllers: [CountriesController, MapController],
  providers: [MapRepository],
  exports: [],
})
export class CountriesModule {}
