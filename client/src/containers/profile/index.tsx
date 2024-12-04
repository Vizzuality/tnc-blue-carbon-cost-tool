"use client";

import { useEffect, useRef } from "react";

import Link from "next/link";

import { useSetAtom } from "jotai";

import CustomProjects from "@/containers/profile/custom-projects";
import DeleteAccount from "@/containers/profile/delete-account";
import FileUpload, { TEMPLATE_FILES } from "@/containers/profile/file-upload";
import FileUploadDescription from "@/containers/profile/file-upload/description";
import ProfileSection from "@/containers/profile/profile-section";
import ProfileSidebar from "@/containers/profile/profile-sidebar";
import { intersectingAtom } from "@/containers/profile/store";
import UserDetails from "@/containers/profile/user-details";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
    id: "share-information",
    title: "Share information",
    description: <FileUploadDescription files={TEMPLATE_FILES} />,
    Component: FileUpload,
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
        threshold: 0.1,
        /**
         * This rootMargin creates a horizontal line vertically centered
         * that will help trigger an intersection at that the very point.
         */
        rootMargin: "-20% 0% -60% 0%",
      },
    );

    const sections = Array.from(
      ref.current.querySelector("#profile-sections-container")?.children || [],
    );
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [setIntersecting]);

  return (
    <div className="flex h-lvh w-full flex-col">
      <div className="flex items-center space-x-2 p-4">
        <SidebarTrigger />
        <h2 className="text-2xl font-medium">User area</h2>
      </div>

      <div className="relative grid h-full grid-cols-[317px_1fr] gap-6 overflow-hidden pl-4">
        <ProfileSidebar
          navItems={sections.map((s) => ({ id: s.id, name: s.title }))}
        />
        <ScrollArea ref={ref} className="pr-6">
          <div id="profile-sections-container" className="space-y-2 pb-80">
            {sections.map(({ Component, ...rest }) => (
              <ProfileSection key={rest.id} {...rest}>
                <Component />
              </ProfileSection>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
