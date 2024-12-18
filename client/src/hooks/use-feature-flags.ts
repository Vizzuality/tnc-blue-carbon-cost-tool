const FEATURE_FLAGS = {
  "edit-project": false,
  "share-information": false,
} as const;

type FeatureFlags = typeof FEATURE_FLAGS;

export function useFeatureFlags(): FeatureFlags {
  // TODO: Implement feature flags with env variable
  return FEATURE_FLAGS;
}
