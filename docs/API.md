# API Reference Documentation

## Table of Contents

- [Core Classes](#core-classes)
- [Model Interfaces](#model-interfaces)
- [Service APIs](#service-apis)
- [CLI Commands](#cli-commands)
- [Configuration Options](#configuration-options)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Core Classes

### ApiDocumentationGenerator

The main class for generating API documentation.

```typescript
class ApiDocumentationGenerator {
  constructor(config: GenerationConfig)
  
  // Generate documentation from configured sources
  async generate(): Promise<GenerationResult>
  
  // Validate input sources
  async validate(): Promise<ValidationResult>
  
  // Generate diff between API versions
  async diff(oldSpec: string, newSpec: string): Promise<DiffResult>
  
  // Watch for changes and regenerate
  watch(callback?: (result: GenerationResult) => void): FileWatcher
}
```

#### Constructor Parameters

- `config: GenerationConfig` - Configuration object defining sources, outputs, and processing options

#### Methods

##### `generate(): Promise<GenerationResult>`

Generates documentation from all configured input sources.

**Returns:** Promise resolving to a `GenerationResult` object containing:
- `success: boolean` - Whether generation succeeded
- `files: string[]` - Array of generated file paths
- `duration: number` - Generation time in milliseconds
- `errors: Error[]` - Array of any errors encountered
- `warnings: string[]` - Array of warning messages

**Example:**
```typescript
const generator = new ApiDocumentationGenerator(config);
const result = await generator.generate();

if (result.success) {
  console.log(`Generated ${result.files.length} files in ${result.duration}ms`);
} else {
  console.error('Generation failed:', result.errors);
}
```

##### `validate(): Promise<ValidationResult>`

Validates all input sources without generating documentation.

**Returns:** Promise resolving to a `ValidationResult` object containing:
- `isValid: boolean` - Whether all sources are valid
- `sources: SourceValidation[]` - Validation results for each source
- `errors: ValidationError[]` - Array of validation errors
- `warnings: string[]` - Array of validation warnings

**Example:**
```typescript
const validation = await generator.validate();

if (!validation.isValid) {
  validation.errors.forEach(error => {
    console.error(`Validation error in ${error.source}: ${error.message}`);
  });
}
```

### ApiSpecificationFactory

Factory class for creating API specification objects.

```typescript
class ApiSpecificationFactory {
  // Create empty specification
  static createEmpty(format: ApiSpecFormat): ApiSpecification
  
  // Create from OpenAPI document
  static fromOpenApiSpec(document: any): ApiSpecification
  
  // Create from file path
  static fromFile(path: string): Promise<ApiSpecification>
  
  // Validate specification
  static validate(spec: ApiSpecification): ValidationResult
}
```

#### Static Methods

##### `createEmpty(format: ApiSpecFormat): ApiSpecification`

Creates an empty API specification of the specified format.

**Parameters:**
- `format: ApiSpecFormat` - The specification format (OPENAPI_3_0, OPENAPI_3_1, SWAGGER_2_0)

**Returns:** Empty `ApiSpecification` object

**Example:**
```typescript
const spec = ApiSpecificationFactory.createEmpty(ApiSpecFormat.OPENAPI_3_0);
console.log(spec.format); // 'openapi-3.0'
```

##### `fromOpenApiSpec(document: any): ApiSpecification`

Creates an API specification from an OpenAPI document object.

**Parameters:**
- `document: any` - Parsed OpenAPI document object

**Returns:** `ApiSpecification` object populated with document data

**Example:**
```typescript
const openApiDoc = {
  openapi: '3.0.0',
  info: { title: 'My API', version: '1.0.0' },
  paths: { '/users': { get: { summary: 'Get users' } } }
};

const spec = ApiSpecificationFactory.fromOpenApiSpec(openApiDoc);
console.log(spec.metadata.title); // 'My API'
```

### InputSourceFactory

Factory class for creating input source configurations.

```typescript
class InputSourceFactory {
  // Create input source with configuration
  static create(config: Partial<InputSource> & Pick<InputSource, 'type' | 'path'>): InputSource
  
  // Create from file path with auto-detection
  static fromPath(path: string, options?: Partial<InputSource>): InputSource
  
  // Create OpenAPI input source
  static fromOpenApi(path: string, options?: Partial<InputSource>): InputSource
  
  // Create TypeScript input source
  static fromTypeScript(path: string, options?: Partial<InputSource>): InputSource
  
  // Create Python input source
  static fromPython(path: string, options?: Partial<InputSource>): InputSource
}
```

#### Static Methods

##### `create(config): InputSource`

Creates an input source with the specified configuration.

**Parameters:**
- `config: Partial<InputSource> & Pick<InputSource, 'type' | 'path'>` - Source configuration (type and path required)

**Returns:** Configured `InputSource` object

**Example:**
```typescript
const source = InputSourceFactory.create({
  type: InputSourceType.TYPESCRIPT,
  path: './src',
  include: ['**/*.ts'],
  exclude: ['**/*.test.ts'],
  priority: 1
});
```

##### `fromPath(path: string, options?: Partial<InputSource>): InputSource`

Creates an input source from a file path with automatic type detection.

**Parameters:**
- `path: string` - File or directory path
- `options?: Partial<InputSource>` - Optional configuration overrides

**Returns:** `InputSource` object with auto-detected type

**Example:**
```typescript
const source = InputSourceFactory.fromPath('./api/openapi.yaml');
console.log(source.type); // InputSourceType.OPENAPI
```

## Model Interfaces

### ApiSpecification

Core interface representing an API specification.

```typescript
interface ApiSpecification {
  readonly id: string;
  readonly format: ApiSpecFormat;
  readonly document: any;
  readonly metadata: ApiMetadata;
  readonly endpoints: ApiEndpoint[];
  readonly schemas: SchemaObject[];
  readonly sourceLocation: SourceLocation;
  readonly generatedAt: Date;
  readonly isValid: boolean;
  readonly validationErrors: ValidationError[];
}
```

#### Properties

- `id: string` - Unique identifier for the specification
- `format: ApiSpecFormat` - Specification format (openapi-3.0, openapi-3.1, swagger-2.0)
- `document: any` - Raw specification document
- `metadata: ApiMetadata` - Extracted metadata (title, version, description, etc.)
- `endpoints: ApiEndpoint[]` - Array of API endpoints
- `schemas: SchemaObject[]` - Array of data schemas
- `sourceLocation: SourceLocation` - Source file information
- `generatedAt: Date` - Timestamp when specification was created
- `isValid: boolean` - Whether specification is valid
- `validationErrors: ValidationError[]` - Array of validation errors

### InputSource

Interface representing an input source configuration.

```typescript
interface InputSource {
  readonly id: string;
  readonly type: InputSourceType;
  readonly path: string;
  readonly include: string[];
  readonly exclude: string[];
  readonly parserConfig: ParserConfiguration;
  readonly priority: number;
  readonly enabled: boolean;
  readonly state: InputSourceState;
  readonly metadata: InputSourceMetadata;
  readonly lastProcessed?: Date;
  readonly error?: InputSourceError;
}
```

#### Properties

- `id: string` - Unique identifier for the source
- `type: InputSourceType` - Source type (openapi, typescript, python, etc.)
- `path: string` - Source file or directory path
- `include: string[]` - Glob patterns for included files
- `exclude: string[]` - Glob patterns for excluded files
- `parserConfig: ParserConfiguration` - Parser-specific configuration
- `priority: number` - Processing priority (higher numbers processed first)
- `enabled: boolean` - Whether source is enabled for processing
- `state: InputSourceState` - Current processing state
- `metadata: InputSourceMetadata` - Additional metadata
- `lastProcessed?: Date` - Timestamp of last processing
- `error?: InputSourceError` - Last processing error if any

### GenerationConfig

Main configuration interface for the documentation generator.

```typescript
interface GenerationConfig {
  project: ProjectMetadata;
  input: InputConfiguration;
  output: OutputConfiguration;
  processing?: ProcessingOptions;
  ai?: AIConfiguration;
  cache?: CacheConfiguration;
  logging?: LoggingConfiguration;
}
```

#### Properties

- `project: ProjectMetadata` - Project information (name, version, description)
- `input: InputConfiguration` - Input sources configuration
- `output: OutputConfiguration` - Output formats and destinations
- `processing?: ProcessingOptions` - Processing options (concurrency, timeouts)
- `ai?: AIConfiguration` - AI enhancement configuration
- `cache?: CacheConfiguration` - Caching configuration
- `logging?: LoggingConfiguration` - Logging configuration

## Service APIs

### ParserService

Service for parsing source files and extracting documentation.

```typescript
interface IParserService {
  // Parse input source
  parse(source: InputSource): Promise<ParseResult>;
  
  // Validate parsed result
  validate(parseId: string): Promise<ValidationResult>;
  
  // Extract information from parsed AST
  extract(parseId: string, options?: ExtractionOptions): Promise<ExtractionResult>;
  
  // Get supported parser types
  getSupportedTypes(): InputSourceType[];
  
  // Check if type is supported
  isTypeSupported(type: InputSourceType): boolean;
}
```

#### Methods

##### `parse(source: InputSource): Promise<ParseResult>`

Parses an input source and returns the parsed result.

**Parameters:**
- `source: InputSource` - Input source to parse

**Returns:** Promise resolving to `ParseResult` containing:
- `id: string` - Unique parse ID
- `success: boolean` - Whether parsing succeeded
- `ast: any` - Abstract syntax tree
- `errors: ParseError[]` - Array of parsing errors
- `warnings: string[]` - Array of warnings
- `duration: number` - Parse time in milliseconds

**Example:**
```typescript
const parserService = new ParserService();
const source = InputSourceFactory.fromPath('./api.yaml');
const result = await parserService.parse(source);

if (result.success) {
  console.log(`Parsed successfully with ID: ${result.id}`);
} else {
  console.error('Parse errors:', result.errors);
}
```

### GenerationService

Service for generating documentation in various formats.

```typescript
interface IGenerationService {
  // Generate documentation
  generate(request: GenerationRequest): Promise<GenerationResult>;
  
  // List available templates
  getTemplates(): Promise<TemplateInfo[]>;
  
  // Preview documentation section
  preview(request: PreviewRequest): Promise<PreviewResult>;
  
  // Batch generate multiple requests
  batchGenerate(requests: GenerationRequest[]): Promise<BatchGenerationResult>;
  
  // Validate generation request
  validateRequest(request: GenerationRequest): ValidationResult;
}
```

#### Methods

##### `generate(request: GenerationRequest): Promise<GenerationResult>`

Generates documentation based on the provided request.

**Parameters:**
- `request: GenerationRequest` - Generation request configuration

**Returns:** Promise resolving to `GenerationResult`

**Example:**
```typescript
const generationService = new GenerationService();
const request = {
  projectName: 'My API',
  inputSources: [source],
  outputFormat: 'html',
  template: 'default'
};

const result = await generationService.generate(request);
```

### AIService

Service for AI-enhanced documentation generation.

```typescript
interface IAIService {
  // Enhance documentation with AI
  enhance(content: string, options?: AIEnhancementOptions): Promise<AIEnhancementResult>;
  
  // Generate documentation summaries
  summarize(content: string, options?: AISummaryOptions): Promise<AISummaryResult>;
  
  // Batch process multiple requests
  batchProcess(requests: AIRequest[]): Promise<AIBatchResult>;
  
  // Check AI service health
  healthCheck(): Promise<AIHealthResult>;
  
  // Get usage statistics
  getUsageStats(): Promise<AIUsageStats>;
}
```

## CLI Commands

### Global Options

```bash
api-doc-gen [command] [options]

Global Options:
  --config, -c      Configuration file path [default: api-doc-gen.config.js]
  --verbose, -v     Enable verbose output
  --debug, -d       Enable debug mode
  --quiet, -q       Suppress output
  --help, -h        Show help
  --version, -V     Show version
```

### `generate` Command

Generate API documentation from configured sources.

```bash
api-doc-gen generate [options]

Options:
  --config, -c <path>      Configuration file [default: api-doc-gen.config.js]
  --output, -o <path>      Output directory [default: ./docs]
  --formats, -f <formats>  Output formats (comma-separated) [default: html]
  --watch, -w              Watch for changes and regenerate
  --no-cache               Disable caching
  --no-ai                  Disable AI enhancement
  --parallel, -p <count>   Number of parallel processes [default: 4]
  --timeout <ms>           Processing timeout [default: 30000]
  --dry-run                Validate without generating

Examples:
  api-doc-gen generate
  api-doc-gen generate --formats html,pdf --output ./dist/docs
  api-doc-gen generate --watch --no-ai
  api-doc-gen generate --config ./custom-config.js --parallel 8
```

### `validate` Command

Validate input sources without generating documentation.

```bash
api-doc-gen validate [options]

Options:
  --config, -c <path>     Configuration file [default: api-doc-gen.config.js]
  --sources, -s <paths>   Specific sources to validate (comma-separated)
  --fix                   Attempt to fix validation errors
  --report, -r <path>     Generate validation report file

Examples:
  api-doc-gen validate
  api-doc-gen validate --sources ./api.yaml,./src
  api-doc-gen validate --fix --report ./validation-report.json
```

### `diff` Command

Generate differences between API versions.

```bash
api-doc-gen diff [options] <old> <new>

Arguments:
  old                     Path to old API specification
  new                     Path to new API specification

Options:
  --output, -o <path>     Output file [default: ./api-diff.md]
  --format, -f <format>   Output format [choices: "markdown", "json", "html"] [default: "markdown"]
  --breaking-only         Show only breaking changes
  --include-descriptions  Include description changes

Examples:
  api-doc-gen diff ./v1/api.yaml ./v2/api.yaml
  api-doc-gen diff --format json --output ./changes.json ./old-api.yaml ./new-api.yaml
  api-doc-gen diff --breaking-only ./v1/api.yaml ./v2/api.yaml
```

### `init` Command

Initialize a new documentation project.

```bash
api-doc-gen init [options] [name]

Arguments:
  name                    Project name [default: "api-documentation"]

Options:
  --template, -t <name>   Project template [choices: "basic", "advanced", "typescript", "python"] [default: "basic"]
  --force, -f             Overwrite existing files
  --git                   Initialize git repository
  --install               Install dependencies

Examples:
  api-doc-gen init my-api-docs
  api-doc-gen init --template advanced --git --install
  api-doc-gen init existing-project --force
```

### `serve` Command

Start a development server for live documentation preview.

```bash
api-doc-gen serve [options]

Options:
  --port, -p <number>     Server port [default: 3000]
  --host, -h <host>       Server host [default: "localhost"]
  --config, -c <path>     Configuration file [default: api-doc-gen.config.js]
  --watch, -w             Watch for changes and regenerate
  --open, -o              Open browser automatically

Examples:
  api-doc-gen serve
  api-doc-gen serve --port 8080 --host 0.0.0.0
  api-doc-gen serve --watch --open
```

## Configuration Options

### Project Configuration

```typescript
interface ProjectMetadata {
  name: string;                    // Project name
  version: string;                 // Project version
  description?: string;            // Project description
  author?: string;                 // Project author
  license?: string;                // Project license
  homepage?: string;               // Project homepage URL
  repository?: RepositoryInfo;     // Repository information
  keywords?: string[];             // Project keywords
}
```

### Input Configuration

```typescript
interface InputConfiguration {
  sources: InputSource[];          // Array of input sources
  baseDirectory?: string;          // Base directory for relative paths
  ignore?: string[];               // Global ignore patterns
  encoding?: string;               // File encoding [default: 'utf8']
  concurrency?: number;            // Number of sources to process concurrently
}
```

### Output Configuration

```typescript
interface OutputConfiguration {
  formats: OutputFormat[];         // Output formats to generate
  directory: string;               // Output directory
  templates?: TemplateConfiguration; // Custom templates
  styling?: StylingConfiguration;   // Styling options
  assets?: AssetConfiguration;      // Asset handling
  compression?: CompressionOptions; // Compression settings
}
```

### AI Configuration

```typescript
interface AIConfiguration {
  provider: 'openai' | 'anthropic' | 'local'; // AI provider
  model: string;                    // Model name (e.g., 'gpt-4')
  apiKey?: string;                  // API key
  baseUrl?: string;                 // Custom API base URL
  enabled: boolean;                 // Enable/disable AI features
  temperature?: number;             // Generation temperature [0-1]
  maxTokens?: number;               // Maximum tokens per request
  batchSize?: number;               // Batch processing size
  rateLimitPerMinute?: number;      // Rate limit
  timeout?: number;                 // Request timeout
  retries?: number;                 // Number of retries
  features?: AIFeatureConfig;       // Feature-specific configuration
}
```

### Processing Options

```typescript
interface ProcessingOptions {
  concurrent: boolean;              // Enable concurrent processing
  maxConcurrency: number;           // Maximum concurrent processes
  timeout: number;                  // Processing timeout (ms)
  retries: number;                  // Number of retries for failed operations
  chunkSize?: number;               // Files per processing chunk
  memory?: MemoryOptions;           // Memory management options
  performance?: PerformanceOptions; // Performance monitoring options
}
```

## Error Handling

### Error Types

The API Documentation Generator defines several error types for different scenarios:

```typescript
// Base error class
class ApiDocGenError extends Error {
  code: string;
  details?: any;
  cause?: Error;
}

// Configuration errors
class ConfigurationError extends ApiDocGenError {
  code: 'CONFIGURATION_ERROR';
}

// Parsing errors
class ParseError extends ApiDocGenError {
  code: 'PARSE_ERROR';
  source: string;
  line?: number;
  column?: number;
}

// Generation errors
class GenerationError extends ApiDocGenError {
  code: 'GENERATION_ERROR';
  format: OutputFormat;
}

// AI service errors
class AIServiceError extends ApiDocGenError {
  code: 'AI_SERVICE_ERROR';
  provider: string;
  rateLimited?: boolean;
}

// Validation errors
class ValidationError extends ApiDocGenError {
  code: 'VALIDATION_ERROR';
  violations: ValidationViolation[];
}
```

### Error Handling Examples

```typescript
try {
  const generator = new ApiDocumentationGenerator(config);
  const result = await generator.generate();
} catch (error) {
  if (error instanceof ConfigurationError) {
    console.error('Configuration error:', error.message);
    console.error('Details:', error.details);
  } else if (error instanceof ParseError) {
    console.error(`Parse error in ${error.source} at line ${error.line}: ${error.message}`);
  } else if (error instanceof AIServiceError && error.rateLimited) {
    console.error('AI service rate limited. Please wait and try again.');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Error Recovery

```typescript
// Graceful error handling with partial results
const generator = new ApiDocumentationGenerator({
  ...config,
  processing: {
    continueOnError: true,
    errorThreshold: 0.1  // Allow up to 10% of sources to fail
  }
});

const result = await generator.generate();

if (result.errors.length > 0) {
  console.warn(`Generation completed with ${result.errors.length} errors:`);
  result.errors.forEach(error => {
    console.warn(`- ${error.source}: ${error.message}`);
  });
}
```

## Examples

### Basic Usage

```typescript
import { ApiDocumentationGenerator, InputSourceFactory, ApiSpecFormat } from 'api-documentation-generator';

// Create configuration
const config = {
  project: {
    name: 'My API',
    version: '1.0.0',
    description: 'A sample API for demonstration'
  },
  input: {
    sources: [
      InputSourceFactory.fromPath('./api/openapi.yaml'),
      InputSourceFactory.fromTypeScript('./src', {
        include: ['**/*.ts'],
        exclude: ['**/*.test.ts']
      })
    ]
  },
  output: {
    formats: ['html', 'markdown'],
    directory: './docs'
  }
};

// Generate documentation
const generator = new ApiDocumentationGenerator(config);
const result = await generator.generate();

console.log(`Generated ${result.files.length} files successfully!`);
```

### Advanced Configuration

```typescript
import { ApiDocumentationGenerator, InputSourceType, AIProvider } from 'api-documentation-generator';

const advancedConfig = {
  project: {
    name: 'Enterprise API',
    version: '2.1.0',
    description: 'Enterprise-grade API with comprehensive documentation',
    author: 'API Team',
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'https://github.com/company/enterprise-api.git'
    }
  },
  input: {
    sources: [
      {
        type: InputSourceType.OPENAPI,
        path: './specs/*.yaml',
        priority: 1,
        parserConfig: {
          validateSpec: true,
          resolveReferences: true,
          dereferenceMode: 'bundle'
        }
      },
      {
        type: InputSourceType.TYPESCRIPT,
        path: './src/api',
        priority: 2,
        include: ['**/*.ts'],
        exclude: ['**/*.test.ts', '**/*.spec.ts'],
        parserConfig: {
          typescript: {
            includeTypeDefinitions: true,
            followImports: true,
            decorators: true
          }
        }
      }
    ]
  },
  output: {
    formats: ['html', 'pdf', 'markdown'],
    directory: './dist/docs',
    templates: {
      html: './templates/enterprise.hbs',
      pdf: './templates/enterprise-pdf.hbs'
    },
    styling: {
      theme: 'enterprise',
      primaryColor: '#1a73e8',
      secondaryColor: '#5f6368',
      fontFamily: 'Google Sans, Arial, sans-serif'
    }
  },
  ai: {
    provider: AIProvider.OPENAI,
    model: 'gpt-4',
    apiKey: process.env.OPENAI_API_KEY,
    enabled: true,
    temperature: 0.3,
    maxTokens: 2000,
    batchSize: 10,
    features: {
      enhanceDescriptions: true,
      generateExamples: true,
      improveReadability: true
    }
  },
  processing: {
    concurrent: true,
    maxConcurrency: 8,
    timeout: 60000,
    cache: {
      enabled: true,
      directory: './.api-doc-cache',
      ttl: 3600000
    }
  },
  logging: {
    level: 'info',
    file: './logs/api-doc-gen.log',
    console: true
  }
};

const generator = new ApiDocumentationGenerator(advancedConfig);
const result = await generator.generate();
```

### Custom Template Usage

```typescript
// Register custom Handlebars helpers
import { TemplateEngine } from 'api-documentation-generator';

TemplateEngine.registerHelper('formatDate', (date) => {
  return new Date(date).toLocaleDateString();
});

TemplateEngine.registerHelper('httpStatusColor', (status) => {
  if (status >= 200 && status < 300) return 'green';
  if (status >= 400 && status < 500) return 'orange';
  if (status >= 500) return 'red';
  return 'gray';
});

// Use custom template
const config = {
  // ... other configuration
  output: {
    formats: ['html'],
    directory: './docs',
    templates: {
      html: './templates/custom-api-docs.hbs'
    }
  }
};
```

### Integration with Build Pipeline

```typescript
// webpack.config.js
const ApiDocGenWebpackPlugin = require('api-documentation-generator/webpack');

module.exports = {
  // ... webpack configuration
  plugins: [
    new ApiDocGenWebpackPlugin({
      configPath: './api-doc-gen.config.js',
      outputPath: './dist/docs',
      watch: process.env.NODE_ENV === 'development'
    })
  ]
};
```

---

This API reference provides comprehensive documentation for all public interfaces, classes, and methods available in the API Documentation Generator. For more examples and use cases, see the [Examples](examples.md) documentation.