import { Page, Locator } from '@playwright/test';

/**
 * Component object for the common header elements
 */
export class Header {
    readonly cartLink: Locator;
    readonly loginLink: Locator;
    readonly signupLink: Locator;

    constructor(page: Page) {
        this.cartLink = page.getByRole('link', { name: 'Cart', exact: true });
        this.loginLink = page.getByRole('link', { name: 'Log in', exact: true });
        this.signupLink = page.getByRole('link', { name: 'Sign up', exact: true });
    }
} 