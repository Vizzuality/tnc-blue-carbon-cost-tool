import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { FeatureCollection } from "typeorm";

const contract = initContract();
export const mapContract = contract.router({
  getGeoFeatures: {
    method: "GET",
    path: "/map/geo-features",
    responses: {
      200: contract.type<FeatureCollection>(),
    },
    query: z.object({ countryCode: z.string().length(3).optional() }),
  },
});
