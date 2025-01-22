import { expect, Page, test } from "@playwright/test";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";
import {BaseDataView} from "@shared/entities/base-data.view";

let testManager: E2eTestManager;
let page: Page;

test.describe.configure({ mode: "serial" });

test.describe("Projects - Create Custom Project", () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    testManager = await E2eTestManager.load(page);
    await testManager.ingestCountries();
    await testManager.ingestExcel();
  });

  test.afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  test("I can create a custom project with default values", async () => {
    const data = await testManager.getDataSource().getRepository(BaseDataView).find();
    console.log('EXCEL DATA **********');
    console.log(data);
  });
});
