import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate user', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await page.locator('#signinEmail').fill(process.env.USER_EMAIL || 'testuser@example.com');
    await page.locator('#signinPassword').fill(process.env.USER_PASSWORD || 'Password123');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/.*panel/);

    await page.context().storageState({ path: authFile });
});
