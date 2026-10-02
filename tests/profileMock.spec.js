import { test, expect } from '../fixtures/userGaragePage.js';

test.describe('Profile Page Mocking', () => {
    test('should display mocked user profile data', async ({ userGaragePage }) => {
        const page = userGaragePage.page;

        const mockedProfileData = {
            status: 'ok',
            data: {
                userId: 12345,
                photoFilename: 'default-user.png',
                name: 'Hanna',
                lastName: 'Test',
            },
        };

        await page.route('**/api/users/profile', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockedProfileData),
            });
        });

        await page.goto('/panel/profile');

        const profileName = page.locator('.profile_name');
        await expect(profileName).toHaveText(
            `${mockedProfileData.data.name} ${mockedProfileData.data.lastName}`
        );
    });
});