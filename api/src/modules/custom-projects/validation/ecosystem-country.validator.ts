import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { RESTORATION_ACTIVITY_SUBTYPE } from '@shared/entities/activity.enum';

@ValidatorConstraint({
  name: 'ValidateCountryForActivityType',
  async: false,
})
export class ValidateCountryForActivityType
  implements ValidatorConstraintInterface
{
  validate(country: string, args: ValidationArguments): boolean {
    const obj = args.object as any;

    return !(
      (obj.ecosystem === ECOSYSTEM.MANGROVE &&
        obj.restorationActivitySubtype ===
          RESTORATION_ACTIVITY_SUBTYPE.HYBRID &&
        country.toUpperCase() in
          ['IDN', 'AUS', 'BHS', 'KEN', 'COL', 'IND', 'CHN', 'ECU']) ||
      (obj.ecosystem === ECOSYSTEM.MANGROVE &&
        obj.restorationActivitySubtype ===
          RESTORATION_ACTIVITY_SUBTYPE.HYDROLOGY &&
        country.toUpperCase() === 'ECU') ||
      (obj.ecosystem === ECOSYSTEM.SEAGRASS &&
        obj.restorationActivitySubtype ===
          RESTORATION_ACTIVITY_SUBTYPE.PLANTING &&
        country.toUpperCase() === 'ECU') ||
      (obj.ecosystem === ECOSYSTEM.SEAGRASS &&
        obj.restorationActivitySubtype ===
          RESTORATION_ACTIVITY_SUBTYPE.HYBRID) ||
      (obj.ecosystem === ECOSYSTEM.SEAGRASS &&
        obj.restorationActivitySubtype ===
          RESTORATION_ACTIVITY_SUBTYPE.HYDROLOGY) ||
      (obj.ecosystem === ECOSYSTEM.SALT_MARSH &&
        obj.restorationActivitySubtype ===
          RESTORATION_ACTIVITY_SUBTYPE.PLANTING &&
        country.toUpperCase() === 'ECU') ||
      (obj.ecosystem === ECOSYSTEM.SALT_MARSH &&
        obj.restorationActivitySubtype ===
          RESTORATION_ACTIVITY_SUBTYPE.HYBRID &&
        country.toUpperCase() in
          ['IDN', 'AUS', 'BHS', 'KEN', 'COL', 'IND', 'CHN', 'ECU']) ||
      (obj.ecosystem === ECOSYSTEM.SALT_MARSH &&
        obj.restorationActivitySubtype ===
          RESTORATION_ACTIVITY_SUBTYPE.HYDROLOGY &&
        country.toUpperCase() === 'ECU')
    );
  }

  defaultMessage(): string {
    return 'No data available for the selected country and activity subtype type.';
  }
}
