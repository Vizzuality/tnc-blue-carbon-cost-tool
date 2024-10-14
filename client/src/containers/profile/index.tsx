"use client";

import { signOut } from "next-auth/react";

import AccountDetails from "@/containers/profile/account-details";
import EditPassword from "@/containers/profile/edit-password";
import UpdateEmail from "@/containers/profile/update-email";

import { Button } from "@/components/ui/button";
import DeleteAccount from "src/containers/profile/delete-account";

export default function Profile() {
  return (
    <div className="container my-10">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex h-full flex-col justify-between">
          <AccountDetails />
          <UpdateEmail />
        </div>
        <div className="space-y-10">
          <EditPassword />
          <DeleteAccount />
        </div>
      </div>

      <Button
        variant="link"
        onClick={async () => {
          await signOut();
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
