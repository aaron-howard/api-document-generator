# API Documentation Generator

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-org/api-documentation-generator)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/your-org/api-documentation-generator/releases)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

A powerful, multi-runtime CLI tool for generating comprehensive API documentation from various sources including OpenAPI specifications, Express.js routes, source code annotations, and more. Built with TypeScript and powered by AI for enhanced documentation quality.

## 🚀 Features

- **Multi-Source Support**: Extract documentation from OpenAPI specs, Express.js routes, TypeScript/JavaScript JSDoc, Python docstrings, and more
- **Express.js Native Support**: Parse Express.js route files directly without requiring OpenAPI specs
- **AI-Enhanced Documentation**: Leverage GPT-4 to improve and expand documentation quality
- **Multiple Output Formats**: Generate HTML, Markdown, PDF, JSON, and UML documentation
- **Multi-Runtime**: Works with Node.js 18+, Python 3.9+, and Go 1.19+
- **Template Customization**: Fully customizable templates using Handlebars
- **Performance Optimized**: Handles large codebases with concurrent processing
- **Caching System**: Intelligent caching for faster regeneration
- **Enterprise Features**: API Gateway, real-time monitoring, and comprehensive error handling

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Express.js Support](#expressjs-support)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🛠 Installation

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- Optional: Python 3.9+ for Python source parsing
- Optional: Go 1.19+ for Go source parsing

### Install from Source

```powershell
# Clone the repository
git clone https://github.com/your-org/api-documentation-generator.git
cd api-documentation-generator

# Install dependencies
npm install

# Build TypeScript sources
npm run build

# (Optional) Link globally for convenience
npm link

# OR run directly without linking
node dist/cli/index.js --help
```

### Verify Installation

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
  inputs: [
    {
      type: 'express',
      path: './src/routes'
    },
    {
      type: 'openapi',
      path: './specs/api.yaml'
    }
  ],
  outputs: [
    {
      format: 'html',
      path: './docs'
    }
  ]
};
```

### 3. Generate documentation

```bash
api-doc-gen generate
```

## 🚀 Express.js Support

The API Documentation Generator includes native support for Express.js applications! You can document your Express.js routes, middleware, and error handlers without needing OpenAPI specifications or JSDoc comments.

### Express.js Parser Features

- ✅ **Route Detection**: Automatically finds `app.get()`, `router.post()`, `app.use()`, etc.
- ✅ **Parameter Extraction**: Extracts route parameters (`:id`, `:userId`) and query parameters
- ✅ **Middleware Detection**: Identifies middleware functions and error handlers
- ✅ **HTTP Methods**: Supports all HTTP methods (GET, POST, PUT, DELETE, PATCH, etc.)
- ✅ **File Location Tracking**: Tracks which file and line each route is defined in
- ✅ **Auto-Detection**: Automatically detects Express.js files based on common patterns

### Express.js Usage Examples

```powershell
# Document Express.js routes with auto-detection
api-doc-gen generate src/routes/ --format html,markdown

# Document Express app file
api-doc-gen generate src/app.js --format html

# Document multiple route files
api-doc-gen generate src/routes/ src/middleware/ --format html,json

# Force Express parser for specific files
api-doc-gen generate --type express src/routes/users.js --format html

# Document with AI enhancement
api-doc-gen generate src/routes/ --format html --ai
```

### Example Express.js Route Output

```javascript
// Input: Express.js route file
app.get('/api/users/:id', authMiddleware, (req, res) => {
  res.json({ user: { id: req.params.id } });
});

// Output: Generated documentation
// GET /api/users/:id
// - Path Parameter: id (string, required)
// - Middleware: authMiddleware
// - Handler: inline function
// - File: src/routes/users.js:15
```

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
  inputs: [
    {
      type: 'express',           // Express.js routes
      path: './src/routes',      // Source path
      enabled: true,             // Enable/disable source
      include: ['**/*.js', '**/*.ts'],
      exclude: ['**/*.test.js']
    },
    {
      type: 'openapi',          // OpenAPI specification
      path: './specs/*.yaml',   // Source path (supports globs)
      enabled: true,            // Enable/disable source
      parserConfig: {           // Parser-specific configuration
        validateSpec: true,
        resolveReferences: true
      }
    }
  ],

  // Output configuration
  outputs: [
    {
      format: 'html',
      path: './docs',
      theme: 'modern'
    },
    {
      format: 'markdown',
      path: './docs'
    }
  ],

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

## 💡 Usage Examples

### Command Line Interface

```bash
# Generate documentation from Express routes
api-doc-gen generate src/routes/ --format html

# Generate from OpenAPI specification
api-doc-gen generate openapi.yaml --format html,markdown

# Generate with AI enhancement
api-doc-gen generate src/ --ai --format html

# Validate input files
api-doc-gen validate src/routes/ openapi.yaml

# Generate changelog between versions
api-doc-gen diff v1/api.yaml v2/api.yaml
```

### Programmatic API

```javascript
const { ParserService, GenerationService } = require('api-documentation-generator');

// Parse Express.js routes
const parser = new ParserService();
const result = await parser.parse({
  type: 'express',
  source: 'directory',
  path: './src/routes'
});

// Generate documentation
const generator = new GenerationService();
const docs = await generator.generate({
  inputs: [result],
  outputs: [{ format: 'html', path: './docs' }]
});
```

## 📖 Supported Input Sources

### Express.js Routes
- **Route Detection**: `app.get()`, `router.post()`, `app.use()`, etc.
- **Parameter Extraction**: Path parameters (`:id`) and query parameters
- **Middleware Detection**: Applied middleware and error handlers
- **File Tracking**: Source file and line number for each route

### OpenAPI/Swagger Specifications
- **OpenAPI 3.0/3.1**: Full specification support
- **Swagger 2.0**: Legacy specification support
- **Validation**: Comprehensive specification validation
- **References**: Automatic reference resolution

### TypeScript/JavaScript JSDoc
- **Function Documentation**: `@param`, `@returns`, `@throws` tags
- **Type Definitions**: Interface and type documentation
- **Route Information**: API endpoint extraction from JSDoc comments

### Python Docstrings
- **Multiple Formats**: Google, NumPy, and Sphinx docstring formats
- **Function Documentation**: Function, class, and module documentation
- **Type Annotations**: Automatic type annotation conversion

### Go Documentation
- **Package Documentation**: Package-level documentation
- **Function Documentation**: Function and method documentation
- **Type Documentation**: Struct and interface documentation

## 🎨 Templates and Themes

### Custom Templates

The tool supports custom Handlebars templates for output customization:

```javascript
// Custom template configuration
outputs: [
  {
    format: 'html',
    path: './docs',
    template: './templates/custom.hbs',
    theme: 'modern'
  }
]
```

### Available Themes

- **Default**: Clean, professional theme
- **Modern**: Contemporary design with dark mode support
- **Minimal**: Simple, distraction-free layout
- **Corporate**: Business-focused design

## 🚀 Performance and Optimization

### Large Codebase Handling

- **Concurrent Processing**: Parallel processing of multiple files
- **Memory Optimization**: Efficient memory usage for large projects
- **Caching**: Intelligent caching for faster regeneration
- **Progress Tracking**: Real-time progress reporting

### Performance Configuration

```javascript
processing: {
  concurrent: true,
  maxConcurrency: 4,        // Number of parallel processes
  timeout: 30000,           // Request timeout in milliseconds
  cache: {
    enabled: true,
    directory: './.cache',   // Cache directory
    ttl: 3600000            // Cache TTL in milliseconds
  }
}
```

## 🔧 Troubleshooting

### Common Issues

#### Express.js Routes Not Detected
```bash
# Ensure files contain Express patterns
api-doc-gen generate --type express src/routes/users.js --verbose

# Check file patterns
api-doc-gen generate src/routes/ --format html
```

#### AI Enhancement Issues
```bash
# Check API key configuration
export OPENAI_API_KEY="your-api-key"

# Disable AI if needed
api-doc-gen generate src/ --format html  # (without --ai)
```

#### Memory Issues with Large Projects
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 dist/cli/index.js generate src/

# Use caching for repeated runs
api-doc-gen generate src/ --cache --format html
```

### Debug Mode

```bash
# Enable verbose output
api-doc-gen generate src/ --verbose --format html

# Enable debug logging
DEBUG=api-doc-gen* api-doc-gen generate src/
```

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Production deployment instructions
- [Contributing Guide](CONTRIBUTING.md) - How to contribute to the project
- [Architecture Guide](ARCHITECTURE.md) - Technical architecture details
- [API Reference](docs/API.md) - Complete API documentation
- [Changelog](CHANGELOG.md) - Version history and changes

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to:

- Report bugs and issues
- Suggest new features
- Submit pull requests
- Set up the development environment

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [docs](docs/) directory for detailed guides
- **Issues**: Report bugs and request features on [GitHub Issues](https://github.com/your-org/api-documentation-generator/issues)
- **Discussions**: Join community discussions on [GitHub Discussions](https://github.com/your-org/api-documentation-generator/discussions)

## 🏆 Acknowledgments

- Built with TypeScript and Node.js
- Powered by OpenAI GPT-4 for AI enhancement
- Uses Handlebars for template rendering
- Inspired by OpenAPI and Swagger tools
