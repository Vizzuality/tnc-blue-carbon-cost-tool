import { expect, Page, test } from "@playwright/test";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";
import { User } from "@shared/entities/users/user.entity";

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

  test("an user signs in successfully", async ({ page }) => {
    const user: Pick<User, "email" | "password" | "partnerName"> = {
      email: "jhondoe@test.com",
      password: "12345678",
      partnerName: "admin",
    };
    await testManager.mocks().createUser(user);
    await testManager.login(user as User);
    await expect(testManager.getPage()).toHaveURL("/profile");
  });
});
