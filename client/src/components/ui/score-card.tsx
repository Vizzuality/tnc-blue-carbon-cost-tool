interface ScoreIndicatorProps {
  score: "high" | "medium" | "low";
  className?: string;
  children?: React.ReactNode;
}

export const ScoreIndicator = ({ score, children, className = "" }: ScoreIndicatorProps) => {
  const bgColorClass = {
    high: "bg-high",
    medium: "bg-medium",
    low: "bg-low",
  }[score];

  return (
    <div
      className={`flex h-10 items-center justify-center font-medium text-deep-ocean capitalize ${bgColorClass} ${className}`}
    >
      {children ? children : score}
    </div>
  );
};