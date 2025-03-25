import { FC } from "react";

import { useAtomValue } from "jotai";
import { LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { REDIRECT_SIGNIN_PATH } from "@/lib/constants";
import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { signOutFromBackoffice } from "@/lib/utils";

import { profileStepAtom } from "@/containers/profile/store";
import Sidebar from "@/containers/sidebar";
import SidebarNavigation, {
  SidebarNavigationItem,
} from "@/containers/sidebar/sidebar-navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const getInitials = (fullName?: string): string => {
  if (!fullName) return "";
  const names = fullName.trim().split(" ");

  return names
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase())
    .join("");
};

interface ProfileSidebarProps {
  navItems: SidebarNavigationItem[];
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
  const intersecting = useAtomValue(profileStepAtom);

  return (
    <Sidebar className="gap-8 pt-3">
      <div className="flex gap-4">
        <Avatar>
          <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
        </Avatar>
        <div className="text-sm">
          <p className="font-semibold">{user?.name}</p>
          <p className="font-normal">{user?.email}</p>
        </div>
      </div>
      <SidebarNavigation
        srOnlyTitle="User area navigation"
        items={navItems}
        currentSection={intersecting}
      />
      <Button
        variant="outline"
        className="w-full font-bold"
        onClick={async () => {
          await signOut({ callbackUrl: REDIRECT_SIGNIN_PATH });
          await signOutFromBackoffice();
        }}
      >
        <LogOutIcon className="h-3 w-3" />
        Log out
      </Button>
    </Sidebar>
  );
};

export default ProfileSidebar;
