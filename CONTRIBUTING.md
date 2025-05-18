# Contributing to SMASHSEND Node.js SDK

Thank you for considering contributing to the SMASHSEND Node.js SDK! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project. We expect all contributors to help maintain a positive and inclusive environment.

## How to Contribute

### Reporting Bugs

Before submitting a bug report:

1. Check the [GitHub issues](https://github.com/smashsend/smashsend-node/issues) to see if the bug has already been reported
2. Update your copy of the SDK to the latest version to check if the bug has been fixed

When submitting a bug report, please include:

- A clear and descriptive title
- The exact steps to reproduce the bug
- What you expected to happen
- What actually happened
- Code examples, error messages, and stack traces if applicable
- SDK version, Node.js version, and OS information

### Suggesting Features

Feature suggestions are welcome! When suggesting a feature:

1. Check if the feature has already been suggested or implemented
2. Provide a clear description of the feature and why it would be beneficial
3. Include examples of how the feature would be used

### Pull Requests

1. Fork the repository
2. Create a new branch from `main` for your changes
3. Make your changes following the coding standards
4. Add or update tests as necessary
5. Ensure all tests pass
6. Update documentation as needed
7. Submit a pull request

## Development Setup

1. Clone your fork of the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Run tests:
   ```bash
   npm test
   ```

## Coding Standards

- Follow the existing code style
- Use TypeScript for type safety
- Write comprehensive tests for new features
- Add JSDoc comments for all public methods and classes
- Keep dependencies to a minimum

## Testing

- All new features should include unit tests
- Ensure all existing tests pass before submitting a pull request
- Run tests with:
  ```bash
  npm test
  ```

## Documentation

- Update the README and API documentation for any user-facing changes
- Include JSDoc comments for new methods and classes
- Add examples for new functionality

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for test changes
- `chore:` for maintenance tasks

## Release Process

The package is released using [semantic-release](https://github.com/semantic-release/semantic-release), which automatically determines version numbers and generates release notes based on commit messages.

## Questions?

If you have any questions about contributing, please open an issue with your question.

Thank you for contributing to the SMASHSEND Node.js SDK!
