import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { FeatureCollection, Geometry } from "geojson";

const contract = initContract();
export const mapContract = contract.router({
  getGeoFeatures: {
    method: "GET",
    path: "/map/geo-features",
    responses: {
      200: contract.type<FeatureCollection<Geometry, any>>(),
    },
    // TODO: Not sure this endpoint will ever be used, check with andres
    query: z.object({ countryCode: z.string().length(3).optional() }),
  },
});
