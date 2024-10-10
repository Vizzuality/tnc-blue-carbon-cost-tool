import { test, expect, Page } from "@playwright/test";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";
import { User } from "@shared/entities/users/user.entity";

let testManager: E2eTestManager;
let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  testManager = await E2eTestManager.load(page);
});

test.beforeEach(async () => {
  await testManager.clearDatabase();
});

test.afterEach(async () => {
  //await testManager.clearDatabase();
});

test.afterAll(async () => {
  await testManager.logout();
  await testManager.close();
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

test("an user signs in successfully", async ({ page }) => {
  const user: Pick<User, "email" | "password" | "partnerName"> = {
    email: "jhondoe@test.com",
    password: "12345678",
    partnerName: "admin",
  };

  await testManager.mocks().createUser(user);
  await page.goto("/auth/signin");
  await page.getByLabel("Email").fill(user.email);
  await page.locator('input[type="password"]').fill(user.password);
  await page.getByRole("button", { name: /log in/i }).click();
});

test("test", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("link", { name: "Sign in" }).click();
  await page.getByPlaceholder("Enter your email").click();
  await page.getByPlaceholder("Enter your email").fill("jhondoe@test.com");
  await page.getByPlaceholder("*******").click();
  await page.getByPlaceholder("*******").fill("12345678");
  await page.getByRole("button", { name: "Log in" }).click();
});
// test("test", async ({ page }) => {
//   const user: Pick<User, "email" | "password" | "partnerName"> = {
//     email: "jhondoe@test.com",
//     password: "12345678",
//     partnerName: "admin",
//   };
//   await page.goto("http://localhost:3000/");
//   await page.getByRole("link", { name: "Sign in" }).click();
//   await page.getByPlaceholder("Enter your email").click();
//   await page.getByPlaceholder("Enter your email").fill(user.email);
//   await page.getByPlaceholder("*******").click();
//   await page.getByPlaceholder("*******").fill(user.password);
//   await page.getByRole("button", { name: "Log in" }).click();
//   await expect(page.getByText(`Email: ${user.email}`)).toBeVisible();
// });
