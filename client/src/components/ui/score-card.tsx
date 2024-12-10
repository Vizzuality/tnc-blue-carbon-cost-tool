import { PROJECT_SCORE } from "@shared/entities/project-score.enum";

import { cn } from "@/lib/utils";

interface ScoreIndicatorProps {
  className?: string;
  children?: React.ReactNode;
  bgColorClasses?: Record<PROJECT_SCORE, string>;
}

export const DEFAULT_BG_CLASSES = {
  high: "bg-high",
  medium: "bg-medium",
  low: "bg-low",
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
