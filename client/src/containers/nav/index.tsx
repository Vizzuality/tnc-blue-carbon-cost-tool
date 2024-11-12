"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboardIcon,
  ClipboardEditIcon,
  ClipboardListIcon,
  ServerCogIcon,
  UserIcon,
  FileQuestionIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

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
    },
    {
      title: "Admin",
      url: "/admin",
      icon: ServerCogIcon,
      match: (pathname: string) => pathname.startsWith("/admin"),
    },
  ],
  footer: [
    {
      title: "Methodology",
      url: "/methodology",
      icon: FileQuestionIcon,
      match: (pathname: string) => pathname === "/methodology",
    },
    {
      title: "Profile",
      url: "/profile",
      icon: UserIcon,
      match: (pathname: string) => pathname === "/profile",
    },
  ],
};

export default function MainNav() {
  const { open } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="py-6">
      <SidebarHeader>
        <span>{open ? "Blue Carbon Cost Tool" : "BCCT"}</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.main.map((item) => {
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
          {navItems.footer.map((item) => {
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
      </SidebarFooter>
    </Sidebar>
  );
}
