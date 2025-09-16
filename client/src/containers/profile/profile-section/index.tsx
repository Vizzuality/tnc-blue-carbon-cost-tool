import { FC, PropsWithChildren } from "react";

import { getSidebarNavItemAriaId } from "@/containers/sidebar/sidebar-navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProfileSectionProps extends PropsWithChildren {
  id: string;
  title: string;
  description?: string | React.ReactNode;
  className?: string | undefined;
}

const ProfileSection: FC<ProfileSectionProps> = ({
  id,
  title,
  description,
  children,
  className,
}) => {
  return (
    <section
      id={id}
      aria-labelledby={getSidebarNavItemAriaId(id)}
      className={className}
    >
      <Card variant="secondary" className="h-full p-6">
        <CardHeader className="space-y-4">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          {description && (
            <CardDescription className="text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">{children}</CardContent>
      </Card>
    </section>
  );
};

export default ProfileSection;
