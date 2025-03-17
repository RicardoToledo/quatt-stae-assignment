# Test Cases

### Test Coverage

#### UI Tests

- **Purchase Flows**: Complete end-to-end tests of the shopping and checkout process
- **Cart Management**: Tests for adding, removing, and updating items in the shopping cart
- **Payment Processing**: Validation of payment form submission and order confirmation
- **Edge Cases**: Tests for handling invalid inputs and error conditions

#### API Tests

- **CRUD Operations**: Complete coverage of Create, Read, Update, and Delete operations
- **Negative Scenarios**: Tests for invalid inputs, missing fields, and error handling
- **Authentication**: Validation of token-based authentication requirements
- **Integration Flows**: End-to-end API workflows combining multiple operations
- **Data Validation**: Verification of response data structure and content

This document contains a matrix test cases for both UI and API tests in the automation framework.

## UI Tests

| Test ID | Test Case                                                       | Type/Tags                                  | Test Data                                                  | Expected Result                                                                                                                    |
| ------- | --------------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| UI-001  | Complete purchase flow with valid payment for single product    | @ui @positive @regression @smoke @purchase | Samsung Galaxy S6, Valid payment details                   | Product added to cart, Cart shows correct product, Purchase successful, Order confirmation shown with correct details              |
| UI-002  | Complete purchase flow with valid payment for multiple products | @ui @positive @purchase                    | Samsung Galaxy S6, Nokia Lumia 1520, Valid payment details | All products added to cart, Cart shows correct items and total, Purchase successful, Order confirmation shown with correct details |
| UI-003  | Remove item from cart and verify cart and total updates         | @ui @positive @regression @smoke @cart     | Samsung Galaxy S6, Nokia Lumia 1520                        | Item removed successfully, Cart total updated correctly, Remaining items displayed correctly                                       |
| UI-004  | Prevent purchase attempt with empty shopping cart               | @ui @negative @cart                        | Empty cart                                                 | Purchase should not be possible with empty cart (Currently failing due to bug)                                                     |
| UI-005  | Prevent purchase completion with invalid payment details        | @ui @negative @regression @payment         | Samsung Galaxy S6, Invalid payment details                 | Purchase should not be possible with invalid payment (Currently failing due to bug)                                                |
| UI-006  | Verify purchase can not be made with empty payment form         | @ui @negative @payment                     | Samsung Galaxy S6, Empty payment form                      | Purchase button click has no effect, Order confirmation not shown                                                                  |

## API Tests

| Test ID | Test Case                                              | Type/Tags                                      | Expected Result                                                                                                                       |
| ------- | ------------------------------------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| API-001 | Create a new user with valid data                      | @api @positive @regression @smoke @create      | User created successfully with status 201, Response contains user data matching input                                                 |
| API-002 | Retrieve a user by ID                                  | @api @positive @regression @read               | User retrieved successfully with status 200, Response contains correct user data                                                      |
| API-003 | Update an existing user                                | @api @positive @regression @update             | User updated successfully with status 200, Response contains updated user data, Get request confirms update                           |
| API-004 | Delete an existing user                                | @api @positive @regression @delete             | User deleted successfully with status 204, Get request confirms user no longer exists                                                 |
| API-005 | Retrieve all users                                     | @api @positive @regression @read               | Users retrieved successfully with status 200, Response contains array of users with correct structure                                 |
| API-006 | Fail to create a user with missing required fields     | @api @negative @regression @create             | Request fails with status 422, Response contains validation errors for email, gender, and status fields                               |
| API-007 | Fail to create a user with invalid email format        | @api @negative @create                         | Request fails with status 422, Response contains validation error for email field                                                     |
| API-008 | Fail to create a user with invalid gender value        | @api @negative @create                         | Request fails with status 422, Response contains validation error for gender field (Currently failing due to incorrect error message) |
| API-009 | Fail to create a user with invalid status value        | @api @negative @create                         | Request fails with status 422, Response contains validation error for status field (Currently failing due to incorrect error message) |
| API-010 | Fail to get a non-existent user                        | @api @negative @read                           | Request fails with status 404                                                                                                         |
| API-011 | Fail to update a non-existent user                     | @api @negative @update                         | Request fails with status 404                                                                                                         |
| API-012 | Fail to delete a non-existent user                     | @api @negative @delete                         | Request fails with status 404                                                                                                         |
| API-013 | Fail to create a user without authentication           | @api @negative @create                         | Request fails with status 401 Unauthorized                                                                                            |
| API-014 | Fail to update a user without authentication           | @api @negative @update                         | Request fails with status 404 Not Found                                                                                               |
| API-015 | Fail to delete a user without authentication           | @api @negative @delete                         | Request fails with status 404 Not Found                                                                                               |
| API-016 | Complete user lifecycle flow from creation to deletion | @api @positive @regression @smoke @integration | User created, retrieved, updated, and deleted successfully with appropriate status codes at each step                                 |
| API-017 | Handle concurrent operations on the same user          | @api @positive @integration                    | All concurrent update operations succeed with status 200, Final state of user contains one of the updates                             |
| API-018 | Create multiple users and retrieve them in a list      | @api @positive @integration                    | Multiple users created successfully, All created users found in the list of all users                                                 |
| API-019 | Filter users by name using client-side filtering       | @api @positive @integration                    | Users with matching name pattern found in filtered results                                                                            |

## Bugs Found

The following bugs were identified during test execution and are documented in the codebase with `// ! BUG` comments:

| Bug ID  | Test ID        | Component             | Description                                                                                                                                                                                                                     | Impact                                                |
| ------- | -------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| BUG-001 | UI-001         | Order Confirmation    | Order modal confirmation shows date with month one less than current (e.g., 15/2/2025 instead of 15/3/2025). Likely due to JavaScript's getMonth() returning months from 0-11 and not being formatted to human-readable format. | Medium - Incorrect information displayed to user      |
| BUG-002 | UI-003         | Shopping Cart         | The cart is not consistent in showing items in the order in which they were added, making it difficult to predict item positions in the cart.                                                                                   | Low - Functional but confusing UX                     |
| BUG-003 | UI-004         | Purchase Flow         | System allows orders to be placed with an empty shopping cart, which should not be possible.                                                                                                                                    | High - Allows invalid business flow                   |
| BUG-004 | UI-005         | Payment Validation    | System allows orders to be placed with invalid payment details, which should be rejected.                                                                                                                                       | Critical - Potential financial impact                 |
| BUG-005 | API-008        | API Validation        | Incorrect error message for invalid gender value. API returns "can't be blank, can be male of female" instead of the expected "invalid gender, can be male of female".                                                          | Low - Misleading error message                        |
| BUG-006 | API-009        | API Validation        | Incorrect error message for invalid status value. API returns "can't be blank" instead of the expected "invalid status".                                                                                                        | Low - Misleading error message                        |
| BUG-007 | Manual Testing | API Name Validation   | User creation endpoint accepts special characters (e.g., "!@#$%^&") in the name field, which should be rejected as they are non-standard in names and pose potential security risks for SQL injection and XSS attacks.          | High - Security vulnerability and data integrity risk |
| BUG-008 | Manual Testing | API ID Field Handling | When creating a new user with an ID included in the request body, the API accepts the request but ignores the provided ID and generates a new one. This creates confusion as the ID in the request and response differ.         | Medium - Confusing behavior and poor API design       |
| BUG-009 | Manual Testing | API Delete Response   | The delete user endpoint returns a 204 No Content status without any message in the response body. While technically correct, this lacks user-friendliness and could be improved by returning a success message.                | Low - Usability improvement opportunity               |
