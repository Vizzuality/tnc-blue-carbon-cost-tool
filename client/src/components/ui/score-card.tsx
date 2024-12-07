export type Score = "high" | "medium" | "low";

interface ScoreIndicatorProps {
  score: Score;
  className?: string;
  children?: React.ReactNode;
}

export const ScoreIndicator = ({
  score,
  children,
  className = "",
}: ScoreIndicatorProps) => {
  const bgColorClass = {
    high: "bg-high",
    medium: "bg-medium",
    low: "bg-low",
  }[score];

  return (
    <div
      className={`flex h-10 items-center justify-center font-medium capitalize text-deep-ocean ${bgColorClass} ${className}`}
    >
      {children ? children : score}
    </div>
  );
};
