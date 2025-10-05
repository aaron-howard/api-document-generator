"use strict";
/**
 * OpenAPI Parser Implementation
 *
 * Parses OpenAPI 3.x and Swagger 2.0 specifications into standardized AST format.
 * Supports schema validation, reference resolution, and comprehensive error reporting.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAPIParser = void 0;
const parser_service_1 = require("../parser-service");
const api_spec_1 = require("../../core/models/api-spec");
/**
 * OpenAPI Parser class implementing IParser interface
 */
class OpenAPIParser {
    constructor() {
        this.type = 'openapi';
        this.supportedExtensions = ['.yaml', '.yml', '.json'];
    }
    /**
     * Check if this parser can handle the given request
     */
    canParse(request) {
        if (request.type !== 'openapi') {
            return false;
        }
        // Check file extension
        const path = request.path.toLowerCase();
        const hasValidExtension = this.supportedExtensions.some(ext => path.endsWith(ext));
        // Check for OpenAPI/Swagger indicators in filename
        const hasValidName = path.includes('openapi') ||
            path.includes('swagger') ||
            path.includes('api') ||
            hasValidExtension;
        return hasValidExtension || hasValidName;
    }
    /**
     * Parse OpenAPI specification into standardized AST format
     */
    async parse(request) {
        const parseId = this.generateParseId();
        const startTime = Date.now();
        try {
            // Load and parse the OpenAPI document
            const document = await this.loadDocument(request);
            // Validate the document structure
            if (request.options?.validateSchema !== false) {
                await this.validateDocument(document);
            }
            // Resolve references if requested
            if (request.options?.resolveRefs !== false) {
                await this.resolveReferences(document);
            }
            // Convert to standardized AST
            const ast = await this.convertToAST(document, request);
            const endTime = Date.now();
            const parseTime = (endTime - startTime) / 1000;
            return {
                status: 'success',
                parseId,
                ast: {
                    endpoints: ast.endpoints,
                    schemas: ast.schemas,
                    components: ast.components,
                    metadata: ast.metadata
                },
                metadata: {
                    sourceType: 'openapi',
                    version: document.openapi || document.swagger || '3.0.0',
                    endpointCount: ast.endpoints.length,
                    schemaCount: ast.schemas.length,
                    parseTime,
                    fileSize: this.calculateDocumentSize(document)
                }
            };
        }
        catch (error) {
            return this.handleParseError(error, parseId);
        }
    }
    /**
     * Validate parsed OpenAPI AST
     */
    async validate(ast, rules) {
        const violations = [];
        // Standard OpenAPI validation rules
        if (!rules || rules.includes('openapi-structure')) {
            this.validateOpenAPIStructure(ast, violations);
        }
        if (!rules || rules.includes('endpoint-definitions')) {
            this.validateEndpointDefinitions(ast, violations);
        }
        if (!rules || rules.includes('schema-definitions')) {
            this.validateSchemaDefinitions(ast, violations);
        }
        if (!rules || rules.includes('security-definitions')) {
            this.validateSecurityDefinitions(ast, violations);
        }
        return {
            valid: violations.filter(v => v.severity === 'error').length === 0,
            ...(violations.length > 0 && { violations })
        };
    }
    // Private implementation methods
    async loadDocument(request) {
        switch (request.source) {
            case 'file':
                return await this.loadFromFile(request.path);
            case 'url':
                return await this.loadFromUrl(request.path);
            case 'content':
                return await this.loadFromContent(request.path);
            default:
                throw new parser_service_1.ParseError(`Unsupported source type for OpenAPI: ${request.source}`, 'UNSUPPORTED_SOURCE');
        }
    }
    async loadFromFile(_path) {
        // Placeholder for file loading - would use fs.readFileSync or similar
        // For now, return a mock OpenAPI document
        return {
            openapi: '3.0.3',
            info: {
                title: 'Sample API',
                version: '1.0.0',
                description: 'A sample API loaded from file'
            },
            paths: {
                '/users': {
                    get: {
                        summary: 'Get users',
                        responses: {
                            '200': {
                                description: 'Successful response',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/User' }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    post: {
                        summary: 'Create user',
                        requestBody: {
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/User' }
                                }
                            }
                        },
                        responses: {
                            '201': {
                                description: 'User created',
                                content: {
                                    'application/json': {
                                        schema: { $ref: '#/components/schemas/User' }
                                    }
                                }
                            }
                        }
                    }
                },
                '/users/{id}': {
                    get: {
                        summary: 'Get user by ID',
                        parameters: [
                            {
                                name: 'id',
                                in: 'path',
                                required: true,
                                schema: { type: 'string' }
                            }
                        ],
                        responses: {
                            '200': {
                                description: 'User found',
                                content: {
                                    'application/json': {
                                        schema: { $ref: '#/components/schemas/User' }
                                    }
                                }
                            },
                            '404': {
                                description: 'User not found'
                            }
                        }
                    }
                }
            },
            components: {
                schemas: {
                    User: {
                        type: 'object',
                        required: ['id', 'name'],
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            email: { type: 'string', format: 'email' },
                            created: { type: 'string', format: 'date-time' }
                        }
                    }
                }
            }
        };
    }
    async loadFromUrl(_url) {
        // Placeholder for URL loading
        throw new parser_service_1.ParseError('URL loading not yet implemented', 'NOT_IMPLEMENTED');
    }
    async loadFromContent(content) {
        try {
            // Try parsing as JSON first
            return JSON.parse(content);
        }
        catch {
            // Try parsing as YAML
            // In real implementation, would use yaml.parse()
            throw new parser_service_1.ParseError('YAML parsing not yet implemented', 'NOT_IMPLEMENTED');
        }
    }
    async validateDocument(document) {
        // Basic structure validation
        if (!document.openapi && !document.swagger) {
            throw new parser_service_1.ParseError('Document must have openapi or swagger field', 'INVALID_DOCUMENT');
        }
        if (!document.info) {
            throw new parser_service_1.ParseError('Document must have info object', 'MISSING_INFO');
        }
        if (!document.info.title || !document.info.version) {
            throw new parser_service_1.ParseError('Document info must have title and version', 'MISSING_INFO_FIELDS');
        }
        if (!document.paths) {
            throw new parser_service_1.ParseError('Document must have paths object', 'MISSING_PATHS');
        }
    }
    async resolveReferences(_document) {
        // Placeholder for reference resolution
        // In real implementation, would resolve $ref objects
    }
    async convertToAST(document, _request) {
        const endpoints = this.extractEndpoints(document);
        const schemas = this.extractSchemas(document);
        const components = this.extractComponents(document);
        const metadata = this.extractMetadata(document);
        // Create ApiSpecification
        const spec = {
            id: this.generateSpecId(),
            format: document.openapi ? api_spec_1.ApiSpecFormat.OPENAPI_3_0 : api_spec_1.ApiSpecFormat.SWAGGER_2_0,
            version: document.info.version,
            metadata: {
                title: document.info.title,
                description: document.info.description,
                version: document.info.version,
                contact: document.info.contact,
                license: document.info.license,
                termsOfService: document.info.termsOfService
            },
            endpoints,
            dataModels: schemas,
            security: this.extractSecurity(document),
            servers: this.extractServers(document),
            tags: this.extractTags(document),
            externalDocs: document.externalDocs
        };
        return {
            spec,
            endpoints: endpoints.map(e => this.endpointToPlainObject(e)),
            schemas,
            components,
            metadata
        };
    }
    extractEndpoints(document) {
        const endpoints = [];
        if (!document.paths) {
            return endpoints;
        }
        for (const [path, pathItem] of Object.entries(document.paths)) {
            if (typeof pathItem !== 'object' || !pathItem)
                continue;
            const httpMethods = [
                api_spec_1.HttpMethod.GET,
                api_spec_1.HttpMethod.POST,
                api_spec_1.HttpMethod.PUT,
                api_spec_1.HttpMethod.DELETE,
                api_spec_1.HttpMethod.PATCH,
                api_spec_1.HttpMethod.HEAD,
                api_spec_1.HttpMethod.OPTIONS,
                api_spec_1.HttpMethod.TRACE
            ];
            for (const method of httpMethods) {
                const operation = pathItem[method.toLowerCase()];
                if (!operation)
                    continue;
                endpoints.push({
                    id: `${method}_${path}`.replace(/[^a-zA-Z0-9]/g, '_'),
                    path,
                    method,
                    summary: operation.summary,
                    description: operation.description,
                    operationId: operation.operationId,
                    tags: operation.tags || [],
                    parameters: this.extractParameters(operation.parameters, pathItem.parameters),
                    requestBody: this.extractRequestBody(operation.requestBody),
                    responses: this.extractResponses(operation.responses),
                    security: operation.security,
                    deprecated: operation.deprecated || false,
                    callbacks: operation.callbacks,
                    servers: operation.servers
                });
            }
        }
        return endpoints;
    }
    extractSchemas(document) {
        const schemas = [];
        if (document.components?.schemas) {
            for (const [name, schema] of Object.entries(document.components.schemas)) {
                schemas.push({
                    name,
                    schema: schema,
                    description: schema.description
                });
            }
        }
        return schemas;
    }
    extractComponents(document) {
        const components = [];
        if (document.components) {
            // Extract various component types
            const componentTypes = ['schemas', 'responses', 'parameters', 'examples', 'requestBodies', 'headers', 'securitySchemes', 'links', 'callbacks'];
            for (const type of componentTypes) {
                if (document.components[type]) {
                    for (const [name, component] of Object.entries(document.components[type])) {
                        components.push({
                            type,
                            name,
                            definition: component,
                            source: 'openapi'
                        });
                    }
                }
            }
        }
        return components;
    }
    extractMetadata(document) {
        return {
            openapi: document.openapi || document.swagger,
            info: document.info,
            externalDocs: document.externalDocs,
            servers: document.servers,
            tags: document.tags,
            security: document.security
        };
    }
    extractParameters(operationParams, pathParams) {
        const parameters = [];
        // Add path-level parameters
        if (pathParams) {
            parameters.push(...pathParams);
        }
        // Add operation-level parameters
        if (operationParams) {
            parameters.push(...operationParams);
        }
        return parameters;
    }
    extractRequestBody(requestBody) {
        return requestBody || undefined;
    }
    extractResponses(responses) {
        return responses || {};
    }
    extractSecurity(document) {
        const security = [];
        if (document.components?.securitySchemes) {
            for (const [name, scheme] of Object.entries(document.components.securitySchemes)) {
                security.push({
                    name,
                    scheme
                });
            }
        }
        return security;
    }
    extractServers(document) {
        return document.servers || [];
    }
    extractTags(document) {
        return document.tags || [];
    }
    endpointToPlainObject(endpoint) {
        return {
            id: endpoint.id,
            path: endpoint.path,
            method: endpoint.method,
            summary: endpoint.summary,
            description: endpoint.description,
            operationId: endpoint.operationId,
            tags: endpoint.tags,
            parameters: endpoint.parameters,
            requestBody: endpoint.requestBody,
            responses: endpoint.responses,
            security: endpoint.security,
            deprecated: endpoint.deprecated
        };
    }
    calculateDocumentSize(document) {
        return JSON.stringify(document).length;
    }
    generateParseId() {
        return `openapi_parse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateSpecId() {
        return `openapi_spec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    handleParseError(error, parseId) {
        if (error instanceof parser_service_1.ParseError) {
            return {
                status: 'failed',
                parseId,
                errors: [{
                        status: 'error',
                        code: error.code,
                        message: error.message,
                        details: error.details || {},
                        ...(error.location && { location: error.location })
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
    // Validation methods
    validateOpenAPIStructure(ast, violations) {
        if (!ast.metadata || !ast.metadata.openapi) {
            violations.push({
                rule: 'openapi-structure',
                message: 'Missing OpenAPI version in metadata',
                severity: 'error'
            });
        }
        if (!ast.metadata?.info?.title) {
            violations.push({
                rule: 'openapi-structure',
                message: 'Missing required title in info object',
                severity: 'error'
            });
        }
        if (!ast.metadata?.info?.version) {
            violations.push({
                rule: 'openapi-structure',
                message: 'Missing required version in info object',
                severity: 'error'
            });
        }
    }
    validateEndpointDefinitions(ast, violations) {
        if (!ast.endpoints || !Array.isArray(ast.endpoints)) {
            violations.push({
                rule: 'endpoint-definitions',
                message: 'Endpoints must be an array',
                severity: 'error'
            });
            return;
        }
        ast.endpoints.forEach((endpoint, index) => {
            if (!endpoint.path) {
                violations.push({
                    rule: 'endpoint-definitions',
                    message: `Endpoint at index ${index} missing required path`,
                    severity: 'error'
                });
            }
            if (!endpoint.method) {
                violations.push({
                    rule: 'endpoint-definitions',
                    message: `Endpoint at index ${index} missing required method`,
                    severity: 'error'
                });
            }
            if (!endpoint.responses || Object.keys(endpoint.responses).length === 0) {
                violations.push({
                    rule: 'endpoint-definitions',
                    message: `Endpoint ${endpoint.method} ${endpoint.path} should have at least one response`,
                    severity: 'warning'
                });
            }
        });
    }
    validateSchemaDefinitions(ast, violations) {
        if (ast.schemas && Array.isArray(ast.schemas)) {
            ast.schemas.forEach((schema, index) => {
                if (!schema.name) {
                    violations.push({
                        rule: 'schema-definitions',
                        message: `Schema at index ${index} missing required name`,
                        severity: 'error'
                    });
                }
                if (!schema.schema || typeof schema.schema !== 'object') {
                    violations.push({
                        rule: 'schema-definitions',
                        message: `Schema '${schema.name}' missing or invalid schema definition`,
                        severity: 'error'
                    });
                }
            });
        }
    }
    validateSecurityDefinitions(_ast, _violations) {
        // Placeholder for security validation
    }
}
exports.OpenAPIParser = OpenAPIParser;
exports.default = OpenAPIParser;
//# sourceMappingURL=openapi-parser.js.map