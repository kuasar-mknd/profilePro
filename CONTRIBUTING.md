# Contributing to ProfilePro

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to ProfilePro. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for ProfilePro. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible.
- **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for ProfilePro, including completely new features and minor improvements to existing functionality.

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Explain why this enhancement would be useful** to most ProfilePro users.

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Include screenshots and animated GIFs in your pull request whenever possible.
- Follow the JavaScript/TypeScript style guide.
- Include corresponding tests.

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### JavaScript Styleguide

- All JavaScript must adhere to [Prettier](https://prettier.io/) Standard Style.
- Run `bun run format` to format your code.

### Documentation Styleguide

- Use [Markdown](https://daringfireball.net/projects/markdown).

## Setting Up the Development Environment

1.  Clone the repo: `git clone https://github.com/kuasar-mknd/profilePro.git`
2.  Install dependencies: `bun install`
3.  Start the development server: `bun run dev`

## Testing

Run the test suite with:

```bash
bun run check
bun run lighthouse
```
