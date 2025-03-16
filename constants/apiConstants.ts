/**
 * API endpoints
 */
export const API_ENDPOINTS = {
    USERS: '/users',
    USER_BY_ID: (id: number) => `/users/${id}`
} as const;

/**
 * HTTP status codes
 */
export enum HTTP_STATUS {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500
}

/**
 * API error messages
 */
export const API_ERROR_MESSAGES = {
    AUTHENTICATION_FAILED: 'Authentication failed',
    RESOURCE_NOT_FOUND: 'Resource not found',
    VALIDATION_FAILED: 'Validation failed'
} as const;

/**
 * User gender enum
 */
export enum USER_GENDER {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other'
}

/**
 * User status enum
 */
export enum USER_STATUS {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    OTHER = 'other'
} 