# Test Automation Framework

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-%3E%3D22.13.10-brightgreen.svg)](https://nodejs.org/)
[![Playwright](https://img.shields.io/badge/playwright-tested-brightgreen.svg)](https://playwright.dev/)

This test automation framework provides comprehensive testing capabilities for both UI and API testing of the following applications:

- The [DemoBlaze](https://www.demoblaze.com/) e-commerce demo website UI using Playwright with TypeScript
- The [GoRest](https://gorest.co.in/) API using Playwright with TypeScript and [SuperTest](https://github.com/ladjs/supertest)

It is designed to be maintainable, scalable, easy to use and understand, following industry best practices with clean code patterns.

## Project Structure

```
├── constants/          # Constants and status codes
├── data/               # Test data and interfaces
├── fixtures/           # Test fixtures and setup
├── pages/              # Page Object Models for UI tests
├── tests/              # Test files
│   ├── UI/             # UI test files
│   └── API/            # API test files
├── utils/              # Utility functions
├── .env                # Environment variables
├── eslint.config.mjs   # ESLint configuration
├── package.json        # Project dependencies
├── playwright.config.ts # Playwright configuration
├── TEST-CASES.md       # Detailed test cases and bugs documentation
└── tsconfig.json       # TypeScript configuration
```

## Overview

### Development Process

The development of this framework was driven by the need to create a robust, maintainable testing solution that addresses both UI and API testing challenges in a unified approach. After evaluating several automation tools, Playwright was selected for its cross-browser capabilities, performance, and modern architecture.

The project began with a thorough analysis of both target applications to identify critical user journeys and potential risk areas. For the DemoBlaze e-commerce site, I focused on the core purchase flow and cart management, while the GoRest API testing centered on comprehensive CRUD operations and validation scenarios.

One of the main challenges was designing a framework that could elegantly handle both UI and API testing paradigms while maintaining a consistent structure. This was addressed by implementing a modular architecture with clear separation of concerns, allowing testers to easily extend the framework for new features or applications.

The QA strategy follows a pyramid approach:

- Strong foundation of API tests for backend validation
- UI tests focused on critical user journeys
- Comprehensive test data management for both layers
- Systematic bug identification and documentation

Throughout development, I prioritized maintainability by implementing the Page Object Model pattern, creating reusable fixtures, and establishing consistent naming conventions. The framework's tagging system enables flexible test execution strategies, from smoke tests for CI/CD pipelines to comprehensive regression suites.

The result is a framework that not only validates current functionality but provides a solid foundation with flexibility for future test expansion, with clear patterns for adding new tests and features as the applications evolve.

### Tech Stack

- **Playwright**: For end-to-end testing, providing cross-browser support (Chrome, Mobile Chrome, Firefox, WebKit), fast execution, and powerful debugging tools. Playwright's ability to handle modern web applications and its robust API make it ideal for both UI and API testing.
- **TypeScript**: Enhances code quality through static typing, improving maintainability and providing better IDE support with autocompletion and type checking.
- **SuperTest**: A high-level abstraction for HTTP testing, making API test assertions clean and readable.
- **ESLint**: Ensures code quality and consistent formatting across the project.
- **dotenv**: Manages environment variables securely across different environments, allowing for configuration of API endpoints, credentials, and other environment-specific settings without hardcoding them in the test files.

### Framework Features

- **Parallel Execution**: Tests can run in parallel for faster feedback
- **Cross-Browser Testing**: Support for Chrome, Firefox, Safari, and mobile browsers
- **Reporting**: Detailed HTML reports with screenshots and videos of test runs
- **CI/CD Integration**: Integration with continuous integration pipelines
- **Data-Driven Testing**: Support for parameterized tests with different data sets
- **Environment Configuration**: Easy configuration for different environments via .env files

### Best Practices

- **Page Object Model**: Separation of test logic from page interactions
- **Test Isolation**: Each test is independent and doesn't rely on other tests
- **Explicit Assertions**: Clear, specific assertions that document expected behavior
- **Descriptive Test Names**: Tests are self-documenting with clear naming conventions
- **Clean Code**: Maintainable, readable code following TypeScript best practices
- **Selective Tagging**: Tests are tagged for flexible test execution and reporting
- **Efficient Selectors**: Using reliable, maintainable selectors for UI elements
- **Error Handling**: Proper handling of exceptions and unexpected conditions
- **Test Data Management**: Separation of test data from test logic

## Test Cases

For detailed information about all test cases, please see the [TEST-CASES.md](./TEST-CASES.md) file.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- GoRest API token (free account required for API tests)

For API tests, set up your GoRest API token:

- Sign up for a free account at [GoRest](https://gorest.co.in/)
- [Generate an access token from your account](https://gorest.co.in/my-account/access-tokens)
- Add the API token in the `.env` file in the project root:

```bash
API_TOKEN=your_gorest_api_token_here
```

> Make sure you have these prerequisites installed before proceeding with the project setup and running.

## Installation

1. **Clone the repository:**

```bash
git clone url_here
cd dir_here
```

2. **Install dependencies:**

```bash
npm install
npx playwright install
```

## Running Tests

The test suite can be executed using any of the `npm` scripts listed below. Simply run one of the following commands in your terminal:

```bash
npm run <command>
```

### Available Test Commands

| Command         | Description                     | Example Command                     |
| --------------- | ------------------------------- | ----------------------------------- |
| `test`          | Runs all tests using Playwright | `npm test`                          |
| `test:tag`      | Runs tests with specific tags   | `npm run test:tag "@api @positive"` |
| `test:headless` | Runs all tests in headless mode | `npm run test:headless`             |
| `test:chrome`   | Runs tests in Chrome browser    | `npm run test:chrome`               |
| `test:firefox`  | Runs tests in Firefox browser   | `npm run test:firefox`              |
| `test:safari`   | Runs tests in Safari browser    | `npm run test:safari`               |
| `test:mobile`   | Runs tests in Mobile Chrome     | `npm run test:mobile`               |
| `test:chromium` | Runs all tests in Chromium      | `npm run test:chromium`             |
| `test:api`      | Runs only API tests             | `npm run test:api`                  |
| `test:ui`       | Runs only UI tests              | `npm run test:ui`                   |
| `lint`          | Lints the project files         | `npm run lint`                      |
| `debug`         | Runs tests in debug mode        | `npm run debug`                     |

### Test Tags

The following tags are used in the test suite and can be used with the `test:tag` command:

**Test Types**: `@ui` `@api` `@positive` `@negative` `@smoke` `@regression`  
**UI Features**: `@purchase` `@cart` `@payment`  
**API Operations**: `@create` `@read` `@update` `@delete` `@integration`

Examples:

```bash
# Run all negative tests
npm run test:tag "@negative"

# Run positive API integration tests
npm run test:tag "@api @positive @integration"
```

### View Test Report

Playwright generates an HTML report after each test execution. You can view the report by opening the `test-results/index.html` file in your browser or by running:

```bash
npm run test:report
```

## Possible Improvements

- **Data Factory**: Implement robust data factories using Faker.js for more relevant random test data
- **Self-Healing Selectors with AI**: Add functionality to automatically recover from UI changes
- **Enhanced Reporting**: Integrate third-party reporters (Allure, Extent) for better insights and logging
- **Issue Tracking**: Connect with bug tracking systems (Jira, X-ray) and notification services (Slack, email)
- **Performance/SEO Metrics**: Add basic performance or SEO measurement for user journeys
- **Visual Testing**: Implement screenshot comparison for visual regression testing
- **API Contract Testing**: Add schema validation for API responses using JSON Schema or OpenAPI
- **Multi-Environment Support**: Enhance configuration to easily switch between dev, staging, and production

## License

This project is licensed under the [MIT License](LICENSE).

## Contact Information

For any questions or feedback, feel free to reach out to the author: [Ricardo Toledo](https://github.com/RicardoToledo).
