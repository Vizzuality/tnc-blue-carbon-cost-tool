import { useMemo } from "react";

interface FeatureFlags {
  /** Controls the visibility of the intro modal */
  "intro-modal": boolean;
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
  "intro-modal": true,
  "edit-project": false,
  "share-information": false,
  "project-comparison": false,
  "update-selection": false,
  "methodology-page": false,
  "compare-with-other-project": false,
};

const parseFeatureFlagsFromEnv = (featureString: string | undefined) => {
  const featureList = featureString?.split(",").map((f) => f.trim()) || [];
  return {
    enabledFeatures: new Set(featureList.filter((f) => !f.startsWith("!"))),
    disabledFeatures: new Set(
      featureList.filter((f) => f.startsWith("!")).map((f) => f.slice(1)),
    ),
  };
};

/**
 * Hook to get the feature flags.
 *
 * Features can be explicitly enabled or disabled using the NEXT_PUBLIC_FEATURE_FLAGS
 * environment variable:
 * - A feature name by itself (e.g., "feature1") enables the feature
 * - A feature name with '!' prefix (e.g., "!feature2") explicitly disables the feature
 * - Multiple features can be comma-separated: "feature1,!feature2,feature3"
 *
 * Fallback to default flags if the environment variable is not set
 *
 * @returns The feature flags for the current user.
 */
export function useFeatureFlags(): FeatureFlags {
  return useMemo(() => {
    const { enabledFeatures, disabledFeatures } = parseFeatureFlagsFromEnv(
      process.env.NEXT_PUBLIC_FEATURE_FLAGS,
    );

    return (
      Object.keys(DEFAULT_FEATURE_FLAGS) as Array<keyof FeatureFlags>
    ).reduce(
      (flags, key) => ({
        ...flags,
        [key]: disabledFeatures.has(key)
          ? false
          : enabledFeatures.has(key) || DEFAULT_FEATURE_FLAGS[key],
      }),
      {} as FeatureFlags,
    );
  }, []);
}
