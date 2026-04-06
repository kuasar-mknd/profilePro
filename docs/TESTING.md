# Testing Documentation

This repository employs a comprehensive testing strategy to ensure reliability and performance.

## Unit Testing

Unit tests are written using `bun:test` and `@happy-dom/global-registrator` for simulating a browser environment when testing client-side code.

To run the unit tests:

```bash
bun test src/ tests/
```

To run tests with coverage reporting:

```bash
bun test --coverage src/ tests/
```

## End-to-End (E2E) Testing

End-to-End testing is implemented using [Playwright](https://playwright.dev/).

To run the E2E tests:

1.  Ensure you have the required browsers installed (first-time setup only):
    ```bash
    npx playwright install --with-deps
    ```
2.  Run the tests using the script defined in `package.json`:
    ```bash
    pnpm run test:e2e
    ```

*Note: The development server is generally expected to be running for local E2E testing unless the Playwright configuration handles starting it automatically.*
