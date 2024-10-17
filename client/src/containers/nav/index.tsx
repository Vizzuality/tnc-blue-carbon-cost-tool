"use client";

import Link from "next/link";

import { ActivityIcon, HelpCircleIcon, UserCircle } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = {
  overview: [
    {
      title: "Overview",
      url: "/",
      icon: ActivityIcon,
    },
  ],
  projects: {
    label: "Custom projects",
    items: [
      {
        title: "New custom project",
        url: "/projects/new",
        icon: ActivityIcon,
      },
      {
        title: "Custom projects",
        url: "/projects/custom",
        icon: ActivityIcon,
      },
    ],
  },
  footer: [
    {
      title: "Profile",
      url: "/profile",
      icon: UserCircle,
    },
    {
      title: "Methodology",
      url: "/methodology",
      icon: HelpCircleIcon,
    },
  ],
};

export default function MainNav() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <span>{open ? "Blue Carbon Cost" : "BCC"}</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.overview.map((item) => (
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
        <SidebarGroup>
          <SidebarGroupLabel>{navItems.projects.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.projects.items.map((item) => (
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
