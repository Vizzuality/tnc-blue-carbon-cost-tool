interface MathComponentProps {
  name: string;
  children: React.ReactNode;
}

const MathComponent = ({ name, children }: MathComponentProps) => {
  return (
    <div className="methodology-math flex flex-col items-center italic">
      <div>
        <div className="text-center text-sm">{children}</div>
        <p className="text-right text-xs">({name})</p>
      </div>
    </div>
  );
};

export default MathComponent;
