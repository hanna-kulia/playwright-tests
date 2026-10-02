import { GaragePage } from '../page-objects/GaragePage.js';
import { test as base } from '@playwright/test';

export const test = base.extend({
    userGaragePage: async ({ browser }, use) => {
        const context = await browser.newContext({
            storageState: 'playwright/.auth/user.json',
        });
        const page = await context.newPage();
        const garagePage = new GaragePage(page);

        await garagePage.open();
        await use(garagePage);

        await context.close();
    },
});

export { expect } from '@playwright/test';