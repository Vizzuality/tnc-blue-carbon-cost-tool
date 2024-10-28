import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { FeatureCollection, Geometry } from "geojson";
import { ProjectGeoProperties } from "@shared/schemas/geometries/projects";

const contract = initContract();
export const mapContract = contract.router({
  getGeoFeatures: {
    method: "GET",
    path: "/map/geo-features",
    responses: {
      200: contract.type<FeatureCollection<Geometry, ProjectGeoProperties>>(),
    },
    query: z.object({ countryCode: z.string().length(3).optional() }),
  },
});
