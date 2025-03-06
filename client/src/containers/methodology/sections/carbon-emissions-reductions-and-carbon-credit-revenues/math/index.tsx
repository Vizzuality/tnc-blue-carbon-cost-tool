import { ScrollArea } from "@/components/ui/scroll-area";

interface MathComponentProps {
  name: string;
  children: React.ReactNode;
}

const MathComponent = ({ name, children }: MathComponentProps) => {
  return (
    <div className="methodology-math italic">
      <ScrollArea hasHorizontalScroll className="text-center text-sm">
        {children}
      </ScrollArea>
      <p className="text-right text-xs">({name})</p>
    </div>
  );
};

export default MathComponent;
