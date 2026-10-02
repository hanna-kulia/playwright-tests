import { test, expect } from '../fixtures/userGaragePage.js';

test.describe('API /api/cars POST tests', () => {
    test('Positive: should successfully create a car', async ({ userGaragePage }) => {
        const request = userGaragePage.page.request;

        const response = await request.post('/api/cars', {
            data: {
                carBrandId: 1,
                carModelId: 1,
                mileage: 122,
            },
        });

        expect(response.status()).toBe(201);

        const body = await response.json();
        expect(body.status).toBe('ok');
        expect(body.data.carBrandId).toBe(1);
        expect(body.data.carModelId).toBe(1);
        expect(body.data.mileage).toBe(122);
    });

    test('Negative: should fail when mileage is missing', async ({ userGaragePage }) => {
        const request = userGaragePage.page.request;

        const response = await request.post('/api/cars', {
            data: {
                carBrandId: 1,
                carModelId: 1,
            },
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.status).toBe('error');
        expect(body.message).toBeDefined();
    });

    test('Negative: should fail with invalid carBrandId', async ({ userGaragePage }) => {
        const request = userGaragePage.page.request;

        const response = await request.post('/api/cars', {
            data: {
                carBrandId: 99999,
                carModelId: 1,
                mileage: 100,
            },
        });

        expect(response.status()).toBe(404);

        const body = await response.json();
        expect(body.status).toBe('error');
        expect(body.message).toBeDefined();
    });
});