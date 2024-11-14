"use client";

import { useEffect, useRef } from "react";

import Link from "next/link";

import { useSetAtom } from "jotai";

import CustomProjects from "@/containers/profile/custom-projects";
import ProfileSection from "@/containers/profile/profile-section";
import ProfileSidebar from "@/containers/profile/profile-sidebar";
import { intersectingAtom } from "@/containers/profile/store";
import UserDetails from "@/containers/profile/user-details";

import { SidebarTrigger } from "@/components/ui/sidebar";
import DeleteAccount from "src/containers/profile/delete-account";

const sections = [
  {
    id: "my-details",
    title: "My details",
    description: "This personal information is only visible to you.",
    Component: UserDetails,
  },
  {
    id: "my-custom-projects",
    title: "My custom projects",
    description: (
      <>
        You can see more detail and modify your custom projects in{" "}
        <Link href="/projects/custom" className="text-primary hover:underline">
          My Custom Projects
        </Link>{" "}
        page.
      </>
    ),
    Component: CustomProjects,
  },
  {
    id: "delete-account",
    title: "Delete account",
    description:
      "This action will permanently delete your account. By doing this you will loose access to all your custom scenarios.",
    Component: DeleteAccount,
  },
];

export default function Profile() {
  const ref = useRef<HTMLDivElement>(null);
  const setIntersecting = useSetAtom(intersectingAtom);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionSlug = entry.target.id;

            setIntersecting(sectionSlug);
          }
        });
      },
      {
        root: ref.current,
        threshold: 0,
        /**
         * This rootMargin creates a horizontal line vertically centered
         * that will help trigger an intersection at that the very point.
         */
        rootMargin: "-50% 0% -50% 0%",
      },
    );

    const sections = Array.from(ref.current.children);
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [setIntersecting]);

  return (
    <div className="flex h-lvh w-full flex-col">
      <div className="flex items-center space-x-2 p-4">
        <SidebarTrigger />
        <h2 className="text-2xl font-medium">User area</h2>
      </div>

      <div className="grid h-full grid-cols-[317px_1fr] gap-6 overflow-hidden pl-4">
        <div className="h-full">
          <ProfileSidebar
            navItems={sections.map((s) => ({ id: s.id, name: s.title }))}
          />
        </div>
        <div
          ref={ref}
          className="w-full space-y-2 overflow-y-auto scroll-smooth pb-20 pl-16 pr-20"
        >
          {sections.map(({ Component, ...rest }) => (
            <ProfileSection key={rest.id} {...rest}>
              <Component />
            </ProfileSection>
          ))}
        </div>
      </div>
    </div>
  );
}
