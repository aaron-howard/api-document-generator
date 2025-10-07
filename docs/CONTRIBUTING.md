# Contributing to API Documentation Generator

> ⚠️ **Platform Scope**  
> Contribution environment is restricted to **Windows OS**. Tooling, scripts, and CI expectations assume PowerShell and Windows path semantics. Please do not submit PRs for Unix/macOS portability unless project scope changes.

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
- **npm**: Version 8.0.0 or higher (or yarn equivalent)
- **Git**: Latest stable version
- **VS Code**: Recommended editor with suggested extensions

### Setup Instructions

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/api-documentation-generator.git
   cd api-documentation-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up development environment**
   ```bash
   # Copy environment configuration
   cp .env.example .env
   
   # Install development tools
   npm run setup:dev
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Run tests**
   ```bash
   npm test
   ```

6. **Start development mode**
   ```bash
   npm run dev
   ```

### Development Scripts

```bash
# Development and building
npm run dev          # Start development mode with watch
npm run build        # Build production version
npm run build:dev    # Build development version
npm run clean        # Clean build artifacts

# Testing
npm test             # Run all tests
npm run test:unit    # Run unit tests only
npm run test:integration  # Run integration tests only
npm run test:e2e     # Run end-to-end tests
npm run test:coverage     # Run tests with coverage report
npm run test:watch   # Run tests in watch mode

# Code quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues automatically
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking

# Documentation
npm run docs:dev     # Start documentation development server
npm run docs:build   # Build documentation
npm run docs:api     # Generate API documentation
```

## Project Structure

```
api-documentation-generator/
├── src/                          # Source code
│   ├── cli/                      # CLI interface
│   ├── core/                     # Core domain logic
│   │   ├── models/               # Domain models
│   │   ├── services/             # Business services
│   │   └── interfaces/           # Interfaces and contracts
│   ├── parsers/                  # Input source parsers
│   ├── generators/               # Output generators
│   ├── ai/                       # AI integration
│   ├── cache/                    # Caching system
│   └── utils/                    # Utility functions
├── tests/                        # Test files
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   ├── e2e/                      # End-to-end tests
│   ├── contracts/                # Contract tests
│   ├── performance/              # Performance tests
│   └── fixtures/                 # Test fixtures
├── docs/                         # Documentation
├── templates/                    # Default templates
├── examples/                     # Usage examples
├── scripts/                      # Build and utility scripts
└── configs/                      # Configuration files
```

### Key Directories

- **`src/core/`**: Contains the main business logic and domain models
- **`src/parsers/`**: Input source parsers for different file types
- **`src/generators/`**: Output generators for different formats
- **`src/ai/`**: AI service integrations and enhancement logic
- **`tests/`**: Comprehensive test suite with different test types
- **`templates/`**: Default Handlebars templates for documentation generation

## Coding Standards

### TypeScript Guidelines

1. **Use strict TypeScript configuration**
   - Enable all strict checks in `tsconfig.json`
   - Avoid `any` types - use proper typing
   - Use interfaces for public APIs

2. **Type Definitions**
   ```typescript
   // Good: Explicit interface definitions
   interface GenerationRequest {
     projectName: string;
     inputSources: InputSource[];
     outputFormat: OutputFormat;
     options?: GenerationOptions;
   }
   
   // Bad: Using any or unclear types
   function generate(request: any): any
   ```

3. **Null Safety**
   ```typescript
   // Good: Proper null checking
   function processSource(source: InputSource | null): void {
     if (!source) {
       throw new Error('Source is required');
     }
     // Process source
   }
   
   // Use optional chaining and nullish coalescing
   const config = source?.config ?? defaultConfig;
   ```

### Code Style

1. **Use ESLint and Prettier**
   - Follow the configured ESLint rules
   - Format code with Prettier before committing
   - Use the provided VS Code settings

2. **Naming Conventions**
   ```typescript
   // Variables and functions: camelCase
   const configManager = new ConfigurationManager();
   
   // Classes: PascalCase
   class ApiSpecificationFactory { }
   
   // Constants: UPPER_SNAKE_CASE
   const DEFAULT_TIMEOUT = 30000;
   
   // Interfaces: PascalCase with 'I' prefix for implementation interfaces
   interface IParserService { }
   interface GenerationConfig { }
   
   // Enums: PascalCase
   enum InputSourceType {
     OPENAPI = 'openapi',
     TYPESCRIPT = 'typescript'
   }
   ```

3. **Function and Method Guidelines**
   ```typescript
   // Use clear, descriptive names
   function parseOpenApiSpecification(content: string): ParseResult {
     // Implementation
   }
   
   // Use async/await for asynchronous operations
   async function generateDocumentation(config: GenerationConfig): Promise<GenerationResult> {
     try {
       const sources = await loadInputSources(config.input);
       return await processGeneration(sources, config);
     } catch (error) {
       throw new GenerationError('Failed to generate documentation', error);
     }
   }
   
   // Document complex functions with JSDoc
   /**
    * Validates an API specification against OpenAPI schema
    * @param spec The API specification to validate
    * @param options Validation options
    * @returns Validation result with errors and warnings
    */
   function validateApiSpecification(
     spec: ApiSpecification,
     options: ValidationOptions = {}
   ): ValidationResult {
     // Implementation
   }
   ```

### Error Handling

1. **Use Custom Error Classes**
   ```typescript
   class ParsingError extends Error {
     constructor(
       message: string,
       public readonly source: string,
       public readonly line?: number,
       public readonly column?: number
     ) {
       super(message);
       this.name = 'ParsingError';
     }
   }
   ```

2. **Proper Error Propagation**
   ```typescript
   async function parseSource(source: InputSource): Promise<ParseResult> {
     try {
       const content = await readFile(source.path);
       return await parseContent(content, source.type);
     } catch (error) {
       throw new ParsingError(
         `Failed to parse source: ${source.path}`,
         source.path,
         error
       );
     }
   }
   ```

## Testing Guidelines

### Testing Philosophy

- **Write tests first**: Follow TDD when possible
- **Test behavior, not implementation**: Focus on what the code does, not how
- **Maintain high coverage**: Aim for >90% code coverage
- **Test edge cases**: Include error conditions and boundary cases

### Test Structure

```typescript
describe('ApiSpecificationFactory', () => {
  describe('createEmpty', () => {
    it('should create an empty OpenAPI 3.0 specification', () => {
      // Arrange
      const format = ApiSpecFormat.OPENAPI_3_0;
      
      // Act
      const result = ApiSpecificationFactory.createEmpty(format);
      
      // Assert
      expect(result.format).toBe(ApiSpecFormat.OPENAPI_3_0);
      expect(result.id).toBeDefined();
      expect(result.endpoints).toHaveLength(0);
      expect(result.isValid).toBe(true);
    });
    
    it('should throw error for unsupported format', () => {
      // Arrange
      const invalidFormat = 'invalid-format' as ApiSpecFormat;
      
      // Act & Assert
      expect(() => {
        ApiSpecificationFactory.createEmpty(invalidFormat);
      }).toThrow('Unsupported API specification format');
    });
  });
});
```

### Unit Testing

1. **Isolate units under test**
   ```typescript
   // Mock dependencies
   jest.mock('../services/FileService');
   
   describe('ConfigurationManager', () => {
     let configManager: ConfigurationManager;
     let mockFileService: jest.Mocked<FileService>;
     
     beforeEach(() => {
       mockFileService = new FileService() as jest.Mocked<FileService>;
       configManager = new ConfigurationManager(mockFileService);
     });
   });
   ```

2. **Test async operations**
   ```typescript
   it('should load configuration from file', async () => {
     // Arrange
     const mockConfig = { project: { name: 'Test' } };
     mockFileService.readFile.mockResolvedValue(JSON.stringify(mockConfig));
     
     // Act
     const result = await configManager.loadConfig('./config.json');
     
     // Assert
     expect(result.project.name).toBe('Test');
     expect(mockFileService.readFile).toHaveBeenCalledWith('./config.json');
   });
   ```

### Integration Testing

```typescript
describe('End-to-End Generation Flow', () => {
  it('should generate HTML documentation from OpenAPI spec', async () => {
    // Arrange
    const tempDir = await createTempDirectory();
    const configPath = path.join(tempDir, 'config.js');
    const specPath = path.join(tempDir, 'api.yaml');
    
    await writeFile(specPath, validOpenApiSpec);
    await writeFile(configPath, generateTestConfig({ 
      input: { sources: [{ type: 'openapi', path: specPath }] },
      output: { formats: ['html'], directory: tempDir }
    }));
    
    // Act
    const generator = new ApiDocumentationGenerator(configPath);
    const result = await generator.generate();
    
    // Assert
    expect(result.success).toBe(true);
    expect(result.files).toContain(path.join(tempDir, 'index.html'));
    
    const htmlContent = await readFile(path.join(tempDir, 'index.html'), 'utf8');
    expect(htmlContent).toContain('<title>Test API</title>');
    
    // Cleanup
    await removeDirectory(tempDir);
  });
});
```

### Performance Testing

```typescript
describe('Performance Tests', () => {
  it('should handle large API specifications efficiently', async () => {
    // Arrange
    const largeSpec = generateLargeApiSpec(1000); // 1000 endpoints
    const startTime = performance.now();
    
    // Act
    const result = await parser.parse(largeSpec);
    const endTime = performance.now();
    
    // Assert
    expect(result.success).toBe(true);
    expect(endTime - startTime).toBeLessThan(5000); // Under 5 seconds
    expect(process.memoryUsage().heapUsed).toBeLessThan(500 * 1024 * 1024); // Under 500MB
  });
});
```

## Submitting Changes

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/add-new-parser
   ```

2. **Make your changes**
   - Follow coding standards
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add support for GraphQL schema parsing"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/add-new-parser
   ```

6. **Create a pull request**
   - Use the provided PR template
   - Include a clear description
   - Link related issues
   - Add screenshots for UI changes

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(parser): add GraphQL schema parser
fix(cli): resolve configuration loading issue
docs(api): update generation service documentation
test(integration): add end-to-end workflow tests
```

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project coding standards
- [ ] Self-review of code completed
- [ ] Documentation updated (if applicable)
- [ ] No console logs or debug code left
- [ ] Breaking changes documented

## Related Issues
Closes #[issue number]

## Screenshots (if applicable)
Include screenshots for UI changes.
```

### Code Review Guidelines

**For Authors:**
- Keep PRs focused and reasonably sized
- Write clear commit messages and PR descriptions
- Respond to feedback promptly and constructively
- Update tests and documentation as needed

**For Reviewers:**
- Review for functionality, design, and maintainability
- Be constructive and specific in feedback
- Test changes locally when possible
- Approve only when confident in the changes

## Documentation

### Documentation Standards

1. **Code Documentation**
   ```typescript
   /**
    * Generates API documentation from configured sources
    * 
    * @param config - Generation configuration
    * @param options - Optional generation options
    * @returns Promise resolving to generation result
    * @throws {ConfigurationError} When configuration is invalid
    * @throws {GenerationError} When generation fails
    * 
    * @example
    * ```typescript
    * const config = {
    *   project: { name: 'My API', version: '1.0.0' },
    *   input: { sources: [{ type: 'openapi', path: './api.yaml' }] },
    *   output: { formats: ['html'], directory: './docs' }
    * };
    * 
    * const result = await generateDocumentation(config);
    * console.log(`Generated ${result.files.length} files`);
    * ```
    */
   async function generateDocumentation(
     config: GenerationConfig,
     options?: GenerationOptions
   ): Promise<GenerationResult>
   ```

2. **README Updates**
   - Update README.md for significant changes
   - Include examples for new features
   - Update installation and usage instructions

3. **API Documentation**
   - Update API.md for new public interfaces
   - Include TypeScript type definitions
   - Provide usage examples

### Writing Guidelines

- Use clear, concise language
- Include code examples
- Explain the "why" not just the "what"
- Keep examples up-to-date
- Use proper markdown formatting

## Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and community discussions
- **Discord**: Real-time chat and collaboration
- **Email**: [contributors@api-doc-gen.com](mailto:contributors@api-doc-gen.com)

### Getting Help

- Check existing documentation first
- Search closed issues and discussions
- Ask specific questions with context
- Provide minimal reproducible examples

### Recognition

Contributors are recognized in:
- `CONTRIBUTORS.md` file
- Release notes for significant contributions
- Annual contributor acknowledgments

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to the API Documentation Generator! Your efforts help make this tool better for everyone. 🚀