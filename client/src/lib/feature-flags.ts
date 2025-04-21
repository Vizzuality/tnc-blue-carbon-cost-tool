interface FeatureFlags {
  /** Controls the visibility of the intro modal */
  "intro-modal": boolean;
  /** Controls whether users can see edit button in:
   * - /projects/custom-project/details
   * - /projects/custom-project/summary
   *
   * As well as access the edit page in:
   * - /projects/[id]/edit
   *
   * @default false
   */
  "edit-project": boolean;

  /** Controls the visibility and sharing functionality in:
   * - /profile
   *
   * @default false
   */
  "share-information": boolean;
  /** Controls the project comparison functionality in:
   * - /overview/project-details (scorecard ratings and cost estimates comparison)
   *
   * @default false
   */
  "project-comparison": boolean;
  /** Controls the actions dropdown functionality in:
   * - /my-projects table
   *
   * @default false
   */
  "update-selection": boolean;
  /** Controls the visibility of the methodology page
   *
   * @default false
   */
  "methodology-page": boolean;
  /** Controls the visibility of the compare with other project page
   *
   * @default false
   */
  "compare-with-other-project": boolean;
}

const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  "intro-modal": true,
  "edit-project": true,
  "share-information": true,
  "project-comparison": false,
  "update-selection": false,
  "methodology-page": true,
  "compare-with-other-project": false,
};

const parseFeatureFlagsFromEnv = (
  features: string | undefined,
): {
  enabledFromEnv: Set<string>;
  disabledFromEnv: Set<string>;
} => {
  const enabledFromEnv = new Set<string>();
  const disabledFromEnv = new Set<string>();

  if (!features) {
    return { enabledFromEnv, disabledFromEnv };
  }

  features.split(",").forEach((feature) => {
    const trimmed = feature.trim();

    if (trimmed.startsWith("!")) {
      disabledFromEnv.add(trimmed.slice(1));
    } else {
      enabledFromEnv.add(trimmed);
    }
  });

  return { enabledFromEnv, disabledFromEnv };
};

const getFeatureFlags = () => {
  const { enabledFromEnv, disabledFromEnv } = parseFeatureFlagsFromEnv(
    process.env.NEXT_PUBLIC_FEATURE_FLAGS,
  );

  return (
    Object.keys(DEFAULT_FEATURE_FLAGS) as Array<keyof FeatureFlags>
  ).reduce(
    (flags, key) => ({
      ...flags,
      [key]: disabledFromEnv.has(key)
        ? false
        : enabledFromEnv.has(key) || DEFAULT_FEATURE_FLAGS[key],
    }),
    {} as FeatureFlags,
  );
};

/**
 * Static object containing the current feature flags.
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
export const FEATURE_FLAGS: FeatureFlags = getFeatureFlags();
