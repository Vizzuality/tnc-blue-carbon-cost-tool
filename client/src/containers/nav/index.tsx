"use client";

import { useMemo } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROLES } from "@shared/entities/users/roles.enum";
import {
  ClipboardEditIcon,
  ClipboardListIcon,
  FileQuestionIcon,
  LayoutDashboardIcon,
  ServerCogIcon,
  UserIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";

import { useFeatureFlags } from "@/hooks/use-feature-flags";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = {
  main: [
    {
      title: "Project Overview",
      url: "/",
      icon: LayoutDashboardIcon,
      match: (pathname: string) => pathname === "/",
    },
    {
      title: "Create custom project",
      url: "/projects/new",
      icon: ClipboardEditIcon,
      match: (pathname: string) => pathname === "/projects/new",
    },
    {
      title: "My custom projects",
      url: "/my-projects",
      icon: ClipboardListIcon,
      match: (pathname: string) => pathname === "/my-projects",
      isAuth: true,
    },
    {
      title: "Admin",
      url: "/admin",
      icon: ServerCogIcon,
      match: (pathname: string) => pathname.startsWith("/admin"),
      isAdmin: true,
    },
  ],
  footer: [
    {
      title: "Methodology",
      url: "/methodology",
      icon: FileQuestionIcon,
      match: (pathname: string) => pathname === "/methodology",
    },
  ],
};

export default function MainNav() {
  const { open } = useSidebar();
  const { status, data } = useSession();
  const pathname = usePathname();
  const isAdmin = data?.user.role === ROLES.ADMIN;
  const { "methodology-page": methodologyPage } = useFeatureFlags();
  const mainNavItems = useMemo(
    () =>
      navItems.main.filter((item) => {
        if (item.isAdmin) {
          return isAdmin;
        }
        if (item.isAuth) {
          return status === "authenticated";
        }
        return true;
      }),
    [isAdmin, status],
  );
  const footerNavItems = useMemo(() => {
    return navItems.footer.filter(() => methodologyPage);
  }, [methodologyPage]);

  return (
    <Sidebar collapsible="icon" className="py-6">
      <SidebarHeader>
        <span>{open ? "Blue Carbon Cost Tool" : "BCCT"}</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive = item.match(pathname);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={{
                        children: item.title,
                        hidden: open,
                      }}
                      className={cn(
                        isActive &&
                          "bg-sidebar-accent text-sidebar-accent-foreground",
                      )}
                    >
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {footerNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={{
                  children: item.title,
                  hidden: open,
                }}
              >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={{
                children: status === "authenticated" ? "Profile" : "Sign in",
                hidden: open,
              }}
            >
              <Link
                href={status === "authenticated" ? "/profile" : "/auth/signin"}
              >
                <UserIcon />
                <span>
                  {status === "authenticated" ? "Profile" : "Sign in"}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
