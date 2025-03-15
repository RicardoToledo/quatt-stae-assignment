import { Page, Dialog } from '@playwright/test';

/**
 * Accept browser dialog/alert
 * @param page - Playwright page object
 * @returns Promise that resolves when dialog is handled
 */
export async function acceptDialog(page: Page): Promise<void> {
    // Create promise to wait for dialog event
    const dialogPromise = page.waitForEvent('dialog');
    // Define handler that will accept any dialog
    const dialogHandler = async (dialog: Dialog) => {
        await dialog.accept();
    };
    // Set up listener, wait for dialog, then clean up
    page.on('dialog', dialogHandler);
    await dialogPromise;
    page.off('dialog', dialogHandler);
} 