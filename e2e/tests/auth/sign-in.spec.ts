import { expect, Page, test } from "@playwright/test";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";
import { User } from "@shared/entities/users/user.entity";
import { ROUTES, TEST_USER } from "e2e/constants";

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
    await testManager.mocks().createUser(TEST_USER);
    await testManager.login(TEST_USER as User);
    await expect(testManager.getPage()).toHaveURL(ROUTES.home);
  });
});
