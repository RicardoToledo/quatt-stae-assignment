/**
 * Utility functions for generating random test data
 */

/**
 * Generate a random email to avoid conflicts
 * @returns A random email address
 */
export function generateRandomEmail(): string {
    const timestamp = new Date().getTime();
    const randomString = generateRandomString(6);
    return `test_${randomString}_${timestamp}@email.com`;
}

/**
 * Generate a random string of specified length
 * @param length - Length of the random string
 * @returns A random alphanumeric string
 */
export function generateRandomString(length: number = 8): string {
    return Math.random().toString(36).substring(2, 2 + length);
}