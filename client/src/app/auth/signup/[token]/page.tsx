import SetPassword from "@/containers/auth/set-password";
import AuthLayout from "@/containers/auth-layout";

export default async function SetPasswordPage() {
  return (
    <AuthLayout className="space-y-2 pt-20">
      <SetPassword />
    </AuthLayout>
  );
}
