import { FC } from "react";

import Link from "next/link";

import { useAtomValue } from "jotai";
import { LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";

import { intersectingAtom } from "@/containers/profile/store";

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
  const { data: session } = useSession();
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
  const intersecting = useAtomValue(intersectingAtom);

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
        <ol role="list">
          {navItems.map((o) => (
            <li key={`section-link-${o.id}`} role="listitem">
              <Link
                className={cn(
                  "block rounded-3xl text-sm font-semibold text-muted-foreground transition-colors hover:bg-big-stone-900",
                  intersecting === o.id && [
                    "bg-accent text-accent-foreground",
                    "hover:bg-accent hover:text-accent-foreground",
                  ],
                )}
                href={`#${o.id}`}
                id={getSidebarLinkId(o.id)}
                aria-controls={o.id}
                aria-current={intersecting === o.id ? "true" : undefined}
              >
                <div className="px-4 py-2">{o.name}</div>
              </Link>
            </li>
          ))}
        </ol>
      </nav>
      <Button
        variant="outline"
        className="w-full font-bold"
        onClick={async () => {
          await signOut();
        }}
      >
        <LogOutIcon className="h-3 w-3" />
        Log out
      </Button>
    </aside>
  );
};

export default ProfileSidebar;
