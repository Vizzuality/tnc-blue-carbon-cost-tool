import { expect, Page, test } from "@playwright/test";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";
import { User } from "@shared/entities/users/user.entity";
import { TOKEN_TYPE_ENUM } from "@shared/schemas/auth/token-type.schema";

let testManager: E2eTestManager;
let page: Page;

test.describe.configure({ mode: "serial" });

test.describe("Auth - Sign In", () => {
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

  test("Auth -  Update user email", async ({ page }) => {
    const user: Pick<User, "email" | "password" | "partnerName"> = {
      email: "jhondoe@test.com",
      password: "12345678",
      partnerName: "admin",
    };
    const userCreated = await testManager.mocks().createUser(user);

    const token = await testManager.generateTokenByType(
      userCreated,
      TOKEN_TYPE_ENUM.EMAIL_CONFIRMATION,
    );

    const newEmail = 'newmail@mail.com';

    await page.goto(`/auth/confirm-email/${token}?newEmail=${newEmail}`);

    await page.getByRole("button", { name: /confirm email/i }).click();

    await expect(page).toHaveURL("/auth/signin");

    await testManager.login({
      ...user,
      email: newEmail,
    } as User);

    await expect(testManager.getPage()).toHaveURL("/profile");
  });
});
