import { test, expect } from '../fixtures/userGaragePage';

test.describe('Garage Page Tests with Custom Fixture', () => {
    test('User can open Garage page pre-authenticated', async ({ userGaragePage }) => {
        await expect(userGaragePage.addCarButton).toBeVisible();
        await expect(userGaragePage.page).toHaveURL(/.*panel\/garage/);
    });
});