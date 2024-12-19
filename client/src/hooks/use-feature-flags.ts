const FEATURE_FLAGS = {
  /** Controls whether users can edit project details and settings in:
   * - /projects/custom-project/details
   * - /projects/custom-project/summary
   */
  "edit-project": false,

  /** Controls the visibility and sharing functionality in:
   * - /profile
   */
  "share-information": false,
  /** Controls the project comparison functionality in:
   * - /overview/project-details (scorecard ratings and cost estimates comparison)
   */
  "project-comparison": false,
  /** Controls the actions dropdown functionality in:
   * - /my-projects table
   */
  "update-selection": false,
  /** Controls the visibility of the methodology page */
  "methodology-page": false,
  "compare-with-other-project": false,
} as const;

type FeatureFlags = typeof FEATURE_FLAGS;

export function useFeatureFlags(): FeatureFlags {
  // TODO: Implement feature flags with env variable
  return FEATURE_FLAGS;
}
