import Title from "@/components/ui/title";

interface SubHeaderProps {
  title: string;
  description: React.ReactNode | string;
}

const SubHeader = ({ title, description }: SubHeaderProps) => {
  return (
    <div className="space-y-2">
      <Title as="h4" size="sm" className="font-semibold underline">
        {title}
      </Title>
      <p>{description}</p>
    </div>
  );
};

export { SubHeader };
