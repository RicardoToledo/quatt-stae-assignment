import { test as base } from '@playwright/test';
import { ApiClient } from '../utils/apiClient';
import { ApiUser } from '../data/apiTestData';
import { USER_GENDER, USER_STATUS } from '../constants/apiConstants';
import { generateRandomEmail, generateRandomString } from '../utils/randomDataUtils';

/**
 * Interface for API test context
 */
interface ApiTestContext {
    apiClient: ApiClient;
    generateTestUser: () => ApiUser;
    userIdsForCleanup: number[];
}

/**
 * Extend the base test with our custom API fixtures
 */
export const test = base.extend<ApiTestContext>({
    // Initialize the API client
    apiClient: async ({ }, use) => {
        const apiClient = new ApiClient();
        await use(apiClient);
    },

    // Generate a test user object
    generateTestUser: async ({ }, use) => {
        const generateUser = (): ApiUser => ({
            name: `Test User ${generateRandomString(6)}`,
            email: generateRandomEmail(),
            gender: USER_GENDER.MALE,
            status: USER_STATUS.ACTIVE
        });
        await use(generateUser);
    },

    // Track created user IDs for automatic cleanup after test execution
    userIdsForCleanup: async ({ apiClient }, use) => {
        const userIds: number[] = [];
        await use(userIds);
        // Clean up created users after test execution
        for (const userId of userIds) {
            try {
                await apiClient.deleteUser(userId);
            } catch (error) {
                console.warn(`Failed to delete test user with ID ${userId}:`, error);
            }
        }
    }

});

export { expect } from '@playwright/test'; 