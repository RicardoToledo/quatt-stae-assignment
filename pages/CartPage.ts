import { Page, Locator } from '@playwright/test';
import { PaymentInfo } from '../data/testData';
import { extractNumber } from '../utils/textUtils';
import { WEB_ELEMENTS_TEXT } from '../constants/websiteTexts';

/**
 * Page object for the shopping cart page including order modals
 */
export class CartPage {
    // Cart page elements
    readonly productsTable: Locator;
    readonly totalAmount: Locator;
    readonly placeOrderButton: Locator;

    // Place Order modal elements
    readonly placeOrderModal: {
        container: Locator;
        nameInput: Locator;
        countryInput: Locator;
        cityInput: Locator;
        cardInput: Locator;
        monthInput: Locator;
        yearInput: Locator;
        purchaseButton: Locator;
    };

    // Order confirmation modal elements
    readonly confirmationModal: {
        container: Locator;
        orderConfirmedTitle: Locator;
        orderDetails: Locator;
    };

    constructor(private readonly page: Page) {
        // Initialize cart elements
        this.productsTable = page.getByRole('table');
        this.totalAmount = page.locator('#totalp');
        this.placeOrderButton = page.getByRole('button', { name: WEB_ELEMENTS_TEXT.CART.BUTTONS.PLACE_ORDER });

        // Initialize place order modal elements
        this.placeOrderModal = {
            container: page.getByRole('dialog', { name: WEB_ELEMENTS_TEXT.CART.BUTTONS.PLACE_ORDER }),
            nameInput: page.getByRole('textbox', { name: 'Name:' }),
            countryInput: page.getByRole('textbox', { name: 'Country:' }),
            cityInput: page.getByRole('textbox', { name: 'City:' }),
            cardInput: page.getByRole('textbox', { name: 'Credit card:' }),
            monthInput: page.getByRole('textbox', { name: 'Month:' }),
            yearInput: page.getByRole('textbox', { name: 'Year:' }),
            purchaseButton: page.getByRole('button', { name: WEB_ELEMENTS_TEXT.CART.BUTTONS.PURCHASE })
        };

        // Initialize confirmation modal elements
        this.confirmationModal = {
            container: page.locator('div.sweet-alert'),
            orderConfirmedTitle: page.getByRole('heading', {
                name: WEB_ELEMENTS_TEXT.CART.MODALS.ORDER_CONFIRMATION.TITLE,
                level: 2
            }),
            orderDetails: page.locator('div.sweet-alert p')
        };
    }

    /**
     * Get product row locator by product name
     * @param productName - The name of the product to find
     * @returns Locator for the product row
     */
    getProductRow(productName: string): Locator {
        return this.productsTable.getByRole('row').filter({ hasText: productName });
    }

    /**
     * Calculate total price by summing all product prices in the cart table
     * @returns The calculated total price
     */
    async calculateTableTotal(): Promise<number> {
        const rows = await this.productsTable.getByRole('row').all();
        let total = 0;
        // Skip header row
        for (const row of rows.slice(1)) {
            const priceText = await row.locator('td').nth(2).textContent() || '0';
            total += extractNumber(priceText);
        }
        return total;
    }

    /**
     * Get the displayed total price from the cart page
     * @returns The displayed total price
     */
    async getCartDisplayedTotal(): Promise<number> {
        return parseInt(await this.totalAmount.textContent() || '0');
    }

    /**
     * Fill payment form in place order modal
     * @param payment - The payment information to fill
     */
    async fillPaymentForm(payment: PaymentInfo): Promise<void> {
        await this.placeOrderModal.nameInput.fill(payment.name);
        await this.placeOrderModal.countryInput.fill(payment.country);
        await this.placeOrderModal.cityInput.fill(payment.city);
        await this.placeOrderModal.cardInput.fill(payment.card);
        await this.placeOrderModal.monthInput.fill(payment.month);
        await this.placeOrderModal.yearInput.fill(payment.year);
    }

    /**
     * Get order details from confirmation modal
     * @returns Order details from the confirmation modal
     */
    async getOrderDetails(): Promise<{
        amount: number;
        cardNumber: string;
        name: string;
        date: string;
    }> {
        const orderText = await this.confirmationModal.orderDetails.textContent() || '';
        return {
            amount: parseInt(orderText.match(/Amount: (\d+)/)?.[1] || '0'),
            cardNumber: orderText.match(/Card Number: (\d+)/)?.[1] || '',
            name: orderText.match(/Name: ([^\n]+?)(?=\s*Date:)/)?.[1] || '',
            date: orderText.match(/Date: ([^\n]+)/)?.[1] || ''
        };
    }

    /**
     * Remove an item from the cart by product name
     * @param productName - The name of the product to remove
     */
    async removeItemByName(productName: string): Promise<void> {
        const row = this.getProductRow(productName);
        const deleteButton = row.getByRole('link', { name: 'Delete' });
        await deleteButton.click();
    }
} 