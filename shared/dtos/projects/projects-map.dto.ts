import { z } from "zod";
import { FeatureCollection, Geometry } from "geojson";
import { ProjectGeoPropertiesSchema } from "@shared/schemas/geometries/projects";

export type ProjectGeoProperties = z.infer<typeof ProjectGeoPropertiesSchema>;

export type ProjectMap = FeatureCollection<Geometry, ProjectGeoProperties>;
