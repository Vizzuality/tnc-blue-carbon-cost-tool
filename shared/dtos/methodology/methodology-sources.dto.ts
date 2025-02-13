import { MethodologySourcesConfig } from "@shared/config/methodology.config";
import { ModelComponentSource } from "@shared/entities/methodology/model-component-source.entity";

type MethodologySourcesConfigType = (typeof MethodologySourcesConfig)[number];
type Category = MethodologySourcesConfigType["category"];

type ValidLabels<T extends Category> = Extract<
  MethodologySourcesConfigType,
  { category: T }
>["label"];

type ExtractedConfigByLabel<
  T extends Category,
  N extends ValidLabels<T>[number],
> = Extract<MethodologySourcesConfigType, { category: T; label: N }>;

type SourcesByComponentName<
  T extends Category,
  N extends ValidLabels<T>[number],
> = {
  name: N;
  sources: ExtractedConfigByLabel<T, N>["relationshipType"] extends "m2m"
    ? Record<
        Extract<
          ExtractedConfigByLabel<T, N>,
          { relationshipType: "m2m" }
        >["propertiesWithSources"][number],
        Partial<ModelComponentSource>[]
      >
    : Partial<ModelComponentSource>[];
};

export type MethodologySourcesDto = {
  [T in Category]: {
    category: T;
    sourcesByComponentName: {
      [N in ValidLabels<T>]: SourcesByComponentName<T, N>;
    }[ValidLabels<T>][];
  };
}[Category][];
