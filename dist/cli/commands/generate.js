"use strict";
/**
 * Generate Command Implementation
 *
 * Handles the 'generate' command for API documentation generation.
 * Implements the generation workflow with input validation, parsing,
 * AI enhancement, and output generation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateCommand = void 0;
class GenerateCommand {
    /**
     * Execute the generate command
     */
    async execute(inputs, options = {}) {
        try {
            // Build generation request from CLI arguments
            const request = await this.buildGenerationRequest(inputs, options);
            // Validate request
            this.validateRequest(request);
            // Execute generation
            // This would typically call the CLI service's generate method
            const response = await this.performGeneration(request);
            return response;
        }
        catch (error) {
            throw new Error(`Generation failed: ${error.message}`);
        }
    }
    /**
     * Build generation request from CLI arguments
     */
    async buildGenerationRequest(inputs, options) {
        // Load configuration file if specified
        const config = options.config ? await this.loadConfig(options.config) : null;
        // Determine project information
        const project = config?.project || {
            name: 'API Documentation',
            version: '1.0.0'
        };
        // Process input sources
        const processedInputs = inputs.map(input => ({
            type: this.detectInputType(input),
            path: input,
            enabled: true
        }));
        // Process output formats
        const outputFormats = options.format || ['markdown'];
        const outputs = outputFormats.map(format => ({
            format: format,
            path: options.output || './docs',
            theme: 'default'
        }));
        return {
            project,
            inputs: processedInputs,
            outputs,
            options: {
                aiSummarization: options.ai ?? true,
                generateChangelog: false,
                validateOutput: options.validate ?? true,
                concurrency: options.concurrency ?? 4
            }
        };
    }
    /**
     * Detect input type from file path
     */
    detectInputType(path) {
        const ext = path.toLowerCase();
        if (ext.includes('openapi') || ext.includes('swagger') || ext.endsWith('.yaml') || ext.endsWith('.yml') || ext.endsWith('.json')) {
            return 'openapi';
        }
        if (ext.endsWith('.js') || ext.endsWith('.ts')) {
            return 'jsdoc';
        }
        if (ext.endsWith('.py')) {
            return 'python-docstring';
        }
        if (ext.endsWith('.go')) {
            return 'go-doc';
        }
        if (ext.includes('graphql') || ext.endsWith('.gql') || ext.endsWith('.graphql')) {
            return 'graphql';
        }
        // Default to OpenAPI
        return 'openapi';
    }
    /**
     * Validate generation request
     */
    validateRequest(request) {
        if (!request.project.name || !request.project.version) {
            throw new Error('Project name and version are required');
        }
        if (!request.inputs || request.inputs.length === 0) {
            throw new Error('At least one input source is required');
        }
        if (!request.outputs || request.outputs.length === 0) {
            throw new Error('At least one output format is required');
        }
    }
    /**
     * Load configuration from file
     */
    async loadConfig(_path) {
        // Placeholder - would load actual config file
        return null;
    }
    /**
     * Perform the actual generation
     */
    async performGeneration(request) {
        // Placeholder - would perform actual generation
        const sessionId = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
            status: 'success',
            sessionId,
            outputPaths: request.outputs.map(o => `${o.path}/api.${o.format}`),
            metrics: {
                processedEndpoints: 10,
                generationTime: 2.5,
                aiSummariesGenerated: 10,
                cacheHitRate: 0.8
            }
        };
    }
    /**
     * Get command help text
     */
    static getHelpText() {
        return `
Generate API documentation from source files

USAGE:
  api-doc-gen generate [options] <input-files>

ARGUMENTS:
  <input-files>    Source files to process (OpenAPI specs, code files, etc.)

OPTIONS:
  -c, --config <file>        Configuration file path
  -o, --output <dir>         Output directory (default: ./docs)
  -f, --format <format>      Output format(s): markdown, html, pdf, json
      --ai                   Enable AI summarization (default: true)
      --no-ai                Disable AI summarization
      --validate             Validate output (default: true)
      --no-validate          Skip output validation
      --force                Overwrite existing files
      --dry-run              Show what would be generated without actually doing it
  -p, --profile <name>       Use specific configuration profile
      --concurrency <n>      Number of parallel processes (default: 4)
  -v, --verbose              Verbose output
  -q, --quiet                Quiet mode

EXAMPLES:
  api-doc-gen generate openapi.yaml
  api-doc-gen generate --format markdown,html --output ./docs api.yaml
  api-doc-gen generate --config ./config.json --ai src/**/*.ts
  api-doc-gen generate --dry-run --verbose openapi.yaml
    `;
    }
}
exports.GenerateCommand = GenerateCommand;
exports.default = GenerateCommand;
//# sourceMappingURL=generate.js.map