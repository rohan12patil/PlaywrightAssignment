export const locators = {
    iframe: 'div.MuiBox-root iframe',
    panel: '[data-viz-panel-key="panel-1"]',
    tooltipDiv: '#grafana-portal-container div:has-text("-"):has-text(":")',
    actionToggleButton: '[data-testid="ActionToggleButton"] >> svg[data-testid="CloudDownloadIcon"]',
    exportDataDialog: '[data-testid="AsyncActionDialog"]',
    pdfRadioButton: 'input[type="radio"][value="pdf"]',
    saveToFilesButton: '[data-testid="AsyncActionDialog-okButton"]',
    downloadDialog: '[data-testid="AsyncActionResultDialog"]',
    downloadLink: 'a:has-text("Download")',
};