# Contributing to API Documentation Generator

Thank you for your interest in contributing to the API Documentation Generator! This guide will help you get started with contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Submitting Changes](#submitting-changes)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@api-doc-gen.com](mailto:conduct@api-doc-gen.com).

## Getting Started

### Ways to Contribute

There are many ways to contribute to this project:

- 🐛 **Bug Reports**: Report bugs and issues
- 💡 **Feature Requests**: Suggest new features or improvements
- 📝 **Documentation**: Improve documentation and examples
- 🧪 **Testing**: Write tests and improve test coverage
- 🔧 **Code**: Fix bugs and implement new features
- 🎨 **Design**: Improve UI/UX for generated documentation
- 📦 **Templates**: Create new documentation templates
- 🔌 **Plugins**: Develop plugins and extensions

### Before You Start

1. **Check existing issues**: Look through existing issues and pull requests to avoid duplicates
2. **Create an issue**: For significant changes, create an issue first to discuss the approach
3. **Fork the repository**: Create your own fork to work on changes
4. **Read the docs**: Familiarize yourself with the project architecture and patterns

## Development Setup

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Git**: Latest version
- **TypeScript**: Will be installed as a dependency
- **Optional**: Python 3.9+ for Python source parsing
- **Optional**: Go 1.19+ for Go source parsing

### Installation

1. **Fork and Clone**
   ```bash
   # Fork the repository on GitHub, then clone your fork
   git clone https://github.com/your-username/api-documentation-generator.git
   cd api-documentation-generator
   
   # Add upstream remote
   git remote add upstream https://github.com/your-org/api-documentation-generator.git
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

5. **Set Up Environment**
   ```bash
   # Copy environment file
   cp .env.example .env
   
   # Edit .env with your configuration
   # Add your OpenAI API key for AI features
   OPENAI_API_KEY=your-api-key-here
   ```

### Development Scripts

```bash
# Build the project
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run type checking
npm run type-check

# Run all checks
npm run check

# Start development server
npm run dev

# Generate documentation
npm run docs
```

## Project Structure

```
api-documentation-generator/
├── src/                          # Source code
│   ├── ai/                       # AI service implementation
│   ├── cache/                    # Caching system
│   ├── cli/                      # Command-line interface
│   ├── config/                   # Configuration management
│   ├── core/                     # Core data models and types
│   ├── demos/                    # Demonstration scripts
│   ├── error/                    # Error handling
│   ├── gateway/                  # API Gateway
│   ├── generators/               # Documentation generators
│   ├── integrations/             # Third-party integrations
│   ├── parsers/                  # Source code parsers
│   │   ├── languages/            # Language-specific parsers
│   │   │   ├── express-parser.ts # Express.js parser (NEW!)
│   │   │   ├── jsdoc-parser.ts   # JSDoc parser
│   │   │   └── ...
│   │   └── parser-service.ts     # Parser service
│   ├── performance/              # Performance monitoring
│   ├── server.ts                 # Main server file
│   └── utils/                    # Utility functions
├── tests/                        # Test files
│   ├── contracts/                # Contract tests
│   ├── integration/              # Integration tests
│   ├── performance/              # Performance tests
│   ├── unit/                     # Unit tests
│   └── validation/               # Validation tests
├── docs/                         # Documentation
├── dist/                         # Built files
├── examples/                     # Example projects
└── templates/                    # Documentation templates
```

## Coding Standards

### TypeScript Guidelines

1. **Use TypeScript**: All new code must be written in TypeScript
2. **Strict Mode**: Follow strict TypeScript configuration
3. **Type Safety**: Avoid `any` types; use proper type definitions
4. **Interfaces**: Use interfaces for object shapes
5. **Enums**: Use enums for constants
6. **Generics**: Use generics for reusable components

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // Implementation
}

// Bad
function getUser(id: any): any {
  // Implementation
}
```

### Code Style

1. **ESLint**: Follow the project's ESLint configuration
2. **Prettier**: Use Prettier for code formatting
3. **Naming**: Use descriptive names for variables and functions
4. **Comments**: Add JSDoc comments for public APIs
5. **Error Handling**: Always handle errors appropriately

```typescript
/**
 * Parses Express.js route definitions from source code
 * @param source - The source code to parse
 * @param options - Parsing options
 * @returns Promise resolving to parsed routes
 */
async function parseExpressRoutes(
  source: string,
  options: ParseOptions = {}
): Promise<ExpressRoute[]> {
  try {
    // Implementation
  } catch (error) {
    throw new ParseError(`Failed to parse Express routes: ${error.message}`);
  }
}
```

### File Organization

1. **One class per file**: Keep classes in separate files
2. **Barrel exports**: Use index.ts files for clean imports
3. **Consistent naming**: Use kebab-case for files, PascalCase for classes
4. **Logical grouping**: Group related functionality together

## Testing Guidelines

### Test Structure

```typescript
// tests/unit/express-parser.test.ts
import { ExpressParser } from '../../src/parsers/languages/express-parser';

describe('ExpressParser', () => {
  let parser: ExpressParser;

  beforeEach(() => {
    parser = new ExpressParser();
  });

  describe('parse', () => {
    it('should parse Express routes correctly', async () => {
      // Arrange
      const source = `
        app.get('/api/users', (req, res) => {
          res.json({ users: [] });
        });
      `;

      // Act
      const result = await parser.parse({
        type: 'express',
        source: 'content',
        path: source
      });

      // Assert
      expect(result.status).toBe('success');
      expect(result.ast.endpoints).toHaveLength(1);
      expect(result.ast.endpoints[0].path).toBe('/api/users');
    });
  });
});
```

### Test Categories

1. **Unit Tests**: Test individual functions and classes
2. **Integration Tests**: Test component interactions
3. **Contract Tests**: Test API contracts and interfaces
4. **Performance Tests**: Test performance and scalability
5. **End-to-End Tests**: Test complete workflows

### Test Requirements

- **Coverage**: Maintain at least 80% test coverage
- **Descriptive**: Write clear, descriptive test names
- **Isolated**: Tests should not depend on each other
- **Fast**: Keep unit tests fast (< 100ms each)
- **Reliable**: Tests should be deterministic

## Submitting Changes

### Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Changes**
   - Write your code following the coding standards
   - Add tests for new functionality
   - Update documentation if needed
   - Ensure all tests pass

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add Express.js parser support"
   ```

4. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill out the PR template
   - Request review from maintainers

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build process or auxiliary tool changes

**Examples:**
```
feat(parser): add Express.js route parsing support
fix(cli): resolve path resolution issue on Windows
docs(readme): update installation instructions
test(express-parser): add comprehensive test coverage
```

### Pull Request Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows the project's coding standards
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes (or breaking changes documented)
```

## Documentation

### Documentation Standards

1. **README Updates**: Update README.md for user-facing changes
2. **API Documentation**: Add JSDoc comments for new APIs
3. **Code Comments**: Add inline comments for complex logic
4. **Examples**: Provide usage examples for new features

### Documentation Types

- **User Documentation**: README.md, DEPLOYMENT.md
- **Developer Documentation**: CONTRIBUTING.md, ARCHITECTURE.md
- **API Documentation**: JSDoc comments, API.md
- **Code Documentation**: Inline comments, type definitions

## Community

### Getting Help

- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Ask questions and discuss ideas
- **Discord**: Join our community Discord server
- **Email**: Contact maintainers at [maintainers@api-doc-gen.com](mailto:maintainers@api-doc-gen.com)

### Recognition

Contributors are recognized in:
- **README.md**: Listed as contributors
- **CHANGELOG.md**: Mentioned in release notes
- **GitHub**: Added to contributors list
- **Documentation**: Credited in relevant sections

### Maintainer Guidelines

If you become a maintainer:

1. **Review Process**: Review PRs within 48 hours
2. **Code Quality**: Ensure high code quality standards
3. **Community**: Help community members and new contributors
4. **Releases**: Help with release planning and execution
5. **Documentation**: Keep documentation up to date

## Development Workflow

### Feature Development

1. **Create Issue**: Document the feature request
2. **Design Discussion**: Discuss approach with maintainers
3. **Implementation**: Implement the feature
4. **Testing**: Add comprehensive tests
5. **Documentation**: Update relevant documentation
6. **Review**: Submit PR for review
7. **Merge**: Merge after approval

### Bug Fixes

1. **Reproduce**: Create a minimal reproduction case
2. **Fix**: Implement the fix
3. **Test**: Add regression tests
4. **Document**: Update changelog
5. **Review**: Submit PR for review
6. **Merge**: Merge after approval

### Release Process

1. **Version Bump**: Update version in package.json
2. **Changelog**: Update CHANGELOG.md
3. **Testing**: Run full test suite
4. **Build**: Create production build
5. **Tag**: Create git tag
6. **Publish**: Publish to npm
7. **Announce**: Announce release

## Code Review Guidelines

### For Contributors

- **Self-Review**: Review your own code before submitting
- **Test Coverage**: Ensure adequate test coverage
- **Documentation**: Update documentation as needed
- **Breaking Changes**: Document any breaking changes

### For Reviewers

- **Timely Reviews**: Review PRs within 48 hours
- **Constructive Feedback**: Provide helpful, constructive feedback
- **Code Quality**: Focus on code quality and maintainability
- **Testing**: Verify tests are adequate and passing

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## Thank You

Thank you for contributing to the API Documentation Generator! Your contributions help make this project better for everyone.

---

**Questions?** Feel free to reach out to us at [contributors@api-doc-gen.com](mailto:contributors@api-doc-gen.com) or join our [Discord community](https://discord.gg/api-doc-gen).