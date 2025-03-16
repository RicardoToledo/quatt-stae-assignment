import { test, expect } from '../../fixtures/apiFixture';
import { HTTP_STATUS } from '../../constants/apiConstants';
import {
    incompleteUserData,
    invalidEmailUserData,
    invalidGenderUserData,
    invalidStatusUserData,
    ApiError
} from '../../data/apiTestData';

/**
 * Test suite for negative user API scenarios
 */
test.describe('User API Negative Tests', () => {

    test('API-006: Fail to create a user with missing required fields', {
        tag: ['@api', '@negative', '@regression', '@create']
    }, async ({ apiClient }) => {
        // Attempt to create a user with missing required fields
        // Type assertion 'as any' bypasses TypeScript's type checking to intentionally send invalid data for negative testing
        const createInvalidUserResponse = await apiClient.createUser(incompleteUserData as any);

        // Verify the response
        expect(createInvalidUserResponse.status).toBe(HTTP_STATUS.UNPROCESSABLE_ENTITY);
        expect(Array.isArray(createInvalidUserResponse.body)).toBe(true);

        // Find each error by field in the response body array
        const errors = createInvalidUserResponse.body;
        const emailError = errors.find((error: ApiError) => error.field === 'email');
        const genderError = errors.find((error: ApiError) => error.field === 'gender');
        const statusError = errors.find((error: ApiError) => error.field === 'status');

        // Verify each error exists
        expect(emailError).toBeDefined();
        expect(genderError).toBeDefined();
        expect(statusError).toBeDefined();

        // Verify error messages
        expect(emailError.message).toContain("can't be blank");
        expect(statusError.message).toContain("can't be blank");
        expect(genderError.message).toContain("can't be blank");
        expect(genderError.message).toContain("can be male of female");
    });

    test('API-007: Fail to create a user with invalid email format', {
        tag: ['@api', '@negative', '@create']
    }, async ({ apiClient }) => {
        // Attempt to create a user with invalid email format
        const createInvalidEmailResponse = await apiClient.createUser(invalidEmailUserData);

        // Verify the response
        expect(createInvalidEmailResponse.status).toBe(HTTP_STATUS.UNPROCESSABLE_ENTITY);
        expect(Array.isArray(createInvalidEmailResponse.body)).toBe(true);

        // Since we expect only one error for email, we can check the first element directly
        const emailError = createInvalidEmailResponse.body[0];
        expect(emailError.field).toBe('email');
        expect(emailError.message).toContain('is invalid');
    });

    test.fail('API-008: Fail to create a user with invalid gender value', {
        tag: ['@api', '@negative', '@create']
    }, async ({ apiClient }) => {
        // Attempt to create a user with invalid gender value
        const createInvalidGenderResponse = await apiClient.createUser(invalidGenderUserData);

        // Verify the response
        expect(createInvalidGenderResponse.status).toBe(HTTP_STATUS.UNPROCESSABLE_ENTITY);
        expect(Array.isArray(createInvalidGenderResponse.body)).toBe(true);

        // Since we expect only one error for gender, we can check the first element directly
        const genderError = createInvalidGenderResponse.body[0];
        expect(genderError.field).toBe('gender');
        // ! BUG: The message "can't be blank, can be male of female" is not correct
        expect(genderError.message).toContain("invalid gender, can be male of female");
    });

    test.fail('API-009: Fail to create a user with invalid status value', {
        tag: ['@api', '@negative', '@create']
    }, async ({ apiClient }) => {
        // Attempt to create a user with invalid status value
        const createInvalidStatusResponse = await apiClient.createUser(invalidStatusUserData);

        // Verify the response
        expect(createInvalidStatusResponse.status).toBe(HTTP_STATUS.UNPROCESSABLE_ENTITY);
        expect(Array.isArray(createInvalidStatusResponse.body)).toBe(true);

        // Since we expect only one error for status, we can check the first element directly
        const statusError = createInvalidStatusResponse.body[0];
        expect(statusError.field).toBe('status');
        // ! BUG: The message "can't be blank" is not correct
        expect(statusError.message).toContain("invalid status");
    });

    test('API-010: Fail to get a non-existent user', {
        tag: ['@api', '@negative', '@read']
    }, async ({ apiClient }) => {
        // Use a very large ID that is unlikely to exist
        const nonExistentId = 999999999;

        // Attempt to get a non-existent user
        const getNonExistentUserResponse = await apiClient.getUser(nonExistentId);

        // Verify the response
        expect(getNonExistentUserResponse.status).toBe(HTTP_STATUS.NOT_FOUND);
    });

    test('API-011: Fail to update a non-existent user', {
        tag: ['@api', '@negative', '@update']
    }, async ({ apiClient, generateTestUser }) => {
        // Use a very large ID that is unlikely to exist
        const nonExistentId = 999999999;
        const testUser = generateTestUser();

        // Attempt to update a non-existent user
        const updateNonExistentUserResponse = await apiClient.updateUser(nonExistentId, testUser);

        // Verify the response
        expect(updateNonExistentUserResponse.status).toBe(HTTP_STATUS.NOT_FOUND);
    });

    test('API-012: Fail to delete a non-existent user', {
        tag: ['@api', '@negative', '@delete']
    }, async ({ apiClient }) => {
        // Use a very large ID that is unlikely to exist
        const nonExistentId = 999999999;

        // Attempt to delete a non-existent user
        const deleteNonExistentUserResponse = await apiClient.deleteUser(nonExistentId);

        // Verify the response
        expect(deleteNonExistentUserResponse.status).toBe(HTTP_STATUS.NOT_FOUND);
    });

    test('API-013: Fail to create a user without authentication', {
        tag: ['@api', '@negative', '@create']
    }, async ({ apiClient, generateTestUser }) => {
        // Generate a valid user but try to create without authentication
        const testUser = generateTestUser();

        // Attempt to create a user without authentication
        const createUserNoAuthResponse = await apiClient.createUserWithoutAuth(testUser);

        // Verify the response
        expect(createUserNoAuthResponse.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    });

    test('API-014: Fail to update a user without authentication', {
        tag: ['@api', '@negative', '@update']
    }, async ({ apiClient, generateTestUser, userIdsForCleanup }) => {
        // Create a test user first (with authentication)
        const testUser = generateTestUser();
        const createUserResponse = await apiClient.createUser(testUser);
        expect(createUserResponse.status).toBe(HTTP_STATUS.CREATED);

        const userId = createUserResponse.body.id;
        userIdsForCleanup.push(userId);

        // Attempt to update the user without authentication
        const updateUserNoAuthResponse = await apiClient.updateUserWithoutAuth(userId, { name: 'Updated Without Auth' });

        // Verify the response
        expect(updateUserNoAuthResponse.status).toBe(HTTP_STATUS.NOT_FOUND);
    });

    test('API-015: Fail to delete a user without authentication', {
        tag: ['@api', '@negative', '@delete']
    }, async ({ apiClient, generateTestUser, userIdsForCleanup }) => {
        // Create a test user first (with authentication)
        const testUser = generateTestUser();
        const createUserResponse = await apiClient.createUser(testUser);
        expect(createUserResponse.status).toBe(HTTP_STATUS.CREATED);

        const userId = createUserResponse.body.id;
        userIdsForCleanup.push(userId);

        // Attempt to delete the user without authentication
        const deleteUserNoAuthResponse = await apiClient.deleteUserWithoutAuth(userId);

        // Verify the response
        expect(deleteUserNoAuthResponse.status).toBe(HTTP_STATUS.NOT_FOUND);
    });
}); 