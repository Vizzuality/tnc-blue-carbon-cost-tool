import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';

export class CreateCustomProjectDto {
  name: string;
  countryCode: string;
  ecosystem: ECOSYSTEM;
  /**
   * note: In the notebook example, if no restoration activity parameter is provided, we assume that the activity is Conservation.
   */
}
