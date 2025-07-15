import { expect, Page, test } from "@playwright/test";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";
import { User } from "@shared/entities/users/user.entity";
import { TOKEN_TYPE_ENUM } from "@shared/schemas/auth/token-type.schema";
import { ROUTES, TEST_USER } from "e2e/lib/constants";

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
    const user = TEST_USER;

    await page.goto(ROUTES.auth.signup);

    await page.getByPlaceholder("Enter your name").fill(user.name);
    await page
      .getByPlaceholder("Enter organization name")
      .fill(user.partnerName);
    await page.getByLabel("Email").fill(user.email);
    await page.getByRole("checkbox").check();

    await page.getByRole("button", { name: /Create account/i }).click();

    await expect(
      // Has to be a more specific selector targeting the notification list item
      page.getByRole("list").getByRole("status").filter({
        hasText:
          "Sign up successful! Please check your email to verify your account.",
      }),
    ).toBeVisible();

    await page.waitForURL(ROUTES.auth.signin);
    await expect(
      page.getByText("Welcome to Blue Carbon Cost", { exact: true }),
    ).toBeVisible();

    const registeredUser = await testManager
      .getDataSource()
      .getRepository(User)
      .findOne({ where: { email: user.email } });

    expect(registeredUser?.isActive).toBe(false);
  });

  test("an user successfully finish signup process with OTP", async ({
    page,
  }) => {
    const user = {
      ...TEST_USER,
      isActive: false,
    };

    const newPassword = "987654321987654321";

    const userCreated = await testManager.mocks().createUser(user);
    const userToken = await testManager.generateTokenByType(
      userCreated,
      TOKEN_TYPE_ENUM.ACCOUNT_CONFIRMATION,
    );

    await page.goto(ROUTES.auth.signup + `/${userToken}`);

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

    await page.getByRole("button", { name: /save/i }).click();

    await page.waitForURL(ROUTES.auth.signin);
    await expect(page.getByText("Welcome to Blue Carbon Cost")).toBeVisible();
  });

  test("an user signs up with an invalid token", async ({ page }) => {
    await page.goto(ROUTES.auth.signup + "/12345678");

    await expect(
      page.getByText('The token is invalid or has expired.', { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByPlaceholder(
        "Enter the One-Time Password received in your mail",
      ),
    ).toBeDisabled();
    await expect(page.getByPlaceholder("Create a password")).toBeDisabled();
    await expect(page.getByPlaceholder("Repeat the password")).toBeDisabled();
    await expect(page.getByRole("button", { name: /save/i })).toBeDisabled();
  });
});
