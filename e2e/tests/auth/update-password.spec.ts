import { expect, Page, test } from "@playwright/test";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";
import { User } from "@shared/entities/users/user.entity";
import { ROLES } from "@shared/entities/users/roles.enum";

let testManager: E2eTestManager;
let page: Page;

test.describe.configure({ mode: "serial" });

test.describe("Auth - Update Password", () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    testManager = await E2eTestManager.load(page);
  });

  test.beforeEach(async () => {
    await testManager.clearDatabase();
  });

  test.afterEach(async () => {
    // await testManager.clearDatabase();
  });

  test.afterAll(async () => {
    await testManager.close();
  });

  test("an user changes their password successfully", async () => {
    const user: Pick<User, "email" | "password" | "partnerName" | "role"> = {
      email: "jhondoe@test.com",
      password: "12345678",
      partnerName: "partner-test",
      role: ROLES.ADMIN,
    };
    const newPassword = "987654321987654321";

    await testManager.mocks().createUser(user);
    await testManager.login(user as User);

    await page.waitForURL('/profile');

    await page.getByPlaceholder('Type your current password').fill(user.password);
    await page.getByPlaceholder('Create new password').fill(newPassword);
    await page.getByPlaceholder('Repeat new password').fill(newPassword);

    await page.getByRole("button", { name: /update password/i }).click();

    await page.getByRole("button", { name: /sign out/i }).click();

    await expect(page).toHaveURL(/auth\/signin/);

    await testManager.login({ email: user.email, password: newPassword } as User);

    await expect(page).toHaveURL("/profile");
  });
});
