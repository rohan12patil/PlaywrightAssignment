import { expect, Page } from '@playwright/test';
import * as fs from 'fs';

// Load data from data.json
const data = JSON.parse(fs.readFileSync('./tests/data.json', 'utf-8'));

// Reusable login function
export async function ensureLoggedIn(page: Page) {
    // Check if the current URL contains "dashboards"
    const currentUrl = page.url();
    if (currentUrl && currentUrl.includes('dashboards')) {
        console.log('Already logged in, skipping login process.');
        return;
    }

    // Perform login if not already logged in
    await page.goto(data.url);
    await page.fill('input[type="email"]', data.email);
    await page.fill('input[type="password"]', data.password);
    await page.click('[data-testid="SignInLocal-signInButton"]');
    // Wait until the URL contains 'dashboards' after login
    await expect(page).toHaveURL(/.*dashboards.*/);
}