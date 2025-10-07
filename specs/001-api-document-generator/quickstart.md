# API Documentation Generator - Quick Start Guide

> ⚠️ **Windows-Only Quick Start**  
> This quick start applies solely to Windows systems. Installation or execution on Linux or macOS is not supported in this project scope.

This guide provides step-by-step instructions for getting started with the API Documentation Generator, from installation to generating your first documentation.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Common Use Cases](#common-use-cases)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

## Prerequisites

### System Requirements
- **Node.js**: Version 18.0.0 or higher
- **Python**: Version 3.9.0 or higher (for Python source parsing)
- **Go**: Version 1.19.0 or higher (for Go source parsing)
- **Memory**: Minimum 2GB RAM available
- **Disk Space**: At least 500MB free space

### Supported Input Formats
- OpenAPI/Swagger specifications (YAML/JSON)
- JSDoc-annotated JavaScript/TypeScript
- Python docstrings
- Go documentation comments
- GraphQL schemas

### Supported Output Formats
- Markdown
- HTML (with themes)
- PDF
- JSON

## Installation

### Option 1: NPM (Recommended)
```bash
npm install -g api-document-generator
```

### Option 2: Download Binary
Download the latest release from [GitHub Releases](https://github.com/api-documentation-generator/releases) for your platform:
- Windows: `api-doc-gen-windows.exe`
- macOS: `api-doc-gen-darwin`
- Linux: `api-doc-gen-linux`

### Option 3: Build from Source
```bash
git clone https://github.com/api-documentation-generator/api-document-generator.git
cd api-document-generator
npm install
npm run build
npm link
```

### Verify Installation
```bash
api-doc-gen --version
```

## Quick Start

### 1. Basic OpenAPI Documentation
Generate documentation from an OpenAPI specification:

```bash
api-doc-gen generate \
  --input openapi.yaml \
  --output ./docs \
  --format markdown
```

### 2. Multi-Source Documentation
Generate documentation from multiple sources:

```bash
api-doc-gen generate \
  --input openapi.yaml \
  --input "./src/**/*.js" \
  --output ./docs \
  --format html \
  --theme default
```

### 3. With AI Enhancement
Enable AI-powered summaries and examples:

```bash
api-doc-gen generate \
  --input openapi.yaml \
  --output ./docs \
  --format markdown \
  --ai-summary \
  --openai-key YOUR_API_KEY
```

### 4. Configuration File
Create a `api-doc-gen.config.json` file:

```json
{
  "project": {
    "name": "My API",
    "version": "1.0.0",
    "description": "RESTful API for user management"
  },
  "inputs": [
    {
      "type": "openapi",
      "path": "./api/openapi.yaml",
      "enabled": true
    },
    {
      "type": "jsdoc",
      "path": "./src",
      "include": ["**/*.js", "**/*.ts"],
      "exclude": ["**/*.test.js"]
    }
  ],
  "outputs": [
    {
      "format": "markdown",
      "path": "./docs/api.md",
      "theme": "default"
    },
    {
      "format": "html",
      "path": "./docs",
      "theme": "minimal"
    }
  ],
  "options": {
    "aiSummarization": true,
    "generateChangelog": false,
    "validateOutput": true
  }
}
```

Then run:
```bash
api-doc-gen generate --config api-doc-gen.config.json
```

## Configuration

### Environment Variables
Set up your environment:

```bash
# OpenAI API Key for AI features
export OPENAI_API_KEY="your-api-key-here"

# Cache directory (optional)
export API_DOC_CACHE_DIR="./cache"

# Log level (optional)
export API_DOC_LOG_LEVEL="info"
```

### Input Source Configuration

#### OpenAPI/Swagger
```json
{
  "type": "openapi",
  "path": "./api.yaml",
  "parserConfig": {
    "validateSchema": true,
    "resolveRefs": true
  }
}
```

#### JSDoc (JavaScript/TypeScript)
```json
{
  "type": "jsdoc",
  "path": "./src",
  "include": ["**/*.js", "**/*.ts"],
  "exclude": ["**/*.test.js", "node_modules/**"],
  "parserConfig": {
    "recursive": true,
    "includePrivate": false
  }
}
```

#### Python Docstrings
```json
{
  "type": "python-docstring",
  "path": "./src",
  "include": ["**/*.py"],
  "exclude": ["**/*test*.py"],
  "parserConfig": {
    "style": "google"
  }
}
```

### Output Configuration

#### Markdown
```json
{
  "format": "markdown",
  "path": "./docs/api.md",
  "options": {
    "theme": "default",
    "includeTableOfContents": true,
    "splitByTags": false
  }
}
```

#### HTML
```json
{
  "format": "html",
  "path": "./docs",
  "options": {
    "theme": "minimal",
    "customCSS": "./custom.css",
    "includeSearch": true
  }
}
```

#### PDF
```json
{
  "format": "pdf",
  "path": "./docs/api.pdf",
  "options": {
    "pageSize": "A4",
    "includeTableOfContents": true,
    "headerFooter": true
  }
}
```

## Common Use Cases

### Use Case 1: REST API Documentation
**Scenario**: Document a REST API from OpenAPI specification

```bash
api-doc-gen generate \
  --input ./api/openapi.yaml \
  --output ./docs \
  --format html \
  --theme default \
  --ai-summary
```

**Result**: Complete HTML documentation with navigation, examples, and AI-generated summaries.

### Use Case 2: Code-First Documentation
**Scenario**: Generate docs from TypeScript source code

```bash
api-doc-gen generate \
  --input "./src/**/*.ts" \
  --output ./docs \
  --format markdown \
  --include-examples \
  --validate
```

**Result**: Markdown documentation extracted from JSDoc comments with validation.

### Use Case 3: Multi-Language Project
**Scenario**: Document APIs from multiple languages

```json
{
  "inputs": [
    {
      "type": "jsdoc",
      "path": "./frontend/src",
      "include": ["**/*.ts"]
    },
    {
      "type": "python-docstring",
      "path": "./backend/src",
      "include": ["**/*.py"]
    },
    {
      "type": "openapi",
      "path": "./api/spec.yaml"
    }
  ],
  "outputs": [
    {
      "format": "html",
      "path": "./docs",
      "theme": "detailed"
    }
  ]
}
```

### Use Case 4: CI/CD Integration
**Scenario**: Automated documentation generation in CI pipeline

```yaml
# .github/workflows/docs.yml
name: Generate API Documentation
on:
  push:
    branches: [main]
    paths: ['api/**', 'src/**']

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install API Doc Generator
        run: npm install -g api-document-generator
      
      - name: Generate Documentation
        run: |
          api-doc-gen generate \
            --config api-doc-gen.config.json \
            --output ./docs
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

## Troubleshooting

### Common Issues

#### Issue: "Command not found: api-doc-gen"
**Solution**: Ensure the tool is properly installed and in your PATH:
```bash
npm list -g api-document-generator
npm install -g api-document-generator
```

#### Issue: "OpenAI API rate limit exceeded"
**Solution**: 
- Reduce concurrency: `--max-concurrent 1`
- Use caching: `--cache-dir ./cache`
- Wait and retry: The tool will automatically retry with exponential backoff

#### Issue: "Parser failed: Invalid syntax"
**Solution**:
1. Validate your input files:
   ```bash
   api-doc-gen validate --input your-file.yaml
   ```
2. Check file encoding (must be UTF-8)
3. Verify syntax with appropriate linters

#### Issue: "Out of memory during generation"
**Solution**:
- Increase Node.js memory: `NODE_OPTIONS="--max-old-space-size=4096" api-doc-gen generate ...`
- Process files in smaller batches
- Use `--max-concurrent 1` to reduce memory usage

#### Issue: "AI summaries are inaccurate"
**Solution**:
- Provide more context in input documentation
- Use `--ai-temperature 0.2` for more deterministic results
- Review and edit generated summaries manually

### Debug Mode
Enable detailed logging:
```bash
api-doc-gen generate --debug --log-level debug --input openapi.yaml
```

### Validation
Validate configuration before generation:
```bash
api-doc-gen validate --config api-doc-gen.config.json
```

## Next Steps

### Advanced Features
1. **Custom Templates**: Create custom output templates
   ```bash
   api-doc-gen template create --name my-theme --base default
   ```

2. **Plugin Development**: Extend functionality with plugins
   ```bash
   api-doc-gen plugin init --name my-plugin
   ```

3. **Batch Processing**: Process multiple projects
   ```bash
   api-doc-gen batch --projects ./projects.json
   ```

### Integration Guides
- [GitHub Actions Integration](./integrations/github-actions.md)
- [Jenkins Pipeline](./integrations/jenkins.md)
- [Docker Usage](./integrations/docker.md)
- [VS Code Extension](./integrations/vscode.md)

### Documentation
- [CLI Reference](./cli-reference.md)
- [Configuration Guide](./configuration.md)
- [Template Development](./templates.md)
- [Plugin Development](./plugins.md)
- [API Reference](./api-reference.md)

### Support
- [GitHub Issues](https://github.com/api-documentation-generator/issues)
- [Discord Community](https://discord.gg/api-doc-gen)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/api-document-generator)

## Examples Repository
Explore complete examples in our [examples repository](https://github.com/api-documentation-generator/examples):

- [Basic OpenAPI](https://github.com/api-documentation-generator/examples/tree/main/basic-openapi)
- [TypeScript Express API](https://github.com/api-documentation-generator/examples/tree/main/typescript-express)
- [Python FastAPI](https://github.com/api-documentation-generator/examples/tree/main/python-fastapi)
- [Go Gin API](https://github.com/api-documentation-generator/examples/tree/main/go-gin)
- [GraphQL Schema](https://github.com/api-documentation-generator/examples/tree/main/graphql)

Start with these examples to understand best practices and common patterns for your specific use case.