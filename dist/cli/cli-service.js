"use strict";
/**
 * CLI Service Implementation
 *
 * Implements the CLI interface based on the CLI API contract (cli-api.yaml).
 * Provides command parsing, configuration handling, user workflows, and error reporting.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIService = void 0;
/**
 * Main CLI Service class implementing the CLI API contract
 */
class CLIService {
    constructor() {
        this.config = null;
        this.preferences = null;
        // Initialize with simplified default preferences
        this.preferences = null; // Will be set when loading actual user preferences
    }
    /**
     * Generate API documentation
     * Implementation of POST /generate endpoint from cli-api.yaml
     */
    async generate(request) {
        try {
            // Validate request
            this.validateGenerationRequest(request);
            // Generate unique session ID
            const sessionId = this.generateSessionId();
            // Validate input sources
            const inputValidation = await this.validateInputSources(request.inputs);
            if (!inputValidation.valid) {
                return {
                    status: 'failed',
                    sessionId,
                    ...(inputValidation.errors && inputValidation.errors.length > 0 && {
                        errors: inputValidation.errors.map(e => ({
                            code: e.code,
                            message: e.message,
                            path: e.path
                        }))
                    })
                };
            }
            // Start generation process
            const startTime = Date.now();
            const outputPaths = [];
            const warnings = [];
            let processedEndpoints = 0;
            let aiSummariesGenerated = 0;
            // Process each input source
            for (const input of request.inputs.filter(i => i.enabled !== false)) {
                try {
                    // Parse input source (this would call parser service)
                    const parseResult = await this.parseInputSource(input);
                    processedEndpoints += parseResult.endpointCount || 0;
                    // Generate AI summaries if enabled
                    if (request.options?.aiSummarization) {
                        const aiResult = await this.generateAISummaries(parseResult);
                        aiSummariesGenerated += aiResult.count || 0;
                    }
                    // Generate outputs for each format
                    for (const output of request.outputs) {
                        const outputPath = await this.generateOutput(parseResult, output);
                        outputPaths.push(outputPath);
                    }
                }
                catch (error) {
                    warnings.push({
                        code: 'INPUT_PROCESSING_WARNING',
                        message: `Warning processing input ${input.path}: ${error.message}`,
                        path: input.path
                    });
                }
            }
            const generationTime = (Date.now() - startTime) / 1000;
            return {
                status: outputPaths.length > 0 ? 'success' : 'partial',
                sessionId,
                outputPaths,
                metrics: {
                    processedEndpoints,
                    generationTime,
                    aiSummariesGenerated,
                    cacheHitRate: 0.85 // Mock cache hit rate
                },
                ...(warnings.length > 0 && { warnings })
            };
        }
        catch (error) {
            const sessionId = this.generateSessionId();
            return {
                status: 'failed',
                sessionId,
                errors: [{
                        code: 'GENERATION_ERROR',
                        message: error.message,
                        ...(error.stack && { stack: error.stack })
                    }]
            };
        }
    }
    /**
     * Validate input sources
     * Implementation of POST /validate endpoint from cli-api.yaml
     */
    async validate(request) {
        try {
            const errors = [];
            const warnings = [];
            for (const input of request.inputs.filter(i => i.enabled !== false)) {
                try {
                    const validation = await this.validateSingleInput(input);
                    if (validation.errors) {
                        errors.push(...validation.errors);
                    }
                    if (validation.warnings) {
                        warnings.push(...validation.warnings);
                    }
                }
                catch (error) {
                    errors.push({
                        code: 'VALIDATION_ERROR',
                        message: `Failed to validate ${input.path}: ${error.message}`,
                        path: input.path
                    });
                }
            }
            return {
                valid: errors.length === 0,
                ...(errors.length > 0 && { errors }),
                ...(warnings.length > 0 && { warnings })
            };
        }
        catch (error) {
            return {
                valid: false,
                errors: [{
                        code: 'VALIDATION_SYSTEM_ERROR',
                        message: error.message,
                        path: 'system'
                    }]
            };
        }
    }
    /**
     * Generate API changelog/diff
     * Implementation of POST /diff endpoint from cli-api.yaml
     */
    async diff(request) {
        try {
            // Parse both versions
            const oldVersion = await this.parseInputSource(request.oldVersion);
            const newVersion = await this.parseInputSource(request.newVersion);
            // Compare and generate diff
            const changes = await this.compareVersions(oldVersion, newVersion);
            // Calculate summary statistics
            const summary = {
                totalChanges: changes.length,
                breakingChanges: changes.filter(c => c.type === 'breaking').length,
                additions: changes.filter(c => c.type === 'added').length,
                removals: changes.filter(c => c.type === 'removed').length,
                modifications: changes.filter(c => c.type === 'modified').length
            };
            return {
                changes,
                summary
            };
        }
        catch (error) {
            throw new Error(`Failed to generate diff: ${error.message}`);
        }
    }
    /**
     * Initialize configuration file
     */
    async init(projectPath, options = {}) {
        try {
            const configPath = `${projectPath}/api-doc-gen.config.json`;
            // Check if config already exists
            if (!options.force && await this.fileExists(configPath)) {
                return {
                    success: false,
                    message: 'Configuration file already exists. Use --force to overwrite.',
                    exitCode: 1
                };
            }
            // Create default configuration
            const defaultConfig = {
                project: {
                    name: 'My API Project',
                    version: '1.0.0',
                    description: 'API documentation generated with api-doc-gen'
                },
                defaults: {
                    inputs: [{
                            type: 'openapi',
                            path: './openapi.yaml',
                            enabled: true
                        }],
                    outputs: [{
                            format: 'markdown',
                            path: './docs',
                            theme: 'default'
                        }],
                    options: {
                        aiSummarization: true,
                        generateChangelog: false,
                        validateOutput: true,
                        concurrency: 4
                    }
                }
            };
            await this.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
            return {
                success: true,
                message: `Configuration file created at ${configPath}`,
                exitCode: 0
            };
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to initialize configuration: ${error.message}`,
                errors: [error.message],
                exitCode: 1
            };
        }
    }
    /**
     * Load configuration from file
     */
    async loadConfig(configPath) {
        try {
            const path = configPath || './api-doc-gen.config.json';
            if (!(await this.fileExists(path))) {
                return null;
            }
            const content = await this.readFile(path);
            this.config = JSON.parse(content);
            return this.config;
        }
        catch (error) {
            throw new Error(`Failed to load configuration: ${error.message}`);
        }
    }
    /**
     * Save configuration to file
     */
    async saveConfig(config, configPath) {
        try {
            const path = configPath || './api-doc-gen.config.json';
            await this.writeFile(path, JSON.stringify(config, null, 2));
            this.config = config;
        }
        catch (error) {
            throw new Error(`Failed to save configuration: ${error.message}`);
        }
    }
    /**
     * Get current configuration
     */
    getConfig() {
        return this.config;
    }
    /**
     * Set user preferences
     */
    setPreferences(preferences) {
        this.preferences = preferences;
    }
    /**
     * Get user preferences
     */
    getPreferences() {
        return this.preferences;
    }
    // Private helper methods
    validateGenerationRequest(request) {
        if (!request.project?.name || !request.project?.version) {
            throw new Error('Project name and version are required');
        }
        if (!request.inputs || request.inputs.length === 0) {
            throw new Error('At least one input source is required');
        }
        if (!request.outputs || request.outputs.length === 0) {
            throw new Error('At least one output format is required');
        }
        // Validate input types
        const validInputTypes = ['openapi', 'jsdoc', 'python-docstring', 'go-doc', 'graphql'];
        for (const input of request.inputs) {
            if (!validInputTypes.includes(input.type)) {
                throw new Error(`Invalid input type: ${input.type}`);
            }
        }
        // Validate output formats
        const validOutputFormats = ['markdown', 'html', 'pdf', 'json'];
        for (const output of request.outputs) {
            if (!validOutputFormats.includes(output.format)) {
                throw new Error(`Invalid output format: ${output.format}`);
            }
        }
    }
    async validateInputSources(inputs) {
        const errors = [];
        const warnings = [];
        for (const input of inputs.filter(i => i.enabled !== false)) {
            // Check if file exists
            if (!(await this.fileExists(input.path))) {
                errors.push({
                    code: 'FILE_NOT_FOUND',
                    message: `Input file not found: ${input.path}`,
                    path: input.path
                });
                continue;
            }
            // Validate file format based on type
            try {
                const validation = await this.validateFileFormat(input);
                if (validation.errors) {
                    errors.push(...validation.errors);
                }
                if (validation.warnings) {
                    warnings.push(...validation.warnings);
                }
            }
            catch (error) {
                errors.push({
                    code: 'VALIDATION_ERROR',
                    message: `Validation failed for ${input.path}: ${error.message}`,
                    path: input.path
                });
            }
        }
        return {
            valid: errors.length === 0,
            ...(errors.length > 0 && { errors }),
            ...(warnings.length > 0 && { warnings })
        };
    }
    async validateSingleInput(input) {
        const errors = [];
        const warnings = [];
        // Check if file exists
        if (!(await this.fileExists(input.path))) {
            errors.push({
                code: 'FILE_NOT_FOUND',
                message: `Input file not found: ${input.path}`,
                path: input.path
            });
            return { errors, warnings };
        }
        // Type-specific validation
        switch (input.type) {
            case 'openapi':
                const openApiValidation = await this.validateOpenApiFile(input.path);
                if (openApiValidation.errors)
                    errors.push(...openApiValidation.errors);
                if (openApiValidation.warnings)
                    warnings.push(...openApiValidation.warnings);
                break;
            case 'jsdoc':
                const jsDocValidation = await this.validateJSDocFiles(input.path);
                if (jsDocValidation.errors)
                    errors.push(...jsDocValidation.errors);
                if (jsDocValidation.warnings)
                    warnings.push(...jsDocValidation.warnings);
                break;
            case 'python-docstring':
                const pythonValidation = await this.validatePythonFiles(input.path);
                if (pythonValidation.errors)
                    errors.push(...pythonValidation.errors);
                if (pythonValidation.warnings)
                    warnings.push(...pythonValidation.warnings);
                break;
            case 'go-doc':
                const goValidation = await this.validateGoFiles(input.path);
                if (goValidation.errors)
                    errors.push(...goValidation.errors);
                if (goValidation.warnings)
                    warnings.push(...goValidation.warnings);
                break;
            case 'graphql':
                const graphqlValidation = await this.validateGraphQLFiles(input.path);
                if (graphqlValidation.errors)
                    errors.push(...graphqlValidation.errors);
                if (graphqlValidation.warnings)
                    warnings.push(...graphqlValidation.warnings);
                break;
            default:
                errors.push({
                    code: 'INVALID_TYPE',
                    message: `Unsupported input type: ${input.type}`,
                    path: input.path
                });
        }
        return { errors, warnings };
    }
    async validateFileFormat(_input) {
        // This is a placeholder - in real implementation, this would validate file format
        return { errors: [], warnings: [] };
    }
    async validateOpenApiFile(_path) {
        // Placeholder for OpenAPI validation
        return { errors: [], warnings: [] };
    }
    async validateJSDocFiles(_path) {
        // Placeholder for JSDoc validation
        return { errors: [], warnings: [] };
    }
    async validatePythonFiles(_path) {
        // Placeholder for Python validation
        return { errors: [], warnings: [] };
    }
    async validateGoFiles(_path) {
        // Placeholder for Go validation
        return { errors: [], warnings: [] };
    }
    async validateGraphQLFiles(_path) {
        // Placeholder for GraphQL validation
        return { errors: [], warnings: [] };
    }
    async parseInputSource(_input) {
        // Placeholder for parser service integration
        return {
            endpointCount: 10,
            metadata: {},
            ast: {}
        };
    }
    async generateAISummaries(parseResult) {
        // Placeholder for AI service integration
        return { count: parseResult.endpointCount || 0 };
    }
    async generateOutput(_parseResult, output) {
        // Placeholder for output generation
        return `${output.path}/api.${output.format}`;
    }
    async compareVersions(_oldVersion, _newVersion) {
        // Placeholder for version comparison
        return [
            {
                type: 'added',
                path: '/users/{id}',
                description: 'New endpoint added'
            }
        ];
    }
    generateSessionId() {
        return `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    async fileExists(_path) {
        // Placeholder - in real implementation, this would check file system
        return true;
    }
    async readFile(_path) {
        // Placeholder - in real implementation, this would read from file system
        return '{}';
    }
    async writeFile(_path, _content) {
        // Placeholder - in real implementation, this would write to file system
    }
}
exports.CLIService = CLIService;
// Default export
exports.default = CLIService;
//# sourceMappingURL=cli-service.js.map