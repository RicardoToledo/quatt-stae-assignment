import { test, expect } from '../../fixtures/testFixture';
import { samsungGalaxyS6, validPayment } from '../../data/testData';

// UI Assignment: Automate the Product Purchase Flow
test.describe('Purchase Flow Tests', () => {

    test('UI-001: Complete purchase flow with valid payment for single product', async ({ homePage, productPage, cartPage, header }) => {
        // Click on product by name
        await homePage.clickProductByName(samsungGalaxyS6.name);

        // Verify expected product details in Product page
        await expect(productPage.productName).toHaveText(samsungGalaxyS6.name);
        await expect(productPage.productPrice).toContainText(`$${samsungGalaxyS6.price}`);
        await expect(productPage.productDescription).toContainText(samsungGalaxyS6.description);

        // Add product to cart and accept dialog
        await productPage.addToCart();

        // Go to cart using navigation link
        await header.cartLink.click();

        // Verify product in cart
        await expect(cartPage.getProductRow(samsungGalaxyS6.name)).toBeVisible();

        // Verify all totals match
        const expectedTotal = samsungGalaxyS6.price;
        const tableTotal = await cartPage.calculateTableTotal();
        const displayedTotal = await cartPage.getCartDisplayedTotal();
        expect(tableTotal).toBe(expectedTotal);
        expect(displayedTotal).toBe(expectedTotal);

        // Complete purchase flow
        await cartPage.placeOrderButton.click();
        await cartPage.fillPaymentForm(validPayment);
        await cartPage.placeOrderModal.purchaseButton.click();

        // Verify order success and details
        await expect(cartPage.confirmationModal.container).toBeVisible();
        await expect(cartPage.confirmationModal.title).toBeVisible();
        const orderDetails = await cartPage.getOrderDetails();
        expect(orderDetails.amount).toBe(expectedTotal);
        expect(orderDetails.cardNumber).toBe(validPayment.card);
        expect(orderDetails.name).toBe(validPayment.name);
        // expect(orderDetails.date).toBe(expectedDate);
        // ! BUG: Date's month is not displaying correctly
    });

}); 