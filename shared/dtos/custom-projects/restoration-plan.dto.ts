
// Type for RestorationPlan used for Restoration Custom projects returned to the consumer

// TODO: Probably better to use the inferred type from the custom project schema?

export type RestorationPlanDto = {
    year: number;
    annualHectaresRestored: number;
}