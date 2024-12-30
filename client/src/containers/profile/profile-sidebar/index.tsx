import { FC } from "react";

import Link from "next/link";

import { useAtomValue } from "jotai";
import { LogOutIcon } from "lucide-react";

import { useAuth } from "@/lib/auth/context";
import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { profileStepAtom } from "@/containers/profile/store";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const getSidebarLinkId = (slug?: string): string =>
  `profile-sidebar-${slug}-link`;

const getInitials = (fullName?: string): string => {
  if (!fullName) return "";
  const names = fullName.trim().split(" ");

  return names
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase())
    .join("");
};

interface ProfileSidebarProps {
  navItems: { name: string; id: string }[];
}
const ProfileSidebar: FC<ProfileSidebarProps> = ({ navItems }) => {
  const { session, logout } = useAuth();
  const { data: user } = client.user.findMe.useQuery(
    queryKeys.user.me(session?.user?.id as string).queryKey,
    {
      extraHeaders: {
        authorization: `Bearer ${session?.accessToken as string}`,
      },
    },
    {
      select: (data) => data.body.data,
      queryKey: queryKeys.user.me(session?.user?.id as string).queryKey,
    },
  );
  const intersecting = useAtomValue(profileStepAtom);

  return (
    <aside className="flex h-full flex-col gap-8 pb-6 pt-3">
      <div className="flex gap-4">
        <Avatar>
          <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
        </Avatar>
        <div className="text-sm">
          <p className="font-semibold">{user?.name}</p>
          <p className="font-normal">{user?.email}</p>
        </div>
      </div>
      <nav className="flex-1" aria-labelledby="sidebar-nav-title">
        <h2 id="sidebar-nav-title" className="sr-only">
          User area navigation
        </h2>
        <ul role="list" className="space-y-2">
          {navItems.map((o) => (
            <li key={`section-link-${o.id}`} role="listitem">
              <Button
                variant={intersecting === o.id ? "default" : "ghost"}
                asChild
                className="w-full justify-start font-medium"
              >
                <Link
                  href={`#${o.id}`}
                  id={getSidebarLinkId(o.id)}
                  aria-controls={o.id}
                  aria-current={intersecting === o.id ? "true" : undefined}
                >
                  {o.name}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <Button
        variant="outline"
        className="w-full font-bold"
        onClick={async () => {
          await logout();
        }}
      >
        <LogOutIcon className="h-3 w-3" />
        Log out
      </Button>
    </aside>
  );
};

export default ProfileSidebar;
