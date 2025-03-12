import { Page, test, expect } from "@playwright/test";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";

let testManager: E2eTestManager;
let page: Page;

test.describe.configure({ mode: "serial" });

test.describe("Custom Projects", () => {
  const projectName = "test project";
  const insertProjectName = async () => {
    await page.getByRole("textbox", { name: "Insert project name" }).click();
    await page
      .getByRole("textbox", { name: "Insert project name" })
      .fill(projectName);
  };
  const submitCustomProjectAndCheckPreview = async () => {
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForURL("/projects/preview");
    await expect(
      page.getByRole("heading", { name: projectName }),
    ).toBeVisible();
  };

  test.beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + 60_000);
    page = await browser.newPage();
    testManager = await E2eTestManager.load(page);
    await testManager.ingestBaseData();
  });

  test.afterEach(async () => {
    await page.goto("/projects/new");
  });

  test.afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  test.describe("Create Custom Projects", () => {
    test.beforeAll(async () => {
      await page.goto("/projects/new");
    });

    test("I can create a custom project with default values", async () => {
      await insertProjectName();
      await submitCustomProjectAndCheckPreview();
    });
  });
});
