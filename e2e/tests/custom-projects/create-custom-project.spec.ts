import { expect, Locator, Page, test } from "@playwright/test";
import { ACTIVITY } from "@shared/entities/activity.enum";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";
import { EXTENDED_TIMEOUT, ROUTES } from "e2e/lib/constants";
import { insertProjectName, insertProjectSpecificLossRate, submitCustomProject } from "e2e/lib/utils";

let testManager: E2eTestManager;
let page: Page;

test.describe.configure({ mode: "serial" });

test.describe("Custom Projects - Create", () => {
  test.beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + EXTENDED_TIMEOUT);
    page = await browser.newPage();
    testManager = await E2eTestManager.load(page);
    await testManager.ingestBaseData();
  });

  test.afterEach(async () => {
    await page.goto(ROUTES.projects.new);
  });

  test.afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  test.describe("Form validation", () => {
    test.beforeAll(async () => {
      await page.goto(ROUTES.projects.new);
    });

    test("I can create a custom project with default values", async () => {
      const projectName = "test project";
      await insertProjectName(page, projectName);
      await insertProjectSpecificLossRate(page);
      await submitCustomProject(page);
      await expect(
        page.getByRole("heading", { name: projectName }),
      ).toBeVisible();
    });

    test("The correct errors are displayed upon invalid form submission", async () => {
      const defaultErrorMessages = [
        "Name must contain at least 3 characters.",
        "Project Specific Loss Rate must be between -100% and 0%",
      ];
      const errorMessages = ["Name must contain at least 3 characters."];

      for (const errorMessage of [...defaultErrorMessages, ...errorMessages]) {
        await expect(page.getByText(errorMessage)).not.toBeVisible();
      }

      await page.getByRole("button", { name: "Continue" }).click();

      for (const errorMessage of defaultErrorMessages) {
        await expect(page.getByText(errorMessage)).toBeVisible();
      }

      await page
        .getByRole("textbox", { name: "Insert project name" })
        .fill("a");
      await expect(page.getByText(errorMessages[0])).toBeVisible();

      const projectSizeHaFormField = page.getByTestId("projectSizeHa");
      await projectSizeHaFormField.locator("input").fill("");
      await expect(projectSizeHaFormField.getByText("required")).toBeVisible();
      await projectSizeHaFormField.locator("input").fill("-1");
      await expect(
        projectSizeHaFormField.getByText(
          "Number must be greater than or equal to 0",
        ),
      ).toBeVisible();

      const initialCarbonPriceAssumptionFormField = page.getByTestId(
        "initialCarbonPriceAssumption",
      );
      await initialCarbonPriceAssumptionFormField.locator("input").fill("");
      await expect(
        initialCarbonPriceAssumptionFormField.getByText("required"),
      ).toBeVisible();
      await initialCarbonPriceAssumptionFormField.locator("input").fill("-1");
      await expect(
        initialCarbonPriceAssumptionFormField.getByText(
          "Number must be greater than or equal to 0",
        ),
      ).toBeVisible();
    });
  });

  test.describe("Form fields", () => {
    const getAssertion = (shouldBeVisible: boolean) =>
      shouldBeVisible
        ? async (locator: Locator) => await expect(locator).toBeVisible()
        : async (locator: Locator) => await expect(locator).not.toBeVisible();
    const checkConservationFormFields = async (shouldBeVisible: boolean) => {
      const assertion = getAssertion(shouldBeVisible);

      await assertion(
        page.getByRole("heading", {
          name: "Conservation project details",
          level: 2,
        }),
      );
      await assertion(page.locator("label", { hasText: "Loss rate used" }));
      await assertion(
        page.locator("label", { hasText: "Project Specific Loss Rate" }),
      );
      await assertion(
        page.locator("label", {
          hasText: "Emission factor used (as committed emissions)",
        }),
      );
      await assertion(
        page.locator("label", { hasText: "T1 Global Emission Factor" }),
      );
    };

    const checkRestorationFormFields = async (shouldBeVisible: boolean) => {
      const assertion = getAssertion(shouldBeVisible);

      await assertion(
        page.locator("label", { hasText: "Restoration Activity type" }),
      );
      await assertion(
        page.locator("label", { hasText: "Sequestration Factor Used" }),
      );
      await assertion(
        page.locator("label", { hasText: "Planting Success Rate" }),
      );
      await assertion(
        page.locator("label", { hasText: "Tier 1 - IPCC default value" }),
      );
      await assertion(
        page.getByRole("heading", { name: "Restoration Plan", level: 2 }),
      );
    };

    test.beforeAll(async () => {
      await page.goto(ROUTES.projects.new);
    });

    test("The correct form fields are displayed when the conservation activity is selected", async () => {
      await page.locator(`#${ACTIVITY.CONSERVATION}`).click();
      await checkConservationFormFields(true);
      await checkRestorationFormFields(false);
    });

    test("The correct form fields are displayed when the restoration activity is selected", async () => {
      await page.locator(`#${ACTIVITY.RESTORATION}`).click();
      await checkConservationFormFields(false);
      await checkRestorationFormFields(true);
    });

    test("The correct form fields are displayed for each selected Emission factor used", async () => {
      // check that tier 2 is disabled for Seagrass
      await expect(page.locator("#Seagrass")).toHaveAttribute(
        "aria-checked",
        "true",
      );
      await page.getByTestId("parameters.emissionFactorUsed").click();
      await expect(
        page.getByRole("option", {
          name: "Tier 2 - Country-specific emission factor",
        }),
      ).toBeDisabled();

      // Click to close dropdown
      await page
        .getByRole("option", {
          name: "Tier 1 - Global emission factor",
        })
        .click();

      await page.locator("#Mangrove").click();
      // Tier 1 - Global emission factor (default)
      await expect(page.getByText("T1 Global Emission Factor")).toBeVisible();

      // Tier 2 - Country-specific emission factor
      await page.getByTestId("parameters.emissionFactorUsed").click();
      await page
        .getByRole("option", {
          name: "Tier 2 - Country-specific emission factor",
        })
        .click();
      await expect(
        page.locator("label", { hasText: "National AGB Emission Factor" }),
      ).toBeVisible();
      await expect(
        page.locator("label", { hasText: "National SOC Emission Factor" }),
      ).toBeVisible();

      // // Tier 3 - Project-specific emission factor
      await page.getByTestId("parameters.emissionFactorUsed").click();
      await page
        .getByRole("option", {
          name: "Tier 3 - Project specific emission factor",
        })
        .click();
      await expect(
        page.locator("label", { hasText: "Project-specific emissions type" }),
      ).toBeVisible();

      await page.getByTestId("parameters.projectSpecificEmission").click();
      await page
        .getByRole("option", {
          name: "Two emission factors",
        })
        .click();
      await expect(
        page.locator("label", { hasText: "AGB Emission Factor" }),
      ).toBeVisible();
      await expect(
        page.locator("label", { hasText: "SOC Emission Factor" }),
      ).toBeVisible();
    });

    test("The correct form fields are displayed for each selected sequestration factor used", async () => {
      await page.locator(`#${ACTIVITY.RESTORATION}`).click();
      await expect(
        page.locator("label", { hasText: "Tier 1 - IPCC default value" }),
      ).toBeVisible();

      await page.getByTestId("parameters.tierSelector").click();
      await page
        .getByRole("option", {
          name: "Tier 2 - Country-specific rate",
        })
        .click();
      await expect(
        page.locator("label", { hasText: "Country-specific rate" }),
      ).toBeVisible();

      await page.getByTestId("parameters.tierSelector").click();
      await page
        .getByRole("option", {
          name: "Tier 3 - Project-specific rate",
        })
        .click();
      await expect(
        page.locator("label", {
          hasText: "Project-specific sequestration rate",
        }),
      ).toBeVisible();
    });

    test("The correct form fields are displayed for the assumptions section", async () => {
      const responsePromise = page.waitForResponse(
        "**/custom-projects/assumptions**",
      );
      // This click action will trigger the API call on the client to get the assumptions
      await page.locator(`#${ACTIVITY.RESTORATION}`).click();
      const response = await responsePromise;
      const { data } = await response.json();

      await expect(
        page.locator("#assumptions-table").locator("tbody"),
      ).toBeVisible();

      if (data.length === 0) {
        await expect(page.locator("#assumptions-table tbody td")).toHaveText(
          "No results.",
        );
      } else {
        const assumptions = data.filter(
          (obj: { name: string }) => obj.name !== "Carbon price",
        );

        for (const assumption of assumptions) {
          const row = page.locator("#assumptions-table tbody tr", {
            has: page.locator("td", { hasText: assumption.name }),
          });
          const { name, unit } = assumption;
          const value = unit.includes("%")
            ? assumption.value * 100
            : assumption.value;

          await expect(row).toBeVisible();
          await expect(row.locator("td").nth(0)).toHaveText(name);
          await expect(row.locator("td").nth(1)).toHaveText(value.toString());
          await expect(row.locator("td").nth(2)).toHaveText(unit);
        }
      }
    });
  });
});
