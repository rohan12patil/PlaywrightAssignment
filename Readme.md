# Intellisense Playwright Test Suite

This project contains automated tests for the Intellisense dashboard using Playwright. The tests include end-to-end scenarios, API mocking, and reusable utilities for efficient test management.

## Project Structure

```
intellisense/
├── playwright.config.ts       # Playwright configuration file
├── tests/                     # Test files and related data
│   ├── testDashboard.spec.ts  # - Tests for dashboard functionality
│   ├── testMockApi.spec.ts    # - Tests with mocked API responses
│   ├── data/                  # Test data files
│   │   └── data.json          #  - Login credentials and other test data
│   ├── mocks/                 # Mock API responses
│   │   └── responsemock.json  # - Mocked API response data
│   └── utils/                 # Utility functions and locators
│       ├── auth.ts            # - Reusable login function
│       └── locators.ts        # - Centralized locators for tests
├── playwright-report/         # Playwright test reports
├── test-results/              # Test result artifacts
└── Readme.md                  # Project documentation
```


## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd intellisense
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run Tests in Debug Mode
```bash
npx playwright test --debug
```

### Run a Specific Test File
```bash
npx playwright test tests/testDashboard.spec.ts
```

### Run Tests in Interactive UI Mode
```bash
npx playwright test --ui
```

### Run Tests on a Specific Browser
```bash
npx playwright test --project=chromium
```

## Mocking API Responses

The `testMockApi.spec.ts` file demonstrates how to mock API responses using Playwright's `route` method. Mocked responses are stored in the `tests/mocks/responsemock.json` file.

## Utilities

- **Authentication**: The `auth.ts` file contains a reusable `ensureLoggedIn` function to handle login logic.
- **Locators**: The `locators.ts` file centralizes all element selectors for easy maintenance.

## Reports

After running tests, a detailed HTML report is generated in the `playwright-report/` directory. Open the `index.html` file in a browser to view the report.

