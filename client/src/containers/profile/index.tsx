"use client";

import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";

export default function Profile() {
  const { data: session } = useSession();

  return (
    <div>
      <p>Welcome {session?.user?.name}</p>
      <p>Email: {session?.user?.email}</p>
      <p>role: {session?.user?.role}</p>

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
