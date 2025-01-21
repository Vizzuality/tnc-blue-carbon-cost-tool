import { adminContract } from "@shared/contracts/admin.contract";
import { authContract } from "@shared/contracts/auth.contract";
import { User } from "@shared/entities/users/user.entity";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";

export type TestUser = { jwtToken: string; user: User };

export async function logUserIn(
  testManager: E2eTestManager,
  user: Partial<User>,
): Promise<TestUser> {
  console.log("logUserIn user", user);
  // currently returns 401 (but not with Postman), need to fix:
  const response = await testManager.api()(authContract.login.path, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      email: user.email,
      password: user.password,
    }),
  });

  console.log("response", response);

  return {
    jwtToken: response.body.accessToken,
    user: user as User,
  };
}
