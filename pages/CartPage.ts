import { Page, Locator } from '@playwright/test';
import { PaymentInfo } from '../data/testData';
import { extractNumber } from '../utils/textUtils';

/**
 * Page object for the shopping cart page including order modals
 */
export class CartPage {
    // Cart page elements
    readonly productsTable: Locator;
    readonly totalPrice: Locator;
    readonly placeOrderButton: Locator;

    // Place Order modal elements
    readonly placeOrderModal: {
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
        title: Locator;
        orderDetails: Locator;
    };

    constructor(private readonly page: Page) {
        // Initialize cart elements
        this.productsTable = page.getByRole('table');
        this.totalPrice = page.locator('#totalp');
        this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });

        // Initialize place order modal elements
        this.placeOrderModal = {
            nameInput: page.getByRole('textbox', { name: 'Name:' }),
            countryInput: page.getByRole('textbox', { name: 'Country:' }),
            cityInput: page.getByRole('textbox', { name: 'City:' }),
            cardInput: page.getByRole('textbox', { name: 'Credit card:' }),
            monthInput: page.getByRole('textbox', { name: 'Month:' }),
            yearInput: page.getByRole('textbox', { name: 'Year:' }),
            purchaseButton: page.getByRole('button', { name: 'Purchase' })
        };

        // Initialize confirmation modal elements
        this.confirmationModal = {
            container: page.locator('div.sweet-alert'),
            title: page.getByRole('heading', { name: 'Thank you for your purchase!', level: 2 }),
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
        let total = 0;
        const rows = await this.productsTable.getByRole('row').all();
        // Skip header row
        for (let i = 1; i < rows.length; i++) {
            const priceCell = rows[i].locator('td').nth(2);
            const priceText = await priceCell.textContent() || '0';
            total += extractNumber(priceText);
        }
        return total;
    }

    /**
     * Get the displayed total price from the cart page
     * @returns The displayed total price
     */
    async getCartDisplayedTotal(): Promise<number> {
        return parseInt(await this.totalPrice.textContent() || '0');
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
} 