import { expect, Page, test } from "@playwright/test";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";

let testManager: E2eTestManager;
let page: Page;

test.describe.configure({ mode: "serial" });

test.describe("Projects - Create Custom Project", () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    testManager = await E2eTestManager.load(page);
    const { jwtToken } = await testManager.setUpTestUser();

    if (!jwtToken) {
      throw new Error("Failed to set up test user");
    }

    await testManager.ingestCountries();
    await testManager.ingestProjectScoreCards(jwtToken);
    await testManager.ingestExcel(jwtToken);
  });

  test.afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  test("I can create a custom project with default values", async () => {
    await page.goto("http://localhost:3000/projects/new");

    await page.locator('input[name="projectName"]').fill("Test Project");
    await page.getByText("Continue").click();
  });
});
