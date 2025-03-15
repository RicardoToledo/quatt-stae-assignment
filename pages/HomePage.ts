import { Page, Locator } from '@playwright/test';
import { ProductInfo } from '../data/testData';
import { ProductPage } from './ProductPage';
import { Header } from './components/Header';

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

    /**
     * Add multiple products to cart sequentially
     * @param products - Array of products to add to cart
     * @param productPage - ProductPage instance for product details verification
     * @param header - Header instance for navigation
     */
    async addMultipleProductsToCart(
        products: readonly ProductInfo[],
        productPage: ProductPage,
        header: Header
    ): Promise<void> {
        for (const [index, product] of products.entries()) {
            if (index > 0) {
                await header.homeLink.click(); // Return to homepage for subsequent products
            }
            await this.clickProductByName(product.name);
            await productPage.addToCart();
        }
    }

} 