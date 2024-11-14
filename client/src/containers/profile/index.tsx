"use client";

import AccountDetails from "@/containers/profile/account-details";

import DeleteAccount from "src/containers/profile/delete-account";
import ProfileSidebar from "@/containers/profile/profile-sidebar";
import CustomProjects from "@/containers/profile/custom-projects";

const sections = [
  { name: "My details", id: "my-details", Component: AccountDetails },
  {
    name: "My custom projects",
    id: "my-custom-projects",
    Component: CustomProjects,
  },
  { name: "Delete account", id: "delete-account", Component: DeleteAccount },
];

export default function Profile() {
  return (
    <div className="flex h-lvh flex-col">
      <div className="p-4">
        <h2 className="text-2xl font-medium">User area</h2>
      </div>

      <div className="grid grid-cols-[317px_1fr] gap-6 px-4">
        <div className="sticky top-0 h-[calc(100lvh-theme(spacing.16))]">
          <ProfileSidebar
            navItems={sections.map((s) => ({ id: s.id, name: s.name }))}
          />
        </div>
        <div className="overflow-hidden">
          <div className="overflow-y-auto scroll-smooth">
            <div className="container space-y-2 px-16">
              {sections.map(({ id, Component }) => (
                <Component key={id} id={id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
