# Contributing to API Documentation Generator

Thank you for your interest in contributing to the API Documentation Generator! This document provides guidelines and instructions for developers who want to contribute to the project.

## Development Setup

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- TypeScript 4.5.0 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aaron-howard/api-documentation-generator.git
   cd api-documentation-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Project Structure

```
api-document-generator/
├── src/
│   ├── cli/           # CLI interface and commands
│   ├── parsers/       # Language-specific parsers
│   ├── generators/    # Output format generators
│   ├── core/          # Core models and interfaces
│   └── utils/         # Utility functions
├── tests/             # Test files
├── docs/              # Documentation
└── dist/              # Compiled output
```

## Code Conventions

### TypeScript Guidelines

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Code Style

- Use 2 spaces for indentation
- Use semicolons at the end of statements
- Use single quotes for strings
- Use trailing commas in objects and arrays

### File Naming

- Use kebab-case for file names
- Use PascalCase for class names
- Use camelCase for function and variable names

## Testing Guidelines

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write unit tests for all public methods
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies

## CI/CD Configuration

### GitHub Actions

The project uses GitHub Actions for continuous integration:

- **Build**: Compiles TypeScript and runs linting
- **Test**: Runs all tests and generates coverage reports
- **Release**: Automatically publishes releases when tags are pushed

### Pre-commit Hooks

- ESLint for code quality
- Prettier for code formatting
- TypeScript compilation check

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run the test suite: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to your branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Reporting Issues

When reporting issues, please include:

- Description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, Node.js version, etc.)

## Getting Help

- Check the documentation in the `docs/` directory
- Look at existing issues and pull requests
- Join our community discussions
- Contact the maintainers

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.
