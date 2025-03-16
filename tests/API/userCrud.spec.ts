import { test, expect } from '../../fixtures/apiFixture';
import { HTTP_STATUS } from '../../constants/apiConstants';
import { validUserData, updatedUserData } from '../../data/apiTestData';

/**
 * Test suite for user CRUD operations
 */
test.describe('User API CRUD Tests', () => {

    test('API-001: Create a new user with valid data', {
        tag: ['@api', '@positive', '@regression', '@smoke', '@create']
    }, async ({ apiClient, userIdsForCleanup }) => {
        // Create a new user
        const createUserResponse = await apiClient.createUser(validUserData);

        // Verify the response
        expect(createUserResponse.status).toBe(HTTP_STATUS.CREATED);
        expect(createUserResponse.body).toHaveProperty('id'); // Response returned with ID property
        expect(createUserResponse.body.name).toBe(validUserData.name);
        expect(createUserResponse.body.email).toBe(validUserData.email);
        expect(createUserResponse.body.gender).toBe(validUserData.gender);
        expect(createUserResponse.body.status).toBe(validUserData.status);

        // Store the user ID for cleanup
        expect(createUserResponse.body.id).toBeTruthy(); // ID should be valid
        userIdsForCleanup.push(createUserResponse.body.id);
    });

    test('API-002: Retrieve a user by ID', {
        tag: ['@api', '@positive', '@regression', '@read']
    }, async ({ apiClient, generateTestUser, userIdsForCleanup }) => {
        // Create a test user first
        const testUser = generateTestUser();
        const createUserResponse = await apiClient.createUser(testUser);
        expect(createUserResponse.status).toBe(HTTP_STATUS.CREATED);
        expect(createUserResponse.body.id).toBeTruthy();

        const userId = createUserResponse.body.id;
        userIdsForCleanup.push(userId);

        // Get the user by ID
        const getUserResponse = await apiClient.getUser(userId);

        // Verify the response
        expect(getUserResponse.status).toBe(HTTP_STATUS.OK);
        expect(getUserResponse.body).toHaveProperty('id', userId);
        expect(getUserResponse.body.name).toBe(testUser.name);
        expect(getUserResponse.body.email).toBe(testUser.email);
        expect(getUserResponse.body.gender).toBe(testUser.gender);
        expect(getUserResponse.body.status).toBe(testUser.status);
    });

    test('API-003: Update an existing user', {
        tag: ['@api', '@positive', '@regression', '@update']
    }, async ({ apiClient, generateTestUser, userIdsForCleanup }) => {
        // Create a test user first
        const testUser = generateTestUser();
        const createUserResponse = await apiClient.createUser(testUser);
        expect(createUserResponse.status).toBe(HTTP_STATUS.CREATED);
        expect(createUserResponse.body.id).toBeTruthy();

        const userId = createUserResponse.body.id;
        userIdsForCleanup.push(userId);

        // Update the user
        const updateUserResponse = await apiClient.updateUser(userId, updatedUserData);

        // Verify the response
        expect(updateUserResponse.status).toBe(HTTP_STATUS.OK);
        expect(updateUserResponse.body).toHaveProperty('id', userId);
        expect(updateUserResponse.body.name).toBe(updatedUserData.name);
        expect(updateUserResponse.body.email).toBe(testUser.email); // Email should remain the same
        expect(updateUserResponse.body.gender).toBe(testUser.gender); // Gender should remain the same
        expect(updateUserResponse.body.status).toBe(updatedUserData.status);

        // Verify the user was actually updated by getting it again
        const getUserAfterUpdateResponse = await apiClient.getUser(userId);
        expect(getUserAfterUpdateResponse.status).toBe(HTTP_STATUS.OK);
        expect(getUserAfterUpdateResponse.body.name).toBe(updatedUserData.name);
        expect(getUserAfterUpdateResponse.body.status).toBe(updatedUserData.status);
    });

    test('API-004: Delete an existing user', {
        tag: ['@api', '@positive', '@regression', '@delete']
    }, async ({ apiClient, generateTestUser }) => {
        // Create a test user first
        const testUser = generateTestUser();
        const createUserResponse = await apiClient.createUser(testUser);
        expect(createUserResponse.status).toBe(HTTP_STATUS.CREATED);
        expect(createUserResponse.body.id).toBeTruthy();

        const userId = createUserResponse.body.id;

        // Delete the user
        const deleteUserResponse = await apiClient.deleteUser(userId);

        // Verify the delete response
        expect(deleteUserResponse.status).toBe(HTTP_STATUS.NO_CONTENT);

        // Verify the user was actually deleted by trying to get it
        const getUserAfterDeleteResponse = await apiClient.getUser(userId);
        expect(getUserAfterDeleteResponse.status).toBe(HTTP_STATUS.NOT_FOUND);
    });

    test('API-005: Retrieve all users', {
        tag: ['@api', '@positive', '@regression', '@read']
    }, async ({ apiClient }) => {
        // Get all users
        const getAllUsersResponse = await apiClient.getUsers();

        // Verify the response
        expect(getAllUsersResponse.status).toBe(HTTP_STATUS.OK);
        expect(Array.isArray(getAllUsersResponse.body)).toBe(true);

        // Verify we have at least one user
        expect(getAllUsersResponse.body.length).toBeGreaterThan(0);

        // Verify the structure of the first user
        const firstUser = getAllUsersResponse.body[0];
        expect(firstUser).toHaveProperty('id');
        expect(firstUser).toHaveProperty('name');
        expect(firstUser).toHaveProperty('email');
        expect(firstUser).toHaveProperty('gender');
        expect(firstUser).toHaveProperty('status');
    });
}); 