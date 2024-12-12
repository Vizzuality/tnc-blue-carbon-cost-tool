import { PROJECT_SCORE } from "@shared/entities/project-score.enum";

import { cn } from "@/lib/utils";

interface ScoreIndicatorProps {
  className?: string;
  children?: React.ReactNode;
}

export const DEFAULT_BG_CLASSES: Record<PROJECT_SCORE, string> = {
  [PROJECT_SCORE.HIGH]: "bg-high",
  [PROJECT_SCORE.MEDIUM]: "bg-medium",
  [PROJECT_SCORE.LOW]: "bg-low",
};

export const ScoreIndicator = ({
  children,
  className = "",
}: ScoreIndicatorProps) => {
  return (
    <div
      className={cn(
        "flex h-10 items-center justify-center font-normal capitalize text-deep-ocean",
        className,
      )}
    >
      {children}
    </div>
  );
};
