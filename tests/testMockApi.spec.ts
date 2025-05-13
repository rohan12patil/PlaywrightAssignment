import { test, expect } from '@playwright/test';
import * as mockResponse from './mocks/responsemock.json';
import { ensureLoggedIn } from './utils/auth';

test.describe('Mock graph API Test', () => {
    test.beforeEach(async ({ page }, testInfo) => {
            await ensureLoggedIn(page);
            console.log(testInfo.title);
            console.log('Current page URL:', page.url());
        });
    test('Mock API response and validate data', async ({ page, context }) => {
        // Intercept the API request and mock the response
        await context.route('https://qa-test.intellisense.io/grafana/api/datasources/proxy/uid/fb1c5be8-a9e4-4a48-a325-97dcdb3ae8df//api/data-provider-query/1/REFERENCIA/data', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockResponse)
            });
        });

        

        // Validate the mocked data for "614:3614:none"
        const responseData3614 = mockResponse.values["614:3614:none"];
        expect(responseData3614).toBeDefined();
        expect(responseData3614.length).toBeGreaterThan(0);
        expect(responseData3614[8]).toBe(99.30578254756115); 

        
        const responseData3627 = mockResponse.values["614:3627:none"];
        expect(responseData3627).toBeDefined();
        expect(responseData3627.length).toBeGreaterThan(0);
        expect(responseData3627[8]).toBeNull(); 
    });
});
