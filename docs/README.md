# API Documentation Generator

> ⚠️ **Platform Notice (Windows-Only)**  
> This project is officially supported **only on Microsoft Windows environments**. Commands, paths, shell examples, and deployment guidance assume a Windows OS (PowerShell). Unix/Linux/macOS environments are **not supported** and may encounter incompatibilities.
> 
> If you attempt to run on a non-Windows system, behavior is undefined and issues will be closed unless they reproduce on Windows.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-org/api-documentation-generator)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/your-org/api-documentation-generator/releases)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

A powerful, multi-runtime CLI tool for generating comprehensive API documentation from various sources including OpenAPI specifications, source code annotations, and more. Built with TypeScript and powered by AI for enhanced documentation quality.

## 🚀 Features

- **Multi-Source Support**: Extract documentation from OpenAPI specs, TypeScript/JavaScript JSDoc, Python docstrings, and more
- **Full Application Documentation**: Generate comprehensive documentation for entire applications, not just APIs
- **Multiple Documentation Types**: Support for 9 different documentation types including developer guides, changelogs, architecture docs, and more
- **AI-Enhanced Documentation**: Leverage GPT-4 to improve and expand documentation quality
- **Multiple Output Formats**: Generate HTML, Markdown, PDF, JSON, and UML documentation
- **Multi-Runtime**: Works with Node.js 18+, Python 3.9+, and Go 1.19+
- **Template Customization**: Fully customizable templates using Handlebars
- **Performance Optimized**: Handles large codebases with concurrent processing
- **Caching System**: Intelligent caching for faster regeneration
- **CI/CD Integration**: Easy integration with continuous integration pipelines

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Documentation Types](#documentation-types)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
- [Templates](#templates)
- [Performance](#performance)
- [Contributing](#contributing)
- [License](#license)

## 🛠 Installation

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- Optional: Python 3.9+ for Python source parsing
- Optional: Go 1.19+ for Go source parsing

### Install (npm Package Not Yet Published)

> ⚠️ This package name (`api-documentation-generator`) is **not currently published to the public npm registry**. The command below will fail until an initial release is published. Use the "Install from source" instructions instead.

Planned future command (not active yet):
```powershell
npm install -g api-documentation-generator   # Not available yet
```

### Install from source (Windows)

```powershell
# Clone the repository
git clone https://github.com/your-org/api-documentation-generator.git
cd api-documentation-generator

# Install dependencies
npm install

# Build TypeScript sources
npm run build

# (Optional) Link globally for convenience
npm link   # This will provide the `api-doc-gen` command on your PATH

# OR run directly without linking
node dist/cli/index.js --help
```

### Run without global install
```powershell
node dist/cli/index.js generate --config api-doc-gen.config.js
```

### (Optional) Internal publish workflow (for maintainers)
If/when you decide to publish:
```powershell
# Bump the version in package.json first
npm login
npm publish --access public
```
After publishing you can revert to the standard global install step.

<!-- Original 'Install from source' section replaced by enhanced Windows-specific instructions above -->

### Verify installation

```bash
api-doc-gen --version
api-doc-gen --help
```

## 🚀 Quick Start

### 1. Initialize a new project

```bash
api-doc-gen init my-api-docs
cd my-api-docs
```

### 2. Configure your sources

Create `api-doc-gen.config.js`:

```javascript
module.exports = {
  project: {
    name: 'My API',
    version: '1.0.0',
    description: 'Comprehensive API documentation'
  },
  input: {
    sources: [
      {
        type: 'openapi',
        path: './specs/api.yaml'
      },
      {
        type: 'typescript',
        path: './src',
        include: ['**/*.ts'],
        exclude: ['**/*.test.ts']
      }
    ]
  },
  output: {
    formats: ['html', 'markdown'],
    directory: './docs'
  }
};
```

### 3. Generate documentation

```bash
api-doc-gen generate
```

## 📚 Documentation Types

The API Documentation Generator now supports comprehensive application documentation beyond just APIs. Use the `--doc-type` flag to specify the type of documentation you want to generate:

### Supported Documentation Types

| Type | Description | Common Sources | Auto-detected Files |
|------|-------------|----------------|-------------------|
| `api` | API documentation (default) | OpenAPI specs, JSDoc, Python docstrings | `*.yaml`, `*.json`, `*.ts`, `*.py` |
| `developer-guide` | Developer setup and guidelines | CONTRIBUTING.md, DEVELOPMENT.md | `CONTRIBUTING.md`, `DEVELOPMENT.md`, `docs/development/` |
| `changelog` | Version history and release notes | CHANGELOG.md, HISTORY.md | `CHANGELOG.md`, `HISTORY.md`, `docs/releases/` |
| `product-overview` | Product description and features | README.md, vision docs | `README.md`, `docs/overview/` |
| `architecture` | System design and architecture | ARCHITECTURE.md, design docs | `ARCHITECTURE.md`, `docs/architecture/` |
| `user-guide` | End-user documentation | USER_GUIDE.md, tutorials | `USER_GUIDE.md`, `docs/user-guide/`, `FAQ.md` |
| `security` | Security policies and procedures | SECURITY.md, compliance docs | `SECURITY.md`, `docs/security/` |
| `onboarding` | New team member guides | Training materials, tutorials | `docs/onboarding/`, `ONBOARDING.md` |
| `monitoring` | Operations and monitoring docs | Runbooks, monitoring guides | `docs/monitoring/`, `docs/operations/` |

## 🎨 UML Diagram Generation

The generator can create UML diagrams in Mermaid format for various documentation types:

### Supported Diagram Types

- **Architecture Diagrams**: System architecture and component relationships
- **Sequence Diagrams**: API request flows and user interactions  
- **Flowcharts**: Process flows and decision trees
- **Class Diagrams**: Code structure and relationships (for API documentation)

### UML Output Examples

```bash
# Generate architecture diagram
api-doc-gen generate --doc-type architecture --format uml ARCHITECTURE.md

# Generate API sequence diagram
api-doc-gen generate --doc-type api --format uml openapi.yaml

# Generate developer workflow diagram
api-doc-gen generate --doc-type developer-guide --format uml CONTRIBUTING.md
```

### UML Diagram Types by Documentation Type

| Documentation Type | Default Diagram Type | Description |
|-------------------|---------------------|-------------|
| `architecture` | Architecture Diagram | System components and relationships |
| `api` | Sequence Diagram | API request/response flows |
| `developer-guide` | Flowchart | Development workflow and processes |
| `user-guide` | Flowchart | User journey and feature usage |
| `security` | Sequence Diagram | Authentication and security flows |
| `monitoring` | Sequence Diagram | Monitoring and alerting flows |

### Usage Examples

```bash
# Generate developer guide from CONTRIBUTING.md
api-doc-gen generate --doc-type developer-guide CONTRIBUTING.md

# Generate changelog documentation
api-doc-gen generate --doc-type changelog CHANGELOG.md

# Generate product overview from README.md
api-doc-gen generate --doc-type product-overview README.md

# Auto-detect and generate from common file locations
api-doc-gen generate --doc-type developer-guide
api-doc-gen generate --doc-type changelog

# Generate multiple formats
api-doc-gen generate --doc-type architecture --format html,markdown ARCHITECTURE.md
```

### Auto-Detection

When you specify a `--doc-type` without providing input files, the tool will automatically search for common file locations:

- **Developer Guide**: `./CONTRIBUTING.md`, `./DEVELOPMENT.md`, `./docs/development/`
- **Changelog**: `./CHANGELOG.md`, `./HISTORY.md`, `./docs/releases/`
- **Product Overview**: `./README.md`, `./docs/overview/`
- **Architecture**: `./ARCHITECTURE.md`, `./docs/architecture/`
- **User Guide**: `./USER_GUIDE.md`, `./docs/user-guide/`, `./FAQ.md`
- **Security**: `./SECURITY.md`, `./docs/security/`
- **Onboarding**: `./docs/onboarding/`, `./ONBOARDING.md`
- **Monitoring**: `./docs/monitoring/`, `./docs/operations/`

## ⚙️ Configuration

### Basic Configuration

The tool uses a configuration file (`api-doc-gen.config.js`) to define input sources, output formats, and processing options.

```javascript
module.exports = {
  // Project metadata
  project: {
    name: 'API Name',
    version: '1.0.0',
    description: 'API Description',
    author: 'Your Name',
    license: 'MIT'
  },

  // Input sources configuration
  input: {
    sources: [
      {
        type: 'openapi',           // Source type
        path: './specs/*.yaml',    // Source path (supports globs)
        priority: 1,               // Processing priority
        enabled: true,             // Enable/disable source
        parserConfig: {            // Parser-specific configuration
          validateSpec: true,
          resolveReferences: true
        }
      }
    ]
  },

  // Output configuration
  output: {
    formats: ['html', 'markdown', 'pdf'],
    directory: './docs',
    templates: {
      html: './templates/custom.hbs'
    },
    styling: {
      theme: 'default',
      primaryColor: '#007bff'
    }
  },

  // AI enhancement configuration
  ai: {
    provider: 'openai',
    model: 'gpt-4',
    apiKey: process.env.OPENAI_API_KEY,
    enabled: true,
    temperature: 0.3,
    maxTokens: 2000
  },

  // Processing options
  processing: {
    concurrent: true,
    maxConcurrency: 4,
    timeout: 30000,
    cache: {
      enabled: true,
      directory: './.cache'
    }
  }
};
```

### Environment Variables

```bash
# AI Configuration
OPENAI_API_KEY=your-openai-api-key
API_DOC_AI_PROVIDER=openai
API_DOC_AI_MODEL=gpt-4

# Processing Configuration
API_DOC_LOG_LEVEL=info
API_DOC_CACHE_ENABLED=true
API_DOC_CONCURRENT=true

# Output Configuration
API_DOC_OUTPUT_DIR=./docs
API_DOC_THEME=default
```

## 💡 Usage Examples

### Command Line Interface

```bash
# Generate documentation with default configuration
api-doc-gen generate

# Generate with specific configuration file
api-doc-gen generate --config ./custom-config.js

# Generate specific formats only
api-doc-gen generate --formats html,pdf

# Validate input sources without generating
api-doc-gen validate

# Generate diff between API versions
api-doc-gen diff --old ./v1/api.yaml --new ./v2/api.yaml

# Watch mode for development
api-doc-gen watch --config ./dev-config.js

# Debug mode with verbose output
api-doc-gen generate --debug --verbose
```

### Programmatic API

```typescript
import { ApiDocumentationGenerator } from 'api-documentation-generator';

const generator = new ApiDocumentationGenerator({
  project: {
    name: 'My API',
    version: '1.0.0'
  },
  input: {
    sources: [
      {
        type: 'openapi',
        path: './api.yaml'
      }
    ]
  },
  output: {
    formats: ['html'],
    directory: './docs'
  }
});

// Generate documentation
const results = await generator.generate();
console.log('Generated:', results.files);

// Validate sources
const validation = await generator.validate();
console.log('Validation:', validation.isValid);
```

### Integration with Build Tools

#### Webpack Plugin

```javascript
const ApiDocPlugin = require('api-documentation-generator/webpack');

module.exports = {
  plugins: [
    new ApiDocPlugin({
      configPath: './api-doc-gen.config.js',
      outputPath: './dist/docs'
    })
  ]
};
```

#### Gulp Task

```javascript
const gulp = require('gulp');
const apiDocGen = require('api-documentation-generator/gulp');

gulp.task('docs', () => {
  return gulp.src('./specs/*.yaml')
    .pipe(apiDocGen({
      output: {
        formats: ['html'],
        directory: './docs'
      }
    }))
    .pipe(gulp.dest('./dist'));
});
```

## 📖 Supported Input Sources

### OpenAPI/Swagger Specifications

```yaml
# Supports OpenAPI 3.0, 3.1, and Swagger 2.0
openapi: '3.0.0'
info:
  title: Sample API
  version: '1.0.0'
paths:
  /users:
    get:
      summary: List users
      responses:
        '200':
          description: Success
```

### TypeScript/JavaScript JSDoc

```typescript
/**
 * User management controller
 * @route /api/users
 */
export class UserController {
  /**
   * Get all users
   * @route GET /users
   * @param {string} filter - Optional filter
   * @returns {Promise<User[]>} List of users
   */
  async getUsers(filter?: string): Promise<User[]> {
    // Implementation
  }
}
```

### Python Docstrings

```python
class UserController:
    """
    User management controller for the API.
    
    This controller handles all user-related operations including
    creation, retrieval, updating, and deletion of user records.
    """
    
    def get_users(self, filter: Optional[str] = None) -> List[User]:
        """
        Retrieve all users from the system.
        
        Args:
            filter: Optional filter string to limit results
            
        Returns:
            List of User objects matching the criteria
            
        Raises:
            UserNotFoundError: When no users match the filter
        """
        pass
```

## 🎨 Templates and Themes

### Custom Templates

Create custom Handlebars templates for different output formats:

```handlebars
<!-- templates/custom-html.hbs -->
<!DOCTYPE html>
<html>
<head>
    <title>{{project.name}} - API Documentation</title>
    <style>
        /* Custom styles */
    </style>
</head>
<body>
    <header>
        <h1>{{project.name}}</h1>
        <p>Version: {{project.version}}</p>
    </header>
    
    <main>
        {{#each endpoints}}
        <section class="endpoint">
            <h2>{{method}} {{path}}</h2>
            <p>{{description}}</p>
            
            {{#if parameters}}
            <h3>Parameters</h3>
            <ul>
                {{#each parameters}}
                <li><strong>{{name}}</strong> ({{type}}) - {{description}}</li>
                {{/each}}
            </ul>
            {{/if}}
        </section>
        {{/each}}
    </main>
</body>
</html>
```

### Theme Configuration

```javascript
module.exports = {
  output: {
    styling: {
      theme: 'custom',
      primaryColor: '#1a73e8',
      secondaryColor: '#5f6368',
      fontFamily: 'Google Sans, Arial, sans-serif',
      fontSize: '14px',
      borderRadius: '8px',
      shadows: true,
      darkMode: {
        enabled: true,
        toggle: true
      }
    }
  }
};
```

## 🚀 Performance and Optimization

### Large Codebase Handling

The tool is optimized for large codebases with several performance features:

- **Concurrent Processing**: Process multiple files simultaneously
- **Intelligent Caching**: Cache parsed results to avoid reprocessing
- **Memory Management**: Efficient memory usage for large projects
- **Incremental Updates**: Only regenerate changed content

### Performance Configuration

```javascript
module.exports = {
  processing: {
    concurrent: true,
    maxConcurrency: 8,          // Number of parallel processes
    timeout: 60000,             // Process timeout in ms
    chunkSize: 100,             // Files per processing chunk
    
    cache: {
      enabled: true,
      directory: './.api-doc-cache',
      ttl: 3600000,             // Cache TTL in ms
      maxSize: '500MB'          // Maximum cache size
    },
    
    memory: {
      maxHeapSize: '2GB',       // Maximum heap size
      gcInterval: 1000          // Garbage collection interval
    }
  }
};
```

### Monitoring and Metrics

```bash
# Enable performance monitoring
api-doc-gen generate --monitor --metrics

# Output performance report
api-doc-gen generate --perf-report ./performance.json
```

## 🔧 Troubleshooting

### Common Issues

#### TypeScript Compilation Errors

```bash
# Check TypeScript configuration
api-doc-gen validate --check-ts-config

# Use specific TypeScript version
api-doc-gen generate --ts-version 4.9.0
```

#### Memory Issues with Large Projects

```javascript
// Increase memory limits
module.exports = {
  processing: {
    memory: {
      maxHeapSize: '4GB'
    },
    chunkSize: 50  // Reduce chunk size
  }
};
```

#### AI Service Rate Limiting

```javascript
module.exports = {
  ai: {
    rateLimitPerMinute: 30,    // Reduce request rate
    batchSize: 5,              // Smaller batch sizes
    retryDelay: 2000           // Delay between retries
  }
};
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=api-doc-gen:* api-doc-gen generate

# Save debug log to file
api-doc-gen generate --debug --log-file ./debug.log
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/your-org/api-documentation-generator.git
cd api-documentation-generator
npm install
npm run dev
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:performance

# Run tests with coverage
npm run test:coverage
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](https://docs.api-doc-gen.com)
- 🐛 [Issue Tracker](https://github.com/your-org/api-documentation-generator/issues)
- 💬 [Discussions](https://github.com/your-org/api-documentation-generator/discussions)
- 📧 [Email Support](mailto:support@api-doc-gen.com)

## 🏆 Acknowledgments

- OpenAPI Initiative for specification standards
- TypeScript team for excellent tooling
- Handlebars.js for templating engine
- OpenAI for AI enhancement capabilities
- All our contributors and users

---

Made with ❤️ by the API Documentation Generator team