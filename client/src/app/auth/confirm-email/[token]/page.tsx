import Link from "next/link";

import ConfirmEmailForm from "@/containers/auth/confirm-email/form";
import AuthLayout from "@/containers/auth-layout";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ConfirmEmailPage() {
  return (
    <AuthLayout>
      <ConfirmEmailForm />
      <Card variant="secondary" className="p-6">
        <p className="text-sm">
          <span className="pr-2 text-muted-foreground">
            Didn&apos;t receive your email?
          </span>
          <Button variant="link" className="p-0 text-primary" asChild>
            <Link href="/auth/signin">Resend email</Link>
          </Button>
        </p>
      </Card>
    </AuthLayout>
  );
}
