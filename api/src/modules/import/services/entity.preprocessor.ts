import { Injectable } from '@nestjs/common';
import { Country } from '@shared/entities/countries/country.entity';
import { BaseData } from '@api/modules/base-data/base-data.entity';

export type ParsedDBEntities = {
  countries: Country[];
  baseData: BaseData[];
};

@Injectable()
export class EntityPreprocessor {
  toDbEntities(data: {
    Countries: any[];
    master_table: any[];
  }): ParsedDBEntities {
    const { Countries: rawCountries, master_table: rawBaseData } = data;

    const countries = this.processCountries(rawCountries);
    const baseData = this.processBaseData(rawBaseData);

    return {
      countries,
      baseData,
    };
  }

  private processCountries(rawCountries: any[]): Country[] {
    return rawCountries.map((rawCountry) => {
      const country = new Country();
      country.country = rawCountry.country;
      country.countryCode = rawCountry.country_code;
      country.continent = this.emptyStringToNull(rawCountry.continent_id);
      country.numericCode = rawCountry.numeric;
      country.hdi = this.emptyStringToNull(rawCountry.hdi_id);
      country.region1 = this.emptyStringToNull(rawCountry.region_1);
      country.region2 = this.emptyStringToNull(rawCountry.region_2);
      return country;
    });
  }

  private processBaseData(rawBaseData: any[]): BaseData[] {
    return rawBaseData.map((rawData) => {
      const baseData = new BaseData();
      baseData.ecosystem = rawData.ecosystem;
      baseData.activity = rawData.activity;
      baseData.countryCode = rawData.country_code;
      baseData.projectSizeHa = this.emptyStringToNull(rawData.project_size_ha);
      return baseData;
    });
  }

  private emptyStringToNull(value: any): any | null {
    return value || null;
  }
}
