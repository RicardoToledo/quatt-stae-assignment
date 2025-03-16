import { test, expect } from '../../fixtures/apiFixture';
import { HTTP_STATUS } from '../../constants/apiConstants';
import { ApiUser } from '../../data/apiTestData';

/**
 * Test suite for user API integration flows
 */
test.describe('User API Integration Tests', () => {

    test('API-016: Complete user lifecycle flow from creation to deletion', {
        tag: ['@api', '@positive', '@regression', '@smoke', '@integration']
    }, async ({ apiClient, generateTestUser, userIdsForCleanup }) => {
        // 1. Create a new user
        const testUser = generateTestUser();
        const createUserResponse = await apiClient.createUser(testUser);

        expect(createUserResponse.status).toBe(HTTP_STATUS.CREATED);
        expect(createUserResponse.body).toHaveProperty('id');
        expect(createUserResponse.body.name).toBe(testUser.name);
        expect(createUserResponse.body.email).toBe(testUser.email);

        const userId = createUserResponse.body.id;
        userIdsForCleanup.push(userId);

        // 2. Get the created user
        const getUserResponse = await apiClient.getUser(userId);

        expect(getUserResponse.status).toBe(HTTP_STATUS.OK);
        expect(getUserResponse.body).toHaveProperty('id', userId);
        expect(getUserResponse.body.name).toBe(testUser.name);

        // 3. Update the user
        const updatedName = 'Updated Name';
        const updateUserResponse = await apiClient.updateUser(userId, { name: updatedName });

        expect(updateUserResponse.status).toBe(HTTP_STATUS.OK);
        expect(updateUserResponse.body).toHaveProperty('id', userId);
        expect(updateUserResponse.body.name).toBe(updatedName);

        // 4. Verify the update
        const getUpdatedUserResponse = await apiClient.getUser(userId);

        expect(getUpdatedUserResponse.status).toBe(HTTP_STATUS.OK);
        expect(getUpdatedUserResponse.body).toHaveProperty('id', userId);
        expect(getUpdatedUserResponse.body.name).toBe(updatedName);

        // 5. Delete the user
        const deleteUserResponse = await apiClient.deleteUser(userId);

        expect(deleteUserResponse.status).toBe(HTTP_STATUS.NO_CONTENT);

        // 6. Verify the deletion
        const getDeletedUserResponse = await apiClient.getUser(userId);

        expect(getDeletedUserResponse.status).toBe(HTTP_STATUS.NOT_FOUND);

        // Remove from cleanup array since we already deleted it
        userIdsForCleanup.length = 0; // Clear the array since we've already deleted the user
    });

    test('API-017: Handle concurrent operations on the same user', {
        tag: ['@api', '@positive', '@integration']
    }, async ({ apiClient, generateTestUser, userIdsForCleanup }) => {
        // Create a test user
        const testUser = generateTestUser();
        const createUserResponse = await apiClient.createUser(testUser);

        expect(createUserResponse.status).toBe(HTTP_STATUS.CREATED);
        const userId = createUserResponse.body.id;
        userIdsForCleanup.push(userId);

        // Prepare multiple update operations
        const update1 = { name: 'Update 1' };
        const update2 = { name: 'Update 2' };
        const update3 = { name: 'Update 3' };

        // Execute updates concurrently
        const [updateResponse1, updateResponse2, updateResponse3] = await Promise.all([
            apiClient.updateUser(userId, update1),
            apiClient.updateUser(userId, update2),
            apiClient.updateUser(userId, update3)
        ]);

        // All updates should succeed
        expect(updateResponse1.status).toBe(HTTP_STATUS.OK);
        expect(updateResponse2.status).toBe(HTTP_STATUS.OK);
        expect(updateResponse3.status).toBe(HTTP_STATUS.OK);

        // Get the final state
        const getFinalUserResponse = await apiClient.getUser(userId);

        expect(getFinalUserResponse.status).toBe(HTTP_STATUS.OK);
        expect(getFinalUserResponse.body).toHaveProperty('id', userId);

        // The final name should be one of the updates
        const finalName = getFinalUserResponse.body.name;
        expect([update1.name, update2.name, update3.name]).toContain(finalName);
    });

    test('API-018: Create multiple users and retrieve them in a list', {
        tag: ['@api', '@positive', '@integration']
    }, async ({ apiClient, generateTestUser, userIdsForCleanup }) => {
        // Create multiple test users
        const testUser1 = generateTestUser();
        const testUser2 = generateTestUser();
        const testUser3 = generateTestUser();

        const createUser1Response = await apiClient.createUser(testUser1);
        const createUser2Response = await apiClient.createUser(testUser2);
        const createUser3Response = await apiClient.createUser(testUser3);

        expect(createUser1Response.status).toBe(HTTP_STATUS.CREATED);
        expect(createUser2Response.status).toBe(HTTP_STATUS.CREATED);
        expect(createUser3Response.status).toBe(HTTP_STATUS.CREATED);

        const userId1 = createUser1Response.body.id;
        const userId2 = createUser2Response.body.id;
        const userId3 = createUser3Response.body.id;

        userIdsForCleanup.push(userId1, userId2, userId3);

        // Get all users
        const getAllUsersResponse = await apiClient.getUsers();

        expect(getAllUsersResponse.status).toBe(HTTP_STATUS.OK);
        expect(Array.isArray(getAllUsersResponse.body)).toBe(true);

        // Verify our created users are in the list
        const userIds = getAllUsersResponse.body.map((user: ApiUser) => user.id);
        expect(userIds).toContain(userId1);
        expect(userIds).toContain(userId2);
        expect(userIds).toContain(userId3);
    });

    test('API-019: Filter users by name using client-side filtering', {
        tag: ['@api', '@positive', '@integration']
    }, async ({ apiClient, generateTestUser, userIdsForCleanup }) => {
        // Create users with specific names for searching
        const uniqueName = 'UniqueSearchName' + Date.now();

        // Create first test user with unique name
        const testUser1 = generateTestUser();
        const user1WithUniqueName = {
            ...testUser1,
            name: uniqueName + '1'
        };

        // Create second test user with unique name
        const testUser2 = generateTestUser();
        const user2WithUniqueName = {
            ...testUser2,
            name: uniqueName + '2'
        };

        const createUser1Response = await apiClient.createUser(user1WithUniqueName);
        const createUser2Response = await apiClient.createUser(user2WithUniqueName);

        expect(createUser1Response.status).toBe(HTTP_STATUS.CREATED);
        expect(createUser2Response.status).toBe(HTTP_STATUS.CREATED);

        userIdsForCleanup.push(createUser1Response.body.id, createUser2Response.body.id);

        // Get all users and filter by name in the test
        const getAllUsersResponse = await apiClient.getUsers();

        expect(getAllUsersResponse.status).toBe(HTTP_STATUS.OK);
        expect(Array.isArray(getAllUsersResponse.body)).toBe(true);

        // Filter users by name
        const searchResults = getAllUsersResponse.body.filter((user: ApiUser) =>
            user.name.includes(uniqueName)
        );

        expect(searchResults.length).toBeGreaterThanOrEqual(2);

        const foundNames = searchResults.map((user: ApiUser) => user.name);
        expect(foundNames).toContain(user1WithUniqueName.name);
        expect(foundNames).toContain(user2WithUniqueName.name);
    });
});