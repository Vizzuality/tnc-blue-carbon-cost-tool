import { expect, Page, test } from "@playwright/test";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";
import { User } from "@shared/entities/users/user.entity";
import {Country} from "@shared/entities/country.entity";

let testManager: E2eTestManager;
let page: Page;

test.describe.configure({ mode: "serial" });

test.describe("Projects - Overview Table", () => {
    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        testManager = await E2eTestManager.load(page);
        await testManager.ingestCountries()
    });

    test.afterAll(async () => {
        await testManager.clearDatabase();
        await testManager.close();
    });

    test('I can filter Projects by Country', async () => {
        const china = await testManager.getDataSource().getRepository(Country).findOneOrFail({where: {name: 'China'}});
        const india = await testManager.getDataSource().getRepository(Country).findOneOrFail({where: {name: 'India'}});
        const chinaProject = await testManager.mocks().createProject({countryCode: china.code, projectName: 'China Mangrove Conservation Large'});
        const indiaProject = await testManager.mocks().createProject({countryCode: india.code, projectName: 'India Mangrove Conservation Large'});
        await page.goto('http://localhost:3000');
        await page.getByRole('button', { name: 'Filters' }).click();
        await page.locator('button').filter({ hasText: 'All countries' }).click();
        await page.getByText('China', {exact: true }).click();
        const projectsTable = page.locator('table tbody tr')
        const projectsInTable = await projectsTable.count();
        expect(projectsInTable).toBe(1);
        const firstRowCells = await projectsTable.nth(0).locator('td').allTextContents();
        expect(firstRowCells).toContain(chinaProject.projectName);

    });
});


