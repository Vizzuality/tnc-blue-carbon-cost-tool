import { z } from "zod";
import { FeatureCollection, Geometry } from "geojson";
import { ProjectGeoPropertiesSchema } from "@shared/schemas/geometries/projects";
import {
  PROJECT_PRICE_TYPE,
  PROJECT_SIZE_FILTER,
} from "@shared/entities/projects.entity";
import { ACTIVITY } from "@shared/entities/activity.enum";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";

export type ProjectGeoProperties = z.infer<typeof ProjectGeoPropertiesSchema>;

export type ProjectMap = FeatureCollection<Geometry, ProjectGeoProperties>;

export type ProjectMapFilters = {
  countryCode?: string[];
  totalCost?: number[];
  abatementPotential?: number[];
  activity?: ACTIVITY;
  activitySubtype?: string[];
  ecosystem?: ECOSYSTEM;
  projectSizeFilter?: PROJECT_SIZE_FILTER;
  priceType?: PROJECT_PRICE_TYPE;
};
