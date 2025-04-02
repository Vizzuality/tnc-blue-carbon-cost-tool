import { expect, Page, test } from "@playwright/test";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";
import { ROUTES } from "e2e/lib/constants";
import { createAndSignInUser } from "e2e/lib/utils";

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

  test("an user signs in successfully", async () => {
    await createAndSignInUser(testManager);
    await expect(testManager.getPage()).toHaveURL(ROUTES.home);
  });
});
