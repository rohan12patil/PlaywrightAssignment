import { test, expect, Page } from '@playwright/test';
import { ensureLoggedIn } from '../utils/auth';

test.describe('Dashboard Tooltip & PDF Export Scenarios', () => {

    test.beforeEach(async ({ page }, testInfo) => {
        await ensureLoggedIn(page);
        console.log(testInfo.title);
        console.log('Current page URL:', page.url());
    });


    test('Case 1: Verify tooltip Scenario', async ({ page }) => {
        // First, locate the iframe which contains the graph
        const iframeElementHandle = await page.locator('div.MuiBox-root iframe').first();

        // Wait untill the iframe is attached to the DOM
        await iframeElementHandle.waitFor({ state: "visible" });
        await expect(iframeElementHandle).toBeAttached();

        // Get the actual frame from the element handle
        const frame = await iframeElementHandle.contentFrame();
        if (!frame) throw new Error('iframe not available or not yet loaded');

        // Now locate & check visiblilty of the graph canvas inside the iframe 
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
        // Define the expected timestamp, based on hover X & Y value  
        const expectedTimestamp = '2025-01-08 06:00:00';

        // Assert that the tooltip timestamp contains the expected value
        expect(tooltipTimestamp?.trim()).toContain(expectedTimestamp);
    });

    test('Test 2: Download PDF functionality', async ({ page }) => {
        // Locate and click the download button 
        const actionToggleButton = page.locator('[data-testid="ActionToggleButton"] >> svg[data-testid="CloudDownloadIcon"]');
        await expect(actionToggleButton).toBeVisible();
        await actionToggleButton.click();

        // Wait for the exprt data dialog to appear
        const exportDataDialog = page.locator('[data-testid="AsyncActionDialog"]');
        await exportDataDialog.waitFor({ state: "visible" });
        await expect(exportDataDialog).toBeVisible();

        // Select the radio button for PDF format
        const pdfRadioButton = exportDataDialog.locator('input[type="radio"][value="pdf"]');
        await expect(pdfRadioButton).toBeVisible();
        await pdfRadioButton.click();

        // Click the Save to Files button to download the PDF
        const saveToFilesButton = exportDataDialog.locator('[data-testid="AsyncActionDialog-okButton"]');
        await expect(saveToFilesButton).toBeVisible();
        await saveToFilesButton.click();
        console.log('Save to Files button clicked, waiting for Download Dialog to appear...');

        // Wait for the Download Dialog to appear
        const downloadDialog = page.locator('[data-testid="AsyncActionResultDialog"]');
        await downloadDialog.waitFor({ state: "visible", timeout: 120000 });
        await expect(downloadDialog).toBeVisible();

        // Locate the anchor tag with the text "Download" and click it
        const downloadLink = downloadDialog.locator('a:has-text("Download")');
        await expect(downloadLink).toBeVisible();
        await downloadLink.click();
    });
});

