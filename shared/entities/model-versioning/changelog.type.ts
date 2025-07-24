import { ModelComponentsVersionEntity } from "@shared/entities/model-versioning/model-components-version.entity";

export type Changelog = Pick<
  ModelComponentsVersionEntity,
  "createdAt" | "versionName" | "versionNotes"
>;
