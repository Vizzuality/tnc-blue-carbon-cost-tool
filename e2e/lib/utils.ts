import { expect, Page } from "@playwright/test";
import { User } from "@shared/entities/users/user.entity";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";
import { PROJECT_NAME, ROUTES, TEST_USER } from "e2e/lib/constants";

const createUser = async (testManager: E2eTestManager) => {
  await testManager.mocks().createUser(TEST_USER);
};

const signInUser = async (testManager: E2eTestManager) => {
  await testManager.login(TEST_USER as User);
};

const createAndSignInUser = async (testManager: E2eTestManager) => {
  await createUser(testManager);
  await signInUser(testManager);
};

const insertProjectName = async (page: Page, projectName = PROJECT_NAME) => {
  await page.getByRole("textbox", { name: "Insert project name" }).click();
  await page
    .getByRole("textbox", { name: "Insert project name" })
    .fill(projectName);
};

const insertProjectSpecificLossRate = async (page: Page) => {
  await page.locator("#parameters\\.projectSpecificLossRate").fill("-0.2");
};

const submitCustomProject = async (page: Page) => {
  await page.getByRole("button", { name: "Continue" }).click();
  await page.waitForURL(ROUTES.projects.preview);
};

const createAndSaveCustomProject = async (page: Page) => {
  await page.goto(ROUTES.projects.new);
  await insertProjectName(page);
  await insertProjectSpecificLossRate(page);
  await submitCustomProject(page);
  await page.getByRole("button", { name: "Save project" }).click();
};


const createAndSaveRestorationCustomProject = async (page: Page) => {
  await page.goto(ROUTES.projects.new);
  await insertProjectName(page);
  await page.getByLabel("Restoration").click();
  await submitCustomProject(page);
  await page.getByRole("button", { name: "Save project" }).click();
};

const navigateToEditCustomProject = async (page: Page) => {
  await page.getByTestId("edit-project-link").click();
};

const getDataFromNetworkRequest = async (page: Page, url: string) => {
  const responsePromise = page.waitForResponse(url);
  const response = await responsePromise;
  const { data } = await response.json();
  return data;
};

const expectEditProjectHeadingVisible = async (page: Page) => {
  await expect(
    page.getByRole("heading", { name: `Edit ${PROJECT_NAME}` }),
  ).toBeVisible();
};

export {
  createUser,
  createAndSignInUser,
  signInUser,
  insertProjectName,
  insertProjectSpecificLossRate,
  submitCustomProject,
  createAndSaveCustomProject,
  createAndSaveRestorationCustomProject,
  navigateToEditCustomProject,
  getDataFromNetworkRequest,
  expectEditProjectHeadingVisible,
};
