import { FC, PropsWithChildren } from "react";

import { getSidebarNavItemAriaId } from "@/containers/sidebar/sidebar-navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface ProfileSectionProps extends PropsWithChildren {
  id: string;
  title: string;
  description?: string | React.ReactNode;
}

const ProfileSection: FC<ProfileSectionProps> = ({
  id,
  title,
  description,
  children,
}) => {
  return (
    <section id={id} aria-labelledby={getSidebarNavItemAriaId(id)}>
      <Card variant="secondary" className="p-6">
        <CardHeader className="space-y-4">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          {description && (
            <CardDescription className="text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="spacey-y-6">{children}</CardContent>
      </Card>
    </section>
  );
};

export default ProfileSection;
