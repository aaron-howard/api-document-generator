"use strict";
/**
 * Parser Service Implementation
 *
 * Multi-language parser service that converts various source code and specification formats
 * into a standardized AST format. Supports OpenAPI, JSDoc, Python docstrings, Go docs, and GraphQL.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserService = exports.ParserRegistry = exports.ParseError = void 0;
/**
 * Parser Error types
 */
class ParseError extends Error {
    constructor(message, code, location, details) {
        super(message);
        this.code = code;
        this.location = location;
        this.details = details;
        this.name = 'ParseError';
    }
}
exports.ParseError = ParseError;
/**
 * Parser registry for managing different parser implementations
 */
class ParserRegistry {
    constructor() {
        this.parsers = new Map();
    }
    /**
     * Register a parser for a specific type
     */
    register(type, parser) {
        this.parsers.set(type, parser);
    }
    /**
     * Get a parser for a specific type
     */
    get(type) {
        return this.parsers.get(type);
    }
    /**
     * Get all registered parser types
     */
    getTypes() {
        return Array.from(this.parsers.keys());
    }
    /**
     * Find appropriate parser for a request
     */
    findParser(request) {
        const parser = this.parsers.get(request.type);
        if (parser && parser.canParse(request)) {
            return parser;
        }
        return undefined;
    }
}
exports.ParserRegistry = ParserRegistry;
/**
 * Main Parser Service class implementing the parser API contract
 */
class ParserService {
    constructor() {
        this.parseCache = new Map();
        this.initialized = false;
        this.initializationPromise = null;
        this.registry = new ParserRegistry();
        // Don't call initializeParsers() here - make it lazy
    }
    /**
     * Ensure parsers are initialized before use
     */
    async ensureInitialized() {
        if (this.initialized) {
            return;
        }
        if (!this.initializationPromise) {
            this.initializationPromise = this.initializeParsers();
        }
        await this.initializationPromise;
    }
    /**
     * Initialize and register all language parsers
     */
    async initializeParsers() {
        // Dynamic imports to avoid circular dependencies and allow optional parsers
        try {
            const OpenAPIParser = (await Promise.resolve().then(() => __importStar(require('./languages/openapi-parser')))).default;
            this.registry.register('openapi', new OpenAPIParser());
        }
        catch (error) {
            console.warn('OpenAPI parser not available:', error.message);
        }
        try {
            const JSDocParser = (await Promise.resolve().then(() => __importStar(require('./languages/jsdoc-parser')))).default;
            this.registry.register('jsdoc', new JSDocParser());
        }
        catch (error) {
            console.warn('JSDoc parser not available:', error.message);
        }
        try {
            const PythonParser = (await Promise.resolve().then(() => __importStar(require('./languages/python-parser')))).default;
            this.registry.register('python-docstring', new PythonParser());
        }
        catch (error) {
            console.warn('Python parser not available:', error.message);
        }
        try {
            const GoDocParser = (await Promise.resolve().then(() => __importStar(require('./languages/go-parser')))).default;
            this.registry.register('go-doc', new GoDocParser());
        }
        catch (error) {
            console.warn('Go parser not available:', error.message);
        }
        try {
            const GraphQLParser = (await Promise.resolve().then(() => __importStar(require('./languages/graphql-parser')))).default;
            this.registry.register('graphql', new GraphQLParser());
        }
        catch (error) {
            console.warn('GraphQL parser not available:', error.message);
        }
        // Register new documentation parsers
        try {
            const DeveloperGuideParser = (await Promise.resolve().then(() => __importStar(require('./languages/developer-guide-parser')))).default;
            this.registry.register('developer-guide', new DeveloperGuideParser());
        }
        catch (error) {
            console.warn('Developer Guide parser not available:', error.message);
        }
        try {
            const ChangelogParser = (await Promise.resolve().then(() => __importStar(require('./languages/changelog-parser')))).default;
            this.registry.register('changelog', new ChangelogParser());
        }
        catch (error) {
            console.warn('Changelog parser not available:', error.message);
        }
        try {
            const ExpressParser = (await Promise.resolve().then(() => __importStar(require('./languages/express-parser')))).default;
            this.registry.register('express', new ExpressParser());
        }
        catch (error) {
            console.warn('Express parser not available:', error.message);
        }
        this.initialized = true;
    }
    /**
     * Parse input source
     * Implementation of POST /parse endpoint from parser-service.yaml
     */
    async parse(request) {
        try {
            // Ensure parsers are initialized
            await this.ensureInitialized();
            // Validate request
            this.validateParseRequest(request);
            // Check cache
            const cacheKey = this.getCacheKey(request);
            const cached = this.parseCache.get(cacheKey);
            if (cached) {
                return cached;
            }
            // Find appropriate parser
            const parser = this.registry.findParser(request);
            if (!parser) {
                throw new ParseError(`No parser available for type: ${request.type}`, 'PARSER_NOT_FOUND');
            }
            // Start timing
            const startTime = Date.now();
            // Parse the source
            const result = await parser.parse(request);
            // Update metadata with timing
            if (result.metadata) {
                result.metadata.parseTime = (Date.now() - startTime) / 1000;
            }
            // Cache successful results
            if (result.status === 'success') {
                this.parseCache.set(cacheKey, result);
            }
            return result;
        }
        catch (error) {
            const parseId = this.generateParseId();
            if (error instanceof ParseError) {
                const baseError = {
                    status: 'error',
                    code: error.code,
                    message: error.message,
                    details: error.details || {}
                };
                const locationToAdd = error.location ? { location: error.location } : {};
                return {
                    status: 'failed',
                    parseId,
                    errors: [{
                            ...baseError,
                            ...locationToAdd
                        }]
                };
            }
            return {
                status: 'failed',
                parseId,
                errors: [{
                        status: 'error',
                        code: 'PARSE_ERROR',
                        message: error.message,
                        details: {}
                    }]
            };
        }
    }
    /**
     * Extract specific data from parsed AST
     * Implementation of POST /extract endpoint from parser-service.yaml
     */
    async extract(request) {
        try {
            // Ensure parsers are initialized
            await this.ensureInitialized();
            // Find the parsed AST by parseId
            const parseResult = this.findParseResult(request.parseId);
            if (!parseResult || !parseResult.ast) {
                throw new Error(`Parse result not found for ID: ${request.parseId}`);
            }
            const extractId = this.generateExtractId();
            let data = {};
            let count = 0;
            switch (request.extractType) {
                case 'endpoints':
                    data = this.filterEndpoints(parseResult.ast.endpoints, request.filters);
                    count = Array.isArray(data) ? data.length : Object.keys(data).length;
                    break;
                case 'schemas':
                    data = this.filterSchemas(parseResult.ast.schemas, request.filters);
                    count = Array.isArray(data) ? data.length : Object.keys(data).length;
                    break;
                case 'components':
                    data = this.filterComponents(parseResult.ast.components, request.filters);
                    count = Array.isArray(data) ? data.length : Object.keys(data).length;
                    break;
                case 'metadata':
                    data = parseResult.ast.metadata;
                    count = Object.keys(data).length;
                    break;
                default:
                    throw new Error(`Invalid extract type: ${request.extractType}`);
            }
            return {
                extractId,
                data,
                count
            };
        }
        catch (error) {
            throw new Error(`Extraction failed: ${error.message}`);
        }
    }
    /**
     * Validate parsed AST structure
     * Implementation of POST /validate endpoint from parser-service.yaml
     */
    async validate(request) {
        try {
            // Ensure parsers are initialized
            await this.ensureInitialized();
            // Find the parsed AST by parseId
            const parseResult = this.findParseResult(request.parseId);
            if (!parseResult || !parseResult.ast) {
                throw new Error(`Parse result not found for ID: ${request.parseId}`);
            }
            // Get the parser type from cached result
            const parserType = parseResult.metadata?.sourceType;
            const parser = this.registry.get(parserType || '');
            if (parser && parser.validate) {
                return await parser.validate(parseResult.ast, request.rules);
            }
            // Basic validation if parser doesn't provide custom validation
            return this.performBasicValidation(parseResult.ast, request.rules);
        }
        catch (error) {
            return {
                valid: false,
                violations: [{
                        rule: 'system',
                        message: `Validation failed: ${error.message}`,
                        severity: 'error'
                    }]
            };
        }
    }
    /**
     * Get available parser types
     */
    getAvailableTypes() {
        return this.registry.getTypes();
    }
    /**
     * Clear parse cache
     */
    clearCache() {
        this.parseCache.clear();
    }
    // Private helper methods
    validateParseRequest(request) {
        if (!request.type) {
            throw new ParseError('Parser type is required', 'MISSING_TYPE');
        }
        if (!request.source) {
            throw new ParseError('Source type is required', 'MISSING_SOURCE');
        }
        if (!request.path) {
            throw new ParseError('Source path is required', 'MISSING_PATH');
        }
        const validTypes = ['openapi', 'jsdoc', 'python-docstring', 'go-doc', 'graphql'];
        if (!validTypes.includes(request.type)) {
            throw new ParseError(`Invalid parser type: ${request.type}`, 'INVALID_TYPE');
        }
        const validSources = ['file', 'directory', 'url', 'content'];
        if (!validSources.includes(request.source)) {
            throw new ParseError(`Invalid source type: ${request.source}`, 'INVALID_SOURCE');
        }
    }
    getCacheKey(request) {
        return JSON.stringify({
            type: request.type,
            source: request.source,
            path: request.path,
            options: request.options
        });
    }
    generateParseId() {
        return `parse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateExtractId() {
        return `extract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    findParseResult(parseId) {
        // In a real implementation, this would look up the result by ID
        // For now, return a mock result from cache
        for (const result of this.parseCache.values()) {
            if (result.parseId === parseId) {
                return result;
            }
        }
        return undefined;
    }
    filterEndpoints(endpoints, filters) {
        if (!filters)
            return endpoints;
        return endpoints.filter(endpoint => {
            if (filters.methods && !filters.methods.includes(endpoint.method)) {
                return false;
            }
            if (filters.paths && !filters.paths.some(path => endpoint.path.includes(path))) {
                return false;
            }
            if (filters.tags && !filters.tags.some(tag => endpoint.tags?.includes(tag))) {
                return false;
            }
            return true;
        });
    }
    filterSchemas(schemas, filters) {
        if (!filters)
            return schemas;
        // Apply any schema-specific filtering here
        return schemas;
    }
    filterComponents(components, filters) {
        if (!filters)
            return components;
        // Apply any component-specific filtering here
        return components;
    }
    async performBasicValidation(ast, rules) {
        const violations = [];
        // Basic AST structure validation
        if (!ast.endpoints || !Array.isArray(ast.endpoints)) {
            violations.push({
                rule: 'structure',
                message: 'AST must contain an endpoints array',
                severity: 'error'
            });
        }
        if (!ast.schemas || !Array.isArray(ast.schemas)) {
            violations.push({
                rule: 'structure',
                message: 'AST must contain a schemas array',
                severity: 'warning'
            });
        }
        // Rule-specific validation
        if (rules) {
            for (const rule of rules) {
                switch (rule) {
                    case 'required-fields':
                        this.validateRequiredFields(ast, violations);
                        break;
                    case 'schema-consistency':
                        this.validateSchemaConsistency(ast, violations);
                        break;
                    case 'endpoint-format':
                        this.validateEndpointFormat(ast, violations);
                        break;
                }
            }
        }
        const validationResult = {
            validationId: this.generateExtractId(),
            valid: violations.filter(v => v.severity === 'error').length === 0
        };
        if (violations.length > 0) {
            return {
                ...validationResult,
                violations
            };
        }
        return validationResult;
    }
    validateRequiredFields(ast, violations) {
        // Check for required fields in endpoints
        if (ast.endpoints) {
            ast.endpoints.forEach((endpoint, index) => {
                if (!endpoint.path) {
                    violations.push({
                        rule: 'required-fields',
                        message: `Endpoint at index ${index} is missing required 'path' field`,
                        severity: 'error'
                    });
                }
                if (!endpoint.method) {
                    violations.push({
                        rule: 'required-fields',
                        message: `Endpoint at index ${index} is missing required 'method' field`,
                        severity: 'error'
                    });
                }
            });
        }
    }
    validateSchemaConsistency(_ast, _violations) {
        // Placeholder for schema consistency validation
    }
    validateEndpointFormat(ast, violations) {
        // Validate endpoint format
        if (ast.endpoints) {
            ast.endpoints.forEach((endpoint, index) => {
                if (endpoint.path && !endpoint.path.startsWith('/')) {
                    violations.push({
                        rule: 'endpoint-format',
                        message: `Endpoint path at index ${index} should start with '/'`,
                        severity: 'warning'
                    });
                }
            });
        }
    }
}
exports.ParserService = ParserService;
// Default export
exports.default = ParserService;
//# sourceMappingURL=parser-service.js.map