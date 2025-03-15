import { config } from 'dotenv';
config();

/**
 * Interface for user credentials
 */
export interface UserCredentials {
    readonly username: string;
    readonly password: string;
}

/**
 * Interface for payment information
 */
export interface PaymentInfo {
    name: string;
    country: string;
    city: string;
    card: string;
    month: string;
    year: string;
}

/**
 * Interface for product information
 */
export interface ProductInfo {
    name: string;
    price: number;
    description: string;
}

/**
 * Valid user credentials
 */
export const validUser: UserCredentials = {
    username: process.env.TEST_USERNAME || 'testuser',
    password: process.env.TEST_PASSWORD || 'testpass'
};

/**
 * Invalid user credentials
 */
export const invalidUser: UserCredentials = {
    username: 'invaliduser',
    password: 'invalidpass'
};

/**
 * Valid payment information
 */
export const validPayment: PaymentInfo = {
    name: process.env.TEST_PAYMENT_NAME || 'Test User',
    country: process.env.TEST_PAYMENT_COUNTRY || 'United States',
    city: process.env.TEST_PAYMENT_CITY || 'New York',
    card: process.env.TEST_PAYMENT_CARD || '4111111111111111',
    month: process.env.TEST_PAYMENT_MONTH || '12',
    year: process.env.TEST_PAYMENT_YEAR || '2025'
};

/**
 * Invalid payment information
 */
export const invalidPayment: PaymentInfo = {
    ...validPayment,
    card: '0000000000000000'
};

/**
 * Samsung Galaxy S6 product information
 */
export const samsungGalaxyS6: ProductInfo = {
    name: 'Samsung galaxy s6',
    price: 360,
    description: 'The Samsung Galaxy S6 is powered by 1.5GHz octa-core Samsung Exynos 7420 processor and it comes with 3GB of RAM. The phone packs 32GB of internal storage cannot be expanded.'
};

/**
 * Nokia Lumia 1520 product information
 */
export const nokiaLumia1520: ProductInfo = {
    name: 'Nokia lumia 1520',
    price: 820,
    description: 'Nokia lumia 1520'
}; 