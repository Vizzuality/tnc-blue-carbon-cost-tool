import { expect, Page, test } from "@playwright/test";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";
import { User } from "@shared/entities/users/user.entity";
import { ROLES } from "@shared/entities/users/roles.enum";

let testManager: E2eTestManager;
let page: Page;

test.describe.configure({ mode: "serial" });

test.describe("Auth - Delete Account", () => {
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

  test("an user deletes their account successfully", async () => {
    const user: Pick<User, "email" | "password" | "partnerName" | "role"> = {
      email: "jhondoe@test.com",
      password: "12345678",
      partnerName: "partner-test",
      role: ROLES.ADMIN,
    };

    await testManager.mocks().createUser(user);
    await testManager.login(user as User);

    await page.waitForURL("/");

    await page.getByRole("button", { name: "Delete account" }).click();
    await page.getByRole("button", { name: "Delete account" }).click();

    await page.waitForURL("/auth/signin");

    await page.getByPlaceholder("Enter your email address").fill(user.email);
    await page.locator('input[type="password"]').fill(user.password);
    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });
});
