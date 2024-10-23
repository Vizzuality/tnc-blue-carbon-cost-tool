import { useSetAtom } from "jotai";
import { Layers } from "lucide-react";

import { cn } from "@/lib/utils";

import { projectsMapState } from "@/app/(projects)/store";

const BUTTON_CLASSES = {
  default:
    "flex h-8 w-8 items-center justify-center rounded-full border border-white bg-white text-black shadow-md transition-colors",
  hover: "hover:border-gray-400 active:border-gray-400",
};

export default function LegendControl() {
  const setProjectsMapState = useSetAtom(projectsMapState);
  const handleMapLegend = () => {
    setProjectsMapState((prev) => ({
      ...prev,
      legendOpen: !prev.legendOpen,
    }));
  };

  return (
    <button
      className={cn(BUTTON_CLASSES.default, BUTTON_CLASSES.hover)}
      aria-label="Toggle legend"
      type="button"
      onClick={handleMapLegend}
    >
      <Layers className="h-4 w-4" />
    </button>
  );
}
