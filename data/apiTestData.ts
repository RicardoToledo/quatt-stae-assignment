import { config } from 'dotenv';
import { USER_GENDER, USER_STATUS } from '../constants/apiConstants';
import { generateRandomEmail } from '../utils/randomDataUtils';

config();

/**
 * Interface for API user objects
 */
export interface ApiUser {
    readonly id?: number; // Optional to be used for creating or retrieving a user
    readonly name: string;
    readonly email: string;
    readonly gender: USER_GENDER;
    readonly status: USER_STATUS;
}

/**
 * Interface for API error response objects
 */
export interface ApiError {
    readonly field: string;
    readonly message: string;
}

/**
 * Valid user data for creating a new user object
 */
export const validUserData: ApiUser = {
    name: 'Test User',
    email: generateRandomEmail(),
    gender: USER_GENDER.MALE,
    status: USER_STATUS.ACTIVE
};

/**
 * Updated user data for updating an existing user
 */
export const updatedUserData: Partial<ApiUser> = {
    name: 'Updated Test User',
    status: USER_STATUS.INACTIVE
};

/**
 * Invalid user data with missing required fields
 */
export const invalidUserData: Partial<ApiUser> = {
    name: 'Invalid User'
    // Missing required fields: email, gender, status
};

/**
 * Invalid user data with invalid email format
 */
export const invalidEmailUserData: ApiUser = {
    name: 'Invalid Email User',
    email: 'invalid_email',
    gender: USER_GENDER.FEMALE,
    status: USER_STATUS.ACTIVE
};

/**
 * Invalid user data with invalid gender value
 */
export const invalidGenderUserData: ApiUser = {
    name: 'Invalid Gender User',
    email: generateRandomEmail(),
    gender: USER_GENDER.OTHER,
    status: USER_STATUS.ACTIVE
};

/**
 * Invalid user data with invalid status value
 */
export const invalidStatusUserData: ApiUser = {
    name: 'Invalid Status User',
    email: generateRandomEmail(),
    gender: USER_GENDER.MALE,
    status: USER_STATUS.OTHER
}; 