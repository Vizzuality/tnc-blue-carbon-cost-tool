import { Injectable } from '@nestjs/common';
import { AppBaseService } from '@api/utils/app-base.service';
import { Country } from '@shared/entities/country.entity';

@Injectable()
export class CountriesService extends AppBaseService<
  Country,
  unknown,
  unknown,
  unknown
> {}
