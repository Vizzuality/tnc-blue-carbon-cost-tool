import { z } from 'zod';
import {
  AssumptionsSchema,
  ConservationCustomProjectSchema,
  CustomProjectSchema,
  InputCostsSchema,
  RestorationCustomProjectSchema,
} from '@shared/schemas/custom-projects/custom-project.schema';

export type CreateCustomProjectDto = z.infer<typeof CustomProjectSchema>;
export type ConservationCustomProjectDto = z.infer<
  typeof ConservationCustomProjectSchema
>;
export type OverridableCostInputsDto = z.infer<typeof InputCostsSchema>;
export type OverridableAssumptionsDto = z.infer<typeof AssumptionsSchema>;

export type RestorationProjectParamsDto = z.infer<
  typeof RestorationCustomProjectSchema
>;

export type ConservationProjectParamsDto = z.infer<
  typeof ConservationCustomProjectSchema
>;
