import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);
        this.signUpButton = page.locator('button.hero-descriptor_btn', { hasText: 'Sign up' });
    }

    async openRegistrationModal() {
        await this.signUpButton.click();
    }
}