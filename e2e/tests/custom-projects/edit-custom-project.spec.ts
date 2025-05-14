import { expect, Page, test } from "@playwright/test";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";
import { EXTENDED_TIMEOUT, PROJECT_NAME, ROUTES } from "e2e/lib/constants";
import {
  createAndSaveCustomProject,
  createAndSaveRestorationCustomProject,
  createAndSignInUser,
  expectEditProjectHeadingVisible,
  getDataFromNetworkRequest,
  navigateToEditCustomProject,
} from "e2e/lib/utils";
import { getCapexCostInputsKeys, getOpexCostInputsKeys } from "@shared/lib/utils";
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

  test("User can navigate to the edit project page from the summary panel", async () => {
    await createAndSaveCustomProject(page);
    await page.waitForLoadState("networkidle");
    const btn = page.getByTestId("project-summary-button");
    await btn.click();
    await expect(
      page.getByText("Summary", { exact: true }),
    ).toBeVisible();
    const summarySidebar = page.getByLabel("Summary");
    const editProjectLink = summarySidebar
      .locator("a")
      .filter({ hasText: "Edit project" });
    await expect(editProjectLink).toBeVisible();
    await editProjectLink.click();
    await expect(
      page.getByRole("heading", { name: `Edit ${PROJECT_NAME}` }),
    ).toBeVisible();
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

    await expectEditProjectHeadingVisible(page);

    await expect(
      page.locator("input[name='costInputs.implementationLabor']"),
    ).not.toBeVisible();

    for (const [k, v] of Object.entries<number>(input.assumptions)) {
      const row = page.locator(
        `#assumptions-table tbody tr:has(input[name="assumptions.${k}"])`,
      );

      const unit = await row.locator("td").nth(2).textContent();
      const value = unit?.includes("%") ? v * 100 : v;
      await expect(row.locator("input")).toHaveValue(value.toString());
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
      await expect(row.locator("input")).toHaveValue(value.toString());
    }

    const opexCostInputsKeys = getOpexCostInputsKeys(input.costInputs);

    for (const key of opexCostInputsKeys) {
      const row = page.locator(
        `#cost-inputs-opex-table tbody tr:has(input[name="costInputs.${key}"])`,
      );

      const v = input.costInputs[key];
      const unit = await row.locator("td").nth(2).textContent();
      const value = unit?.includes("%") ? v * 100 : v;
      await expect(row.locator("input")).toHaveValue(value.toString());
    }
  });

  test("User sees default values pre-filled when switching to restoration project", async () => {
    await page.goto(ROUTES.projects.new);
    const data = await getDataFromNetworkRequest(
      page,
      "**/custom-projects/activity-types-defaults?**",
    );
    const plantingSuccessRate = data.Restoration.plantingSuccessRate;

    await createAndSaveCustomProject(page);
    await navigateToEditCustomProject(page);

    await page.locator(`#${ACTIVITY.RESTORATION}`).click();

    await expect(
      page.locator("input[name='costInputs.implementationLabor']"),
    ).toHaveValue("0");
    await expect(
      page.locator("input[name='parameters.plantingSuccessRate']"),
    ).toHaveValue((plantingSuccessRate * 100).toString());
  });


  test("After creating a Restoration project and switching to Conservation, project-specific loss rate used is checked by default", async () => {
    await createAndSaveRestorationCustomProject(page);
    await navigateToEditCustomProject(page);

    await page.locator("label").filter({ hasText: /^Conservation$/ }).click();
    await expect(page.getByText("Project specific", { exact: true })).toBeChecked();
  });
});
