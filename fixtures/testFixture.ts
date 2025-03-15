import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { Header } from '../pages/components/Header';

/**
 * Extend the base test with our custom fixtures
 */
export const test = base.extend<{
    homePage: HomePage;
    productPage: ProductPage;
    cartPage: CartPage;
    header: Header;
}>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    header: async ({ page }, use) => {
        await use(new Header(page));
    },
});

test.beforeEach(async ({ page }) => {
    await page.goto('/');// Navigate to homepage before each test, can be overwritten on test level if needed
});

export { expect } from '@playwright/test';
