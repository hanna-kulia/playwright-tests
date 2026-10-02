import { BasePage } from './BasePage.js';

export class GaragePage extends BasePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);
        this.addCarButton = page.getByRole('button', { name: 'Add car' });
        this.profileDropdown = page.locator('#userNavDropdown');
    }

    async open() {
        await this.navigate('/panel/garage');
    }
}