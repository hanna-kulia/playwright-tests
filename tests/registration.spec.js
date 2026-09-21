import { test, expect } from '@playwright/test';

test.describe('Registration Form', () => {

    test.beforeEach(async ({ page }) => {
        await page.context().setHTTPCredentials({
            username: 'guest',
            password: 'welcome2qauto',
        });
        await page.goto('https://qauto.forstudy.space/');

        await page.locator('button.hero-descriptor_btn', { hasText: 'Sign up' }).click();

        await page.locator('#signupName').waitFor({ state: 'visible' });
    });

    // TEST 1: POSITIVE SCENARIO

    test('Successful registration with valid data', async ({ page }) => {
        const uniqueEmail = `aqa-user-${Date.now()}@test.com`;

        await page.locator('#signupName').fill('Hanna');
        await page.locator('#signupLastName').fill('Test');
        await page.locator('#signupEmail').fill(uniqueEmail);
        await page.locator('#signupPassword').fill('Password123');
        await page.locator('#signupRepeatPassword').fill('Password123');

        const registerBtn = page.getByRole('button', { name: 'Register' });
        await expect(registerBtn).toBeEnabled();
        await registerBtn.click();

        // Verify successful redirection to garage page
        await expect(page).toHaveURL(/.*panel/);
    });

    // TEST 2: NEGATIVE SCENARIO - EMPTY FIELDS

    test('Validation errors for empty required fields', async ({ page }) => {
        const nameInput = page.locator('#signupName');
        const lastNameInput = page.locator('#signupLastName');
        const emailInput = page.locator('#signupEmail');
        const passwordInput = page.locator('#signupPassword');
        const rePasswordInput = page.locator('#signupRepeatPassword');

        // Trigger validation by focusing and unfocusing fields
        await nameInput.focus();
        await nameInput.blur();
        await lastNameInput.focus();
        await lastNameInput.blur();
        await emailInput.focus();
        await emailInput.blur();
        await passwordInput.focus();
        await passwordInput.blur();
        await rePasswordInput.focus();
        await rePasswordInput.blur();

        // Check validation error messages
        await expect(page.locator('.invalid-feedback')).toContainText([
            'Name required',
            'Last name required',
            'Email required',
            'Password required',
            'Re-enter password required'
        ]);

        // Verify border color and disabled Register button
        await expect(nameInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.getByRole('button', { name: 'Register' })).toBeDisabled();
    });


    // TEST 3: NEGATIVE SCENARIO - INVALID NAME LENGTH

    test('Validation errors for invalid Name and Last name length', async ({ page }) => {
        const nameInput = page.locator('#signupName');
        const lastNameInput = page.locator('#signupLastName');

        // Name length < 2 characters
        await nameInput.fill('A');
        await nameInput.blur();
        await expect(page.locator('.invalid-feedback').filter({ hasText: 'Name has to be from 2 to 20 characters long' })).toBeVisible();

        // Last name length > 20 characters
        await lastNameInput.fill('A'.repeat(21));
        await lastNameInput.blur();
        await expect(page.locator('.invalid-feedback').filter({ hasText: 'Last name has to be from 2 to 20 characters long' })).toBeVisible();

        await expect(page.getByRole('button', { name: 'Register' })).toBeDisabled();
    });


    // TEST 4: NEGATIVE SCENARIO - INVALID NAME DATA

    test('Validation errors for invalid Name and Last name format', async ({ page }) => {
        await page.locator('#signupName').fill('Hanna123');
        await page.locator('#signupName').blur();
        await expect(page.locator('.invalid-feedback').filter({ hasText: 'Name is invalid' })).toBeVisible();

        await page.locator('#signupLastName').fill('Test!');
        await page.locator('#signupLastName').blur();
        await expect(page.locator('.invalid-feedback').filter({ hasText: 'Last name is invalid' })).toBeVisible();

        await expect(page.getByRole('button', { name: 'Register' })).toBeDisabled();
    });


    // TEST 5: NEGATIVE SCENARIO - INVALID EMAIL

    test('Validation error for invalid Email format', async ({ page }) => {
        const emailInput = page.locator('#signupEmail');

        await emailInput.fill('invalid-email-format');
        await emailInput.blur();

        await expect(page.locator('.invalid-feedback').filter({ hasText: 'Email is incorrect' })).toBeVisible();
        await expect(emailInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.getByRole('button', { name: 'Register' })).toBeDisabled();
    });


    // TEST 6: NEGATIVE SCENARIO - INVALID PASSWORD & MISMATCH

    test('Validation errors for invalid Password and Password mismatch', async ({ page }) => {
        const passwordInput = page.locator('#signupPassword');
        const rePasswordInput = page.locator('#signupRepeatPassword');

        // Invalid password length / complexity
        await passwordInput.fill('short');
        await passwordInput.blur();
        await expect(page.locator('.invalid-feedback').filter({
            hasText: 'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter'
        })).toBeVisible();

        // Password mismatch
        await passwordInput.fill('Password123');
        await rePasswordInput.fill('Password456');
        await rePasswordInput.blur();

        await expect(page.locator('.invalid-feedback').filter({ hasText: 'Passwords do not match' })).toBeVisible();
        await expect(rePasswordInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.getByRole('button', { name: 'Register' })).toBeDisabled();
    });

});