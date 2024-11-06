"use client";

import Link from "next/link";

import {
  LayoutDashboardIcon,
  ClipboardEditIcon,
  ClipboardListIcon,
  ServerCogIcon,
  UserIcon,
  FileQuestionIcon,
} from "lucide-react";

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
    },
    {
      title: "Create custom project",
      url: "/projects/new",
      icon: ClipboardEditIcon,
    },
    {
      title: "My custom projects",
      url: "/projects/custom",
      icon: ClipboardListIcon,
    },
    {
      title: "Admin",
      url: "/admin",
      icon: ServerCogIcon,
    },
  ],
  footer: [
    {
      title: "Methodology",
      url: "/methodology",
      icon: FileQuestionIcon,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: UserIcon,
    },
  ],
};

export default function MainNav() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <span>{open ? "Blue Carbon Cost Tool" : "BCCT"}</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.main.map((item) => (
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {navItems.footer.map((item) => (
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
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
