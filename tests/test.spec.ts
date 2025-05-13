import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';

// Load data from data.json
const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
let pageURL = ''; // Shared variable to store the final logged-in page URL

// Reusable login function
async function ensureLoggedIn(page: Page) {
    // Check if the current URL contains "dashboards"
    const currentUrl = page.url();
    console.log('current PAGE URL::  ', currentUrl)
    // Check if we're already on the dashboards page
    if (currentUrl && currentUrl.includes('dashboards')) {
        console.log('Already logged in, skipping login process.');
        return;
    }


    // Perform login if not already logged in
    // console.log('Not logged in, performing login...');
    await page.goto(data.url);
    await page.fill('input[type="email"]', data.email);
    await page.fill('input[type="password"]', data.password);
    await page.click('[data-testid="SignInLocal-signInButton"]');
    // Wait until the URL contains 'dashboards' after login
    await expect(page).toHaveURL(/.*dashboards.*/);

    // console.log('Login successful! Current URL:', pageURL);
}

test.describe('Dashboard Tooltip & PDF Export Scenarios', () => {

    test.beforeEach(async ({ page }, testInfo) => {
        await ensureLoggedIn(page);
        console.log(testInfo.title);
        console.log('Current page URL:', page.url());
    });


    test('Case 1: Verify tooltip Scenario', async ({ page }) => {
        // First, locate the iframe within the MuiBox-root container
        const iframeElementHandle = await page.locator('div.MuiBox-root iframe').first();

        // Ensure the iframe is attached to the DOM
        await iframeElementHandle.waitFor({ state: "visible" });
        await expect(iframeElementHandle).toBeAttached();

        // Get the actual frame from the element handle
        const frame = await iframeElementHandle.contentFrame();
        if (!frame) throw new Error('iframe not available or not yet loaded');

        // Now locate the canvas inside the iframe
        const panel = frame.locator('[data-viz-panel-key="panel-1"]');
        await panel.waitFor({ state: "visible" });
        await expect(panel).toBeVisible();
        
        // Add a short delay to allow the tooltip to render
        await page.waitForTimeout(100);
        await panel.hover({ position: { x: 220, y: 150 } });
        await page.waitForTimeout(200);

        // Locate the tooltip div using the style selector and filter by text content containing '-' and ':'
        const tooltipDiv = frame.locator('#grafana-portal-container div:has-text("-"):has-text(":")').first();
        await tooltipDiv.waitFor({ state: "visible" });
        await expect(tooltipDiv).toBeVisible();

        // Extract the timestamp from the tooltip
        const tooltipTimestamp = await tooltipDiv.textContent();
        console.log(tooltipTimestamp)
        // Define the expected timestamp (replace with actual expected value)
        const expectedTimestamp = '2025-01-08 06:00:00';

        // Assert that the tooltip timestamp contains the expected value
        expect(tooltipTimestamp?.trim()).toContain(expectedTimestamp);
    });

    test('Test 2: Download PDF functionality', async ({ page }) => {
        // Locate and click the button to toggle the action menu
        const actionToggleButton = page.locator('[data-testid="ActionToggleButton"] >> svg[data-testid="CloudDownloadIcon"]');
        await expect(actionToggleButton).toBeVisible();
        await actionToggleButton.click();

        // Wait for the dialog to appear
        const asyncActionDialog = page.locator('[data-testid="AsyncActionDialog"]');
        await asyncActionDialog.waitFor({ state: "visible" });
        await expect(asyncActionDialog).toBeVisible();

        // Select the radio button for PDF
        const pdfRadioButton = asyncActionDialog.locator('input[type="radio"][value="pdf"]');
        await expect(pdfRadioButton).toBeVisible();
        await pdfRadioButton.click();

        // Click the OK button to download the PDF
        const okButton = asyncActionDialog.locator('[data-testid="AsyncActionDialog-okButton"]');
        await expect(okButton).toBeVisible();
        await okButton.click();
        console.log('OK button clicked, waiting for AsyncActionResultDialog...');

        // Wait for the AsyncActionResultDialog to appear
        const asyncActionResultDialog = page.locator('[data-testid="AsyncActionResultDialog"]');
        await asyncActionResultDialog.waitFor({ state: "visible", timeout: 120000 });
        await expect(asyncActionResultDialog).toBeVisible();

        // Locate the anchor tag with the text "Download" and click it
        const downloadLink = asyncActionResultDialog.locator('a:has-text("Download")');
        await expect(downloadLink).toBeVisible();
        await downloadLink.click();
    });
});

