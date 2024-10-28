import { Source, Layer } from "react-map-gl";

import * as d3 from "d3";
import { FillLayerSpecification } from "mapbox-gl";

import { client } from "@/lib/query-client";
import { geometriesKeys } from "@/lib/query-keys";

import { useSyncCountry } from "@/app/(projects)/url-store";

import { generateColorRamp } from "@/containers/projects/map/layers/projects/utils";

export default function ProjectsLayer() {
  const [country] = useSyncCountry();

  const queryKey = country
    ? geometriesKeys.country(country).queryKey
    : geometriesKeys.all.queryKey;

  const { data, isSuccess } = client.map.getGeoFeatures.useQuery(
    queryKey,
    {
      query: {
        ...(country && { countryCode: country }),
      },
    },
    {
      select: (d) => d.body,
      queryKey,
    },
  );

  if (isSuccess && data) {
    const costAbatementSource = {
      id: "cost-abatement-source",
      type: "geojson",
      data,
    };

    const maxCost = d3.max(data.features, (d) => d.properties.cost);
    const maxAbatement = d3.max(
      data.features,
      (d) => d.properties.abatementPotential,
    );

    const COLOR_NUMBER = 2;
    const colors = generateColorRamp(COLOR_NUMBER);

    const costAbatementLayer: FillLayerSpecification = {
      id: "cost-abatement-layer",
      type: "fill",
      source: costAbatementSource.id,
      paint: {
        "fill-color": [
          "match",
          [
            "concat",
            [
              "ceil",
              [
                "/",
                ["*", ["/", ["get", "cost"], maxCost], 100],
                100 / COLOR_NUMBER,
              ],
            ],
            [
              "ceil",
              [
                "/",
                ["*", ["/", ["get", "abatementPotential"], maxAbatement], 100],
                100 / COLOR_NUMBER,
              ],
            ],
          ],
          ...colors,
          "#FFF",
        ],
        "fill-opacity": 1,
      },
    };

    return (
      <>
        <Source {...costAbatementSource} />
        <Layer {...costAbatementLayer} />
      </>
    );
  }

  return null;
}
