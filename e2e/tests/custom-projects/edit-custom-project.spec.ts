import { DEFAULT_RESTORATION_FORM_VALUES } from "@shared/schemas/custom-projects/custom-project-form.constants";
import { Page, test, expect } from "@playwright/test";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";
import { EXTENDED_TIMEOUT, PROJECT_NAME } from "e2e/lib/constants";
import {
  createAndSaveCustomProject,
  createAndSignInUser,
  navigateToEditCustomProject,
} from "e2e/lib/utils";
import {
  getCapexCostInputsKeys,
  getOpexCostInputsKeys,
} from "@shared/lib/utils";
import { ACTIVITY } from "@shared/entities/activity.enum";
let testManager: E2eTestManager;
let page: Page;

test.describe.configure({ mode: "serial" });

test.describe("Custom Projects - Edit", () => {
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

  test("User can see two Edit project links with correct URL patterns after creating a custom project", async () => {
    await createAndSaveCustomProject(page);

    await page.waitForLoadState("networkidle");
    const editProjectLinks = page.getByRole("link", { name: "Edit project" });
    const linkCount = await editProjectLinks.count();
    expect(linkCount).toBe(2);

    for (let i = 0; i < linkCount; i++) {
      const link = editProjectLinks.nth(i);
      const href = await link.getAttribute("href");
      expect(href).toMatch(
        /\/projects\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/edit/,
      );
    }
  });

  test("User can see the edit project page with pre-filled data from the created custom project", async () => {
    const responsePromise = page.waitForResponse(`**/custom-projects`);
    await createAndSaveCustomProject(page);
    // check for post request to custom-projects
    const response = await responsePromise;
    const { data } = await response.json();

    if (!data) {
      throw new Error("No data found");
    }

    const input = data.input;

    await navigateToEditCustomProject(page);

    await expect(
      page.getByRole("heading", { name: `Edit ${PROJECT_NAME}` }),
    ).toBeVisible();

    for (const [k, v] of Object.entries<number>(input.assumptions)) {
      const row = page.locator(
        `#assumptions-table tbody tr:has(input[name="assumptions.${k}"])`,
      );

      const unit = await row.locator("td").nth(2).textContent();
      const value = unit?.includes("%") ? v * 100 : v;
      expect(row.locator("input")).toHaveValue(value.toString());
    }

    const capexCostInputsKeys = getCapexCostInputsKeys(input.costInputs);

    for (const key of capexCostInputsKeys) {
      // TODO: This should be removed after the implementationLabor is removed from the costInputs (for Conservation projects)
      if (key === "implementationLabor") continue;

      const row = page.locator(
        `#cost-inputs-capex-table tbody tr:has(input[name="costInputs.${key}"])`,
      );

      const v = input.costInputs[key];
      const unit = await row.locator("td").nth(2).textContent();
      const value = unit?.includes("%") ? v * 100 : v;
      expect(row.locator("input")).toHaveValue(value.toString());
    }

    const opexCostInputsKeys = getOpexCostInputsKeys(input.costInputs);

    for (const key of opexCostInputsKeys) {
      const row = page.locator(
        `#cost-inputs-opex-table tbody tr:has(input[name="costInputs.${key}"])`,
      );

      const v = input.costInputs[key];
      const unit = await row.locator("td").nth(2).textContent();
      const value = unit?.includes("%") ? v * 100 : v;
      expect(row.locator("input")).toHaveValue(value.toString());
    }
  });

  test("User sees default values pre-filled when switching to restoration project", async () => {
    await createAndSaveCustomProject(page);
    await navigateToEditCustomProject(page);

    await page.locator(`#${ACTIVITY.RESTORATION}`).click();

    expect(
      page.locator("input[name='parameters.plantingSuccessRate']"),
    ).toHaveValue(
      DEFAULT_RESTORATION_FORM_VALUES.parameters.plantingSuccessRate.toString(),
    );
  });
});
