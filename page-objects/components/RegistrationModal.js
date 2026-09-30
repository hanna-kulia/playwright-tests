export class RegistrationModal {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // Input locators
        this.nameInput = page.locator('#signupName');
        this.lastNameInput = page.locator('#signupLastName');
        this.emailInput = page.locator('#signupEmail');
        this.passwordInput = page.locator('#signupPassword');
        this.repeatPasswordInput = page.locator('#signupRepeatPassword');

        // Action locators
        this.registerButton = page.getByRole('button', { name: 'Register' });
        this.errorMessage = page.locator('.invalid-feedback');
    }

    async waitForModal() {
        await this.nameInput.waitFor({ state: 'visible' });
    }

    async fillForm({ name, lastName, email, password, repeatPassword }) {
        if (name) await this.nameInput.fill(name);
        if (lastName) await this.lastNameInput.fill(lastName);
        if (email) await this.emailInput.fill(email);
        if (password) await this.passwordInput.fill(password);
        if (repeatPassword) await this.repeatPasswordInput.fill(repeatPassword);
    }

    async triggerValidationErrors() {
        await this.nameInput.focus();
        await this.nameInput.blur();
        await this.lastNameInput.focus();
        await this.lastNameInput.blur();
        await this.emailInput.focus();
        await this.emailInput.blur();
        await this.passwordInput.focus();
        await this.passwordInput.blur();
        await this.repeatPasswordInput.focus();
        await this.repeatPasswordInput.blur();
    }

    async clickRegister() {
        await this.registerButton.click();
    }

    getErrorMessageLocator(expectedText) {
        return this.errorMessage.filter({ hasText: expectedText });
    }
}