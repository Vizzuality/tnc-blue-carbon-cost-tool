import { DataIngestionEntity } from "@shared/entities/model-versioning/data-ingestion.entity";

export type Changelog = Pick<
  DataIngestionEntity,
  "createdAt" | "versionName" | "versionNotes"
>;
