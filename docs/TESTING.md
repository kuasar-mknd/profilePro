# Testing Documentation

This repository employs a comprehensive testing strategy to ensure reliability and performance.

## Unit Testing

Unit tests are written using `bun:test` and `@happy-dom/global-registrator` for simulating a browser environment when testing client-side code.

To run the unit tests:

```bash
bun run test
```

To run tests with coverage reporting:

```bash
bun run test --coverage
```

## Quality Checks

Before committing code, ensure all static analysis and code formatting rules are met:

- Format code (Prettier):
  ```bash
  bun run format
  ```
- Lint code (ESLint & Stylelint):
  ```bash
  bun run lint
  ```
- Typecheck and Verify everything:
  ```bash
  bun run check
  ```

## End-to-End (E2E) Testing

End-to-End testing is implemented using [Playwright](https://playwright.dev/).

To run the E2E tests:

1.  Ensure you have the required browsers installed (first-time setup only):
    ```bash
    bunx playwright install --with-deps
    ```
2.  Run the tests using the script defined in `package.json`:
    ```bash
    bun run test:e2e
    ```

_Note: The Playwright configuration builds and serves the site automatically (`bun run build && bun run preview`), so no separate dev server is required._
