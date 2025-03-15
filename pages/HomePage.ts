import { Page, Locator } from '@playwright/test';

/**
 * Page object for the homepage
 */
export class HomePage {
    private readonly productCards: Locator;

    constructor(page: Page) {
        this.productCards = page.locator('.card'); // Further access to card elements can be done in the future
    }

    /**
     * Click on a product card by name
     * @param productName - The name of the product to click
     */
    async clickProductByName(productName: string): Promise<void> {
        await this.productCards.getByRole('link', { name: productName }).click();
    }

} 