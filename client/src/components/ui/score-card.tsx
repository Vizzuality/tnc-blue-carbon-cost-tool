import { PROJECT_SCORE } from "@shared/entities/project-score.enum";

import { cn } from "@/lib/utils";

interface ScoreIndicatorProps {
  value: PROJECT_SCORE | null;
  className?: string;
}

const DEFAULT_BG_CLASSES: Record<PROJECT_SCORE, string> = {
  [PROJECT_SCORE.HIGH]: "bg-ramps-green",
  [PROJECT_SCORE.MEDIUM]: "bg-ramps-yellow",
  [PROJECT_SCORE.LOW]: "bg-ramps-red",
};

export const ScoreIndicator = ({ value, className }: ScoreIndicatorProps) => {
  return (
    <div
      className={cn(
        "flex h-10 items-center justify-center text-sm font-normal capitalize text-deep-ocean",
        value ? DEFAULT_BG_CLASSES[value] : "bg-gray-300",
        className,
      )}
    >
      {value}
    </div>
  );
};
