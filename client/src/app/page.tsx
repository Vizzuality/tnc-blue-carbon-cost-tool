import Link from "next/link";

import { auth } from "@/app/auth/api/[...nextauth]/config";

import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();

  return (
    <div className="container my-10 flex flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl">Welcome to Blue Carbon Cost</h1>

      <Button asChild variant="link">
        {session ? (
          <Link href="/profile">Visit your profile</Link>
        ) : (
          <Link href="/auth/signin">Sign in</Link>
        )}
      </Button>
    </div>
  );
}
