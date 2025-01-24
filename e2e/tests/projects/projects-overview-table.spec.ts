import { expect, Page, test } from "@playwright/test";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";
import {Country} from "@shared/entities/country.entity";
import {Project, PROJECT_PRICE_TYPE} from "@shared/entities/projects.entity";
import {PROJECT_OVERVIEW_TABLE_LOCATOR} from "../../page-objects";

let testManager: E2eTestManager;
let page: Page;

test.describe.configure({ mode: "serial" });

test.describe("Projects - Overview Table", () => {
    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        testManager = await E2eTestManager.load(page);
        await testManager.ingestCountries()
    });
    test.afterEach(async () => {
        await testManager.clearTablesByEntities([Project])
    });

    test.afterAll(async () => {
        await testManager.clearDatabase();
        await testManager.close();
    });

    test('The default price type is Market price and I can filter the price type of Projects', async () => {
        const china = await testManager.getDataSource().getRepository(Country).findOneOrFail({where: {name: 'China'}});
        const india = await testManager.getDataSource().getRepository(Country).findOneOrFail({where: {name: 'India'}});
        for (const priceType of Object.values(PROJECT_PRICE_TYPE)) {
            await testManager.mocks().createProject({countryCode: china.code, projectName: `${priceType} China Mangrove Conservation`, priceType});
            await testManager.mocks().createProject({countryCode: india.code, projectName: `${priceType} India Mangrove Conservation`, priceType});
        }
        page.goto('http://localhost:3000/');
        await page.waitForResponse('**/projects?**');
        const firstRowCellsBeforeFilter = await page.locator(PROJECT_OVERVIEW_TABLE_LOCATOR).nth(0).locator('td').allTextContents();
        expect(firstRowCellsBeforeFilter).toContain(`Market price China Mangrove Conservation`)
        await page.locator('button').filter({ hasText: 'Market price' }).click();
        await page.getByText('Opex breakeven').click();
        const firstRowCellsAfterFilter = await page.locator(PROJECT_OVERVIEW_TABLE_LOCATOR).nth(0).locator('td').allTextContents();
        expect(firstRowCellsAfterFilter).toContain(`Opex breakeven China Mangrove Conservation`);
        const secondRowCellsAfterFilter = await page.locator(PROJECT_OVERVIEW_TABLE_LOCATOR).nth(1).locator('td').allTextContents();
        expect(secondRowCellsAfterFilter).toContain(`Opex breakeven India Mangrove Conservation`);
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
        const projectsTable = page.locator(PROJECT_OVERVIEW_TABLE_LOCATOR)
        const projectsInTable = await projectsTable.count();
        expect(projectsInTable).toBe(1);
        const firstRowCells = await projectsTable.nth(0).locator('td').allTextContents();
        expect(firstRowCells).toContain(chinaProject.projectName);

    });
});


