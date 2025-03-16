import supertest from 'supertest';
import { config } from 'dotenv';
import { ApiUser } from '../data/apiTestData';
import { API_ENDPOINTS } from '../constants/apiConstants';

config();

/**
 * API client for interacting with the Go REST API
 */
export class ApiClient {
    private readonly request: any;
    private readonly token: string;
    private readonly baseUrl: string;

    /**
     * Creates a new ApiClient instance
     */
    constructor() {
        this.baseUrl = process.env.API_BASE_URL || 'https://gorest.co.in/public/v2';
        this.token = process.env.API_TOKEN || '';
        this.request = supertest(this.baseUrl);
    }

    /**
     * Get all users
     * @returns SuperTest GET request for getting all users
     */
    public getUsers() {
        return this.request
            .get(API_ENDPOINTS.USERS)
            .set('Authorization', `Bearer ${this.token}`);
    }

    /**
     * Get a user by ID
     * @param id - User ID
     * @returns SuperTest GET request for getting a user by ID
     */
    public getUser(id: number) {
        return this.request
            .get(API_ENDPOINTS.USER_BY_ID(id))
            .set('Authorization', `Bearer ${this.token}`);
    }

    /**
     * Create a new user
     * @param userData - User data
     * @returns SuperTest POST request for creating a new user
     */
    public createUser(userData: ApiUser) {
        return this.request
            .post(API_ENDPOINTS.USERS)
            .set('Authorization', `Bearer ${this.token}`)
            .send(userData);
    }

    /**
     * Update an existing user
     * @param id - User ID
     * @param userData - Updated user data
     * @returns SuperTest PUT request for updating a user
     */
    public updateUser(id: number, userData: Partial<ApiUser>) {
        return this.request
            .put(API_ENDPOINTS.USER_BY_ID(id))
            .set('Authorization', `Bearer ${this.token}`)
            .send(userData);
    }

    /**
     * Delete a user
     * @param id - User ID
     * @returns SuperTest DELETE request for deleting a user
     */
    public deleteUser(id: number) {
        return this.request
            .delete(API_ENDPOINTS.USER_BY_ID(id))
            .set('Authorization', `Bearer ${this.token}`);
    }

    /**
     * Create a user without authentication
     * @param userData - User data
     * @returns SuperTest POST request for creating a user without authentication
     */
    public createUserWithoutAuth(userData: ApiUser) {
        return this.request
            .post(API_ENDPOINTS.USERS)
            .send(userData);
    }

    /**
     * Update a user without authentication
     * @param id - User ID
     * @param userData - Updated user data
     * @returns SuperTest PUT request for updating a user without authentication
     */
    public updateUserWithoutAuth(id: number, userData: Partial<ApiUser>) {
        return this.request
            .put(API_ENDPOINTS.USER_BY_ID(id))
            .send(userData);
    }

    /**
     * Delete a user without authentication
     * @param id - User ID
     * @returns SuperTest DELETE request for deleting a user without authentication
     */
    public deleteUserWithoutAuth(id: number) {
        return this.request
            .delete(API_ENDPOINTS.USER_BY_ID(id));
    }
} 