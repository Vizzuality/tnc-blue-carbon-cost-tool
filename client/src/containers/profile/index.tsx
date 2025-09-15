"use client";

import { useMemo, useRef } from "react";

import dynamic from "next/dynamic";
import Link from "next/link";

import { useSetAtom } from "jotai";

import { FEATURE_FLAGS } from "@/lib/feature-flags";

import { useScrollSpy } from "@/hooks/use-scroll-spy";

import CustomProjects from "@/containers/profile/custom-projects";
import DeleteAccount from "@/containers/profile/delete-account";
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
    id: "share-data",
    title: "Share data",
    description: <FileUploadDescription />,
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
  const currentSections = useMemo(() => {
    return PROFILE_SECTIONS.filter((section) => {
      const featureFlagExists = section.id in FEATURE_FLAGS;
      const isFeatureEnabled =
        featureFlagExists &&
        FEATURE_FLAGS[section.id as keyof typeof FEATURE_FLAGS];

      return !featureFlagExists || isFeatureEnabled;
    });
  }, []);
  useScrollSpy({
    id: "profile-sections-container",
    containerRef: ref,
    setCurrentStep: setProfileStep,
    options: {
      threshold: 0.1,
    },
  });

  return (
    <div className="ml-4 flex h-lvh w-full flex-col">
      <div className="flex h-16 items-center space-x-2 p-4 pl-0">
        <SidebarTrigger />
        <h2 className="text-2xl font-medium">User area</h2>
      </div>

      <div className="relative grid h-full grid-cols-[317px_1fr] gap-6 overflow-hidden">
        <ProfileSidebar
          navItems={currentSections.map((s) => ({
            id: s.id,
            label: s.title,
            href: `#${s.id}`,
          }))}
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
