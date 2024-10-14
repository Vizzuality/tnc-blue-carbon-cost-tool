import { expect, Page, test } from "@playwright/test";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";
import { User } from "@shared/entities/users/user.entity";
import { TOKEN_TYPE_ENUM } from "@shared/schemas/auth/token-type.schema";

let testManager: E2eTestManager;
let page: Page;

test.describe.configure({ mode: "serial" });

test.describe("Auth - Sign Up", () => {
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

  test("an user signs up successfully", async ({ page }) => {
    const user: Pick<User, "email" | "password" | "isActive"> = {
      email: "johndoe@test.com",
      password: "passwordpassword",
      isActive: false,
    };

    const newPassword = "987654321987654321";

    const userCreated = await testManager.mocks().createUser(user);
    const userToken = await testManager.generateTokenByType(
      userCreated,
      TOKEN_TYPE_ENUM.SIGN_UP,
    );

    await page.goto(`/auth/signup/${userToken}`);

    await page
      .getByPlaceholder("Enter the One-Time Password received in your mail")
      .click();
    await page
      .getByPlaceholder("Enter the One-Time Password received in your mail")
      .fill(user.password);
    await page.getByPlaceholder("Create a password").click();
    await page.getByPlaceholder("Create a password").fill(newPassword);
    await page.getByPlaceholder("Repeat the password").click();
    await page.getByPlaceholder("Repeat the password").fill(newPassword);

    await page.getByRole("button", { name: /sign up/i }).click();

    await page.waitForURL("/auth/signin");
    await expect(
      page.getByRole("heading", { name: "Welcome to Blue Carbon Cost" }),
    ).toBeVisible();
  });

  test("an user signs up with an invalid token", async ({ page }) => {
    await page.goto("/auth/signup/12345678");

    await expect(
      page.getByText("The token is invalid or has expired."),
    ).toBeVisible();
    await expect(
      page.getByPlaceholder(
        "Enter the One-Time Password received in your mail",
      ),
    ).toBeDisabled();
    await expect(page.getByPlaceholder("Create a password")).toBeDisabled();
    await expect(page.getByPlaceholder("Repeat the password")).toBeDisabled();
    await expect(page.getByRole("button", { name: /sign up/i })).toBeDisabled();
  });
});
