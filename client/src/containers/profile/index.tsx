"use client";

import { useEffect, useMemo, useRef } from "react";

import dynamic from "next/dynamic";
import Link from "next/link";

import { ExtractAtomValue, useSetAtom } from "jotai";

import { useFeatureFlags } from "@/hooks/use-feature-flags";

import CustomProjects from "@/containers/profile/custom-projects";
import DeleteAccount from "@/containers/profile/delete-account";
import { TEMPLATE_FILES } from "@/containers/profile/file-upload";
import ProfileSection from "@/containers/profile/profile-section";
import ProfileSidebar from "@/containers/profile/profile-sidebar";
import { profileStepAtom } from "@/containers/profile/store";
import UserDetails from "@/containers/profile/user-details";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger } from "@/components/ui/sidebar";

const FileUpload = dynamic(() => import("@/containers/profile/file-upload"));
const FileUploadDescription = dynamic(
  () => import("@/containers/profile/file-upload/description"),
);

export const PROFILE_SECTIONS = [
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
        <Link href="/my-projects" className="text-primary hover:underline">
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
] as const;

export default function Profile() {
  const ref = useRef<HTMLDivElement>(null);
  const setProfileStep = useSetAtom(profileStepAtom);
  const featureFlags = useFeatureFlags();
  const currentSections = useMemo(() => {
    return PROFILE_SECTIONS.filter((section) => {
      const featureFlagExists = section.id in featureFlags;
      const isFeatureEnabled =
        featureFlagExists &&
        featureFlags[section.id as keyof typeof featureFlags];

      return !featureFlagExists || isFeatureEnabled;
    });
  }, [featureFlags]);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionSlug = entry.target.id as ExtractAtomValue<
              typeof profileStepAtom
            >;

            setProfileStep(sectionSlug);
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

    const PROFILE_SECTIONS = Array.from(
      ref.current.querySelector("#profile-sections-container")?.children || [],
    );
    PROFILE_SECTIONS.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [setProfileStep]);

  return (
    <div className="ml-4 flex h-lvh w-full flex-col">
      <div className="flex h-16 items-center space-x-2 p-4 pl-0">
        <SidebarTrigger />
        <h2 className="text-2xl font-medium">User area</h2>
      </div>

      <div className="relative grid h-full grid-cols-[317px_1fr] gap-6 overflow-hidden">
        <ProfileSidebar
          navItems={currentSections.map((s) => ({ id: s.id, name: s.title }))}
        />
        <ScrollArea ref={ref} className="pr-6" showGradient>
          <div id="profile-sections-container" className="space-y-2 pb-80">
            {currentSections.map(({ Component, ...rest }) => (
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
