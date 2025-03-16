import { Page, Locator } from '@playwright/test';
import { acceptDialog } from '../utils/dialogUtils';
import { WEB_ELEMENTS_TEXT } from '../constants/websiteTexts';

/**
 * Page object for the Product page
 */
export class ProductPage {
    readonly productName: Locator;
    readonly productPrice: Locator;
    readonly productDescription: Locator;
    readonly addToCartButton: Locator;

    constructor(private readonly page: Page) {
        this.productName = page.locator('.name');
        this.productPrice = page.locator('.price-container');
        this.productDescription = page.locator('#more-information');
        this.addToCartButton = page.getByRole('link', { name: WEB_ELEMENTS_TEXT.PRODUCT.BUTTONS.ADD_TO_CART });
    }

    /**
     * Clicks the Add to Cart button and handles the confirmation dialog that appears
     * @returns Promise that resolves when the dialog is handled and product is added
     */
    async addToCart(): Promise<void> {
        await this.addToCartButton.click();
        await acceptDialog(this.page);
    }
} 