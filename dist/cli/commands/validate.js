"use strict";
/**
 * Validate Command Implementation
 *
 * Handles the 'validate' command for validating API specifications
 * and source files without generating documentation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateCommand = void 0;
class ValidateCommand {
    /**
     * Execute the validate command
     */
    async execute(inputs, options = {}) {
        try {
            // Build validation request from CLI arguments
            const request = await this.buildValidationRequest(inputs, options);
            // Validate request
            this.validateRequest(request);
            // Execute validation
            const response = await this.performValidation(request);
            return response;
        }
        catch (error) {
            throw new Error(`Validation failed: ${error.message}`);
        }
    }
    /**
     * Build validation request from CLI arguments
     */
    async buildValidationRequest(inputs, _options) {
        // Process input sources
        const processedInputs = inputs.map(input => ({
            type: this.detectInputType(input),
            path: input,
            enabled: true
        }));
        return {
            inputs: processedInputs
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
     * Validate validation request
     */
    validateRequest(request) {
        if (!request.inputs || request.inputs.length === 0) {
            throw new Error('At least one input source is required for validation');
        }
    }
    /**
     * Perform the actual validation
     */
    async performValidation(request) {
        // Placeholder - would perform actual validation
        const errors = [];
        const warnings = [];
        // Simulate validation results
        for (const input of request.inputs) {
            // Check if file exists (mock)
            if (input.path.includes('missing')) {
                errors.push({
                    code: 'FILE_NOT_FOUND',
                    message: `Input file not found: ${input.path}`,
                    path: input.path
                });
                continue;
            }
            // Mock validation based on type
            switch (input.type) {
                case 'openapi':
                    // Simulate OpenAPI validation
                    if (input.path.includes('invalid')) {
                        errors.push({
                            code: 'INVALID_OPENAPI',
                            message: 'Invalid OpenAPI specification',
                            path: input.path,
                            line: 15,
                            column: 8
                        });
                    }
                    break;
                case 'jsdoc':
                    // Simulate JSDoc validation
                    if (input.path.includes('incomplete')) {
                        warnings.push({
                            code: 'INCOMPLETE_JSDOC',
                            message: 'Some functions are missing JSDoc comments',
                            path: input.path
                        });
                    }
                    break;
                // Add more validation logic for other types
            }
        }
        return {
            valid: errors.length === 0,
            ...(errors.length > 0 && { errors }),
            ...(warnings.length > 0 && { warnings })
        };
    }
    /**
     * Get command help text
     */
    static getHelpText() {
        return `
Validate API specifications and source files

USAGE:
  api-doc-gen validate [options] <input-files>

ARGUMENTS:
  <input-files>    Source files to validate (OpenAPI specs, code files, etc.)

OPTIONS:
  -c, --config <file>        Configuration file path
      --format <format>      Output format for validation results: text, json
      --strict               Use strict validation rules
      --warnings             Show warnings (default: true)
      --no-warnings          Hide warnings
  -p, --profile <name>       Use specific configuration profile
  -v, --verbose              Verbose output
  -q, --quiet                Quiet mode (only show errors)

EXAMPLES:
  api-doc-gen validate openapi.yaml
  api-doc-gen validate --strict --format json api.yaml
  api-doc-gen validate --no-warnings src/**/*.ts
  api-doc-gen validate --config ./config.json --profile production *.yaml
    `;
    }
}
exports.ValidateCommand = ValidateCommand;
exports.default = ValidateCommand;
//# sourceMappingURL=validate.js.map