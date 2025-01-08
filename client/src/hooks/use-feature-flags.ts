import { useMemo } from "react";

interface FeatureFlags {
  /** Controls whether users can edit project details and settings in:
   * - /projects/custom-project/details
   * - /projects/custom-project/summary
   */
  "edit-project": boolean;

  /** Controls the visibility and sharing functionality in:
   * - /profile
   */
  "share-information": boolean;
  /** Controls the project comparison functionality in:
   * - /overview/project-details (scorecard ratings and cost estimates comparison)
   */
  "project-comparison": boolean;
  /** Controls the actions dropdown functionality in:
   * - /my-projects table
   */
  "update-selection": boolean;
  /** Controls the visibility of the methodology page */
  "methodology-page": boolean;
  "compare-with-other-project": boolean;
}

const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  "edit-project": false,
  "share-information": false,
  "project-comparison": false,
  "update-selection": false,
  "methodology-page": false,
  "compare-with-other-project": false,
};

/**
 * Hook to get the feature flags for the current user.
 * Checks the environment variable FEATURE_FLAGS to see which flags are enabled.
 * If the environment variable is not set, falls back to default flags.
 *
 * @returns The feature flags for the current user.
 */
export function useFeatureFlags(): FeatureFlags {
  return useMemo(() => {
    const enabledFeatures = new Set(
      process.env.NEXT_PUBLIC_FEATURE_FLAGS?.split(",").map((f) => f.trim()) ||
        [],
    );

    return (
      Object.keys(DEFAULT_FEATURE_FLAGS) as Array<keyof FeatureFlags>
    ).reduce(
      (flags, key) => ({
        ...flags,
        [key]: enabledFeatures.has(key) || DEFAULT_FEATURE_FLAGS[key],
      }),
      {} as FeatureFlags,
    );
  }, []);
}
