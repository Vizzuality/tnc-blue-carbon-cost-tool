import { test, expect, Page } from "@playwright/test";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";
import { User } from "@shared/entities/users/user.entity";

let testManager: E2eTestManager;
let page: Page;

test.describe.configure({ mode: "serial" });

test.describe("Auth", () => {
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
    //await testManager.logout();
    await testManager.close();
  });

  test("an user signs in successfully", async () => {
    const user: Pick<User, "email" | "password" | "partnerName"> = {
      email: "jhondoe@test.com",
      password: "12345678",
      partnerName: "admin",
    };
    await testManager.mocks().createUser(user);
    await testManager.login(user as User);
    await expect(page.getByText(`Email: ${user.email}`)).toBeVisible();
  });
});

// test("an user signs up successfully", async ({ page }) => {
//   const user: Pick<User, "email" | "password"> = {
//     email: "johndoe@test.com",
//     password: "password",
//   };
//
//   await page.goto("/auth/signup");
//
//   await page.getByLabel("Email").fill(user.email);
//   await page.locator('input[type="password"]').fill(user.password);
//   await page.getByRole("checkbox").check();
//
//   await page.getByRole("button", { name: /sign up/i }).click();
//
//   await page.waitForURL("/auth/signin");
//
//   await page.getByLabel("Email").fill(user.email);
//   await page.locator('input[type="password"]').fill(user.password);
//
//   await page.getByRole("button", { name: /log in/i }).click();
//
//   await page.waitForURL("/profile");
//   await expect(await page.locator('input[type="email"]')).toHaveValue(
//     user.email,
//   );
// });
