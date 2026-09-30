import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';
import { RegistrationModal } from '../page-objects/components/RegistrationModal';

test.describe('Registration Form (POM)', () => {
    let homePage;
    let registrationModal;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        registrationModal = new RegistrationModal(page);

        await homePage.navigate();
        await homePage.openRegistrationModal();
        await registrationModal.waitForModal();
    });


    // TEST 1: POSITIVE SCENARIO

    test('Successful registration with valid data', async ({ page }) => {
        const uniqueEmail = `aqa-user-${Date.now()}@test.com`;

        await registrationModal.fillForm({
            name: 'Hanna',
            lastName: 'Test',
            email: uniqueEmail,
            password: 'Password123',
            repeatPassword: 'Password123'
        });

        await expect(registrationModal.registerButton).toBeEnabled();
        await registrationModal.clickRegister();

        await expect(page).toHaveURL(/.*panel/);
    });


    // TEST 2: NEGATIVE SCENARIO - EMPTY FIELDS

    test('Validation errors for empty required fields', async () => {
        await registrationModal.triggerValidationErrors();

        await expect(registrationModal.errorMessage).toContainText([
            'Name required',
            'Last name required',
            'Email required',
            'Password required',
            'Re-enter password required'
        ]);

        await expect(registrationModal.nameInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(registrationModal.registerButton).toBeDisabled();
    });


    // TEST 3: NEGATIVE SCENARIO - INVALID NAME LENGTH

    test('Validation errors for invalid Name and Last name length', async () => {
        await registrationModal.fillForm({ name: 'A' });
        await registrationModal.nameInput.blur();
        await expect(registrationModal.getErrorMessageLocator('Name has to be from 2 to 20 characters long')).toBeVisible();

        await registrationModal.fillForm({ lastName: 'A'.repeat(21) });
        await registrationModal.lastNameInput.blur();
        await expect(registrationModal.getErrorMessageLocator('Last name has to be from 2 to 20 characters long')).toBeVisible();

        await expect(registrationModal.registerButton).toBeDisabled();
    });


    // TEST 4: NEGATIVE SCENARIO - INVALID NAME DATA

    test('Validation errors for invalid Name and Last name format', async () => {
        await registrationModal.fillForm({ name: 'Hanna123' });
        await registrationModal.nameInput.blur();
        await expect(registrationModal.getErrorMessageLocator('Name is invalid')).toBeVisible();

        await registrationModal.fillForm({ lastName: 'Test!' });
        await registrationModal.lastNameInput.blur();
        await expect(registrationModal.getErrorMessageLocator('Last name is invalid')).toBeVisible();

        await expect(registrationModal.registerButton).toBeDisabled();
    });


    // TEST 5: NEGATIVE SCENARIO - INVALID EMAIL

    test('Validation error for invalid Email format', async () => {
        await registrationModal.fillForm({ email: 'invalid-email-format' });
        await registrationModal.emailInput.blur();

        await expect(registrationModal.getErrorMessageLocator('Email is incorrect')).toBeVisible();
        await expect(registrationModal.emailInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(registrationModal.registerButton).toBeDisabled();
    });


    // TEST 6: NEGATIVE SCENARIO - INVALID PASSWORD & MISMATCH

    test('Validation errors for invalid Password and Password mismatch', async () => {
        await registrationModal.fillForm({ password: 'short' });
        await registrationModal.passwordInput.blur();
        await expect(registrationModal.getErrorMessageLocator(
            'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter'
        )).toBeVisible();

        await registrationModal.fillForm({
            password: 'Password123',
            repeatPassword: 'Password456'
        });
        await registrationModal.repeatPasswordInput.blur();

        await expect(registrationModal.getErrorMessageLocator('Passwords do not match')).toBeVisible();
        await expect(registrationModal.repeatPasswordInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(registrationModal.registerButton).toBeDisabled();
    });

});