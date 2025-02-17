import { cn } from "@/lib/utils";

interface ListProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A list component that renders a list of items with a disc bullet point.
 * @param children - The list items to render.
 * @param className - Optional CSS classes to apply to the list.
 * @returns A list component.
 */
const List = ({ children, className }: ListProps) => {
  return (
    <ul className={cn("list-disc space-y-2 pl-4", className)}>{children}</ul>
  );
};

export { List };
