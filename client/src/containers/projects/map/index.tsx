"use client";

import { ComponentProps } from "react";

import { useAtomValue } from "jotai";

import { projectsMapState } from "@/app/(projects)/store";

import Controls from "@/containers/projects/map/controls";
import LegendControl from "@/containers/projects/map/controls/legend";
import ZoomControl from "@/containers/projects/map/controls/zoom";
import ProjectsLayer from "@/containers/projects/map/layers/projects";
import { MATRIX_COLORS } from "@/containers/projects/map/layers/projects/utils";
import Legend from "@/containers/projects/map/legend";
import MatrixLegend from "@/containers/projects/map/legend/types/matrix";

import Map from "@/components/map";

export default function ProjectsMap() {
  const { legendOpen } = useAtomValue(projectsMapState);

  const matrixItems: ComponentProps<typeof MatrixLegend>["intersections"] =
    Object.keys(MATRIX_COLORS).map((key, index) => ({
      color: key,
      id: index,
    }));

  return (
    <div className="h-full overflow-hidden rounded-2xl">
      <Map>
        <Controls>
          <ZoomControl />
        </Controls>
        <Controls className="bottom-8 top-auto">
          <LegendControl />
        </Controls>
        {legendOpen && (
          <Legend>
            <MatrixLegend items={[]} intersections={matrixItems} />
          </Legend>
        )}
        <ProjectsLayer />
      </Map>
    </div>
  );
}
