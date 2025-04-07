import { Page, test, expect } from "@playwright/test";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";
import { EDIT_PROJECT_LINK_REGEX, EXTENDED_TIMEOUT } from "e2e/lib/constants";
import {
  createAndSaveCustomProject,
  createAndSignInUser,
  expectEditProjectHeadingVisible,
} from "e2e/lib/utils";

let testManager: E2eTestManager;
let page: Page;

test.describe.configure({ mode: "serial" });

test.describe("Custom Projects - My Custom Projects", () => {
  test.beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + EXTENDED_TIMEOUT);
    page = await browser.newPage();
    testManager = await E2eTestManager.load(page);
    await testManager.ingestBaseData();
    await createAndSignInUser(testManager);
  });

  test.afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  test("A user can navigate to the edit project page", async () => {
    await createAndSaveCustomProject(page);
    await page.waitForLoadState("networkidle");
    await page.goto("/my-projects");

    const tableRow = page.locator("table tbody tr");
    const actionsDropdownButton = tableRow.getByTestId(
      "actions-dropdown-button",
    );
    await actionsDropdownButton.click();

    const link = page.locator("a", { hasText: "Edit project" });
    expect(link).toHaveAttribute("href", EDIT_PROJECT_LINK_REGEX);
    await link.click();

    await expectEditProjectHeadingVisible(page);
  });
});
