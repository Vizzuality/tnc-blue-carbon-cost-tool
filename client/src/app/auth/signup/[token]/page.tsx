import SetPassword from "@/containers/auth/set-password";
import AuthLayout from "@/containers/auth-layout";

export default async function SetPasswordPage() {
  return (
    <AuthLayout>
      <SetPassword />
    </AuthLayout>
  );
}
