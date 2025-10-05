"use strict";
/**
 * Parsed endpoint models representing standardized API endpoint data
 * Extracted from various source formats (OpenAPI, JSDoc, source code, etc.)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedEndpointUtils = exports.ParsedEndpointFactory = exports.ExtractionMethod = exports.ParameterStyle = exports.ParameterLocation = void 0;
const schema_1 = require("./schema");
const input_source_1 = require("./input-source");
var ParameterLocation;
(function (ParameterLocation) {
    ParameterLocation["QUERY"] = "query";
    ParameterLocation["PATH"] = "path";
    ParameterLocation["HEADER"] = "header";
    ParameterLocation["COOKIE"] = "cookie";
    ParameterLocation["BODY"] = "body";
    ParameterLocation["FORM"] = "formData";
})(ParameterLocation || (exports.ParameterLocation = ParameterLocation = {}));
var ParameterStyle;
(function (ParameterStyle) {
    ParameterStyle["MATRIX"] = "matrix";
    ParameterStyle["LABEL"] = "label";
    ParameterStyle["FORM"] = "form";
    ParameterStyle["SIMPLE"] = "simple";
    ParameterStyle["SPACE_DELIMITED"] = "spaceDelimited";
    ParameterStyle["PIPE_DELIMITED"] = "pipeDelimited";
    ParameterStyle["DEEP_OBJECT"] = "deepObject";
})(ParameterStyle || (exports.ParameterStyle = ParameterStyle = {}));
var ExtractionMethod;
(function (ExtractionMethod) {
    ExtractionMethod["OPENAPI_SPEC"] = "openapi-spec";
    ExtractionMethod["SWAGGER_SPEC"] = "swagger-spec";
    ExtractionMethod["JSDOC_COMMENT"] = "jsdoc-comment";
    ExtractionMethod["PYTHON_DOCSTRING"] = "python-docstring";
    ExtractionMethod["GO_COMMENT"] = "go-comment";
    ExtractionMethod["JAVA_ANNOTATION"] = "java-annotation";
    ExtractionMethod["CSHARP_ATTRIBUTE"] = "csharp-attribute";
    ExtractionMethod["AST_ANALYSIS"] = "ast-analysis";
    ExtractionMethod["RUNTIME_INSPECTION"] = "runtime-inspection";
    ExtractionMethod["MANUAL_ANNOTATION"] = "manual-annotation";
})(ExtractionMethod || (exports.ExtractionMethod = ExtractionMethod = {}));
/**
 * Factory for creating ParsedEndpoint instances
 */
class ParsedEndpointFactory {
    /**
     * Create a basic ParsedEndpoint with minimal required fields
     */
    static create(config) {
        const now = new Date();
        const hash = this.generateHash(config.method, config.path, config.sourceLocation);
        const result = {
            id: this.generateId(config.method, config.path),
            method: config.method,
            path: config.path,
            parameters: [],
            responses: [],
            tags: [],
            deprecated: false,
            security: [],
            examples: [],
            sourceLocation: config.sourceLocation,
            metadata: {
                createdAt: now,
                updatedAt: now,
                hash,
                confidence: 1.0,
                extractionMethod: this.inferExtractionMethod(config.sourceLocation.sourceType),
            },
            validation: {
                isValid: true,
                errors: [],
                warnings: [],
                suggestions: [],
                completeness: 0.5, // Basic endpoint has moderate completeness
            },
        };
        if (config.summary !== undefined) {
            result.summary = config.summary;
        }
        if (config.description !== undefined) {
            result.description = config.description;
        }
        return result;
    }
    /**
     * Create ParsedEndpoint from OpenAPI operation
     */
    static fromOpenApiOperation(path, method, operation, sourceLocation) {
        const endpoint = this.create({
            method,
            path,
            sourceLocation,
            summary: operation.summary,
            description: operation.description,
        });
        // Add additional OpenAPI-specific data
        const result = {
            ...endpoint,
            parameters: this.parseOpenApiParameters(operation.parameters || []),
            responses: this.parseOpenApiResponses(operation.responses || {}),
            tags: operation.tags || [],
            deprecated: operation.deprecated || false,
            security: this.parseOpenApiSecurity(operation.security || []),
            metadata: {
                ...endpoint.metadata,
                extractionMethod: ExtractionMethod.OPENAPI_SPEC,
                confidence: 0.95,
            },
            validation: this.validateOpenApiEndpoint(endpoint),
        };
        if (operation.operationId !== undefined) {
            result.operationId = operation.operationId;
        }
        if (operation.requestBody !== undefined) {
            result.requestBody = this.parseOpenApiRequestBody(operation.requestBody);
        }
        return result;
    }
    /**
     * Create ParsedEndpoint from JSDoc comment
     */
    static fromJSDocComment(method, path, jsDocData, sourceLocation) {
        const endpoint = this.create({
            method,
            path,
            sourceLocation,
            summary: jsDocData.summary,
            description: jsDocData.description,
        });
        return {
            ...endpoint,
            parameters: this.parseJSDocParameters(jsDocData.params || []),
            responses: this.parseJSDocReturns(jsDocData.returns || []),
            tags: jsDocData.tags?.map((tag) => tag.title) || [],
            deprecated: jsDocData.deprecated || false,
            metadata: {
                ...endpoint.metadata,
                extractionMethod: ExtractionMethod.JSDOC_COMMENT,
                confidence: 0.8,
                annotations: jsDocData.tags?.map((tag) => `@${tag.title}`) || [],
            },
        };
    }
    /**
     * Create ParsedEndpoint from Python docstring
     */
    static fromPythonDocstring(method, path, docstringData, sourceLocation) {
        const endpoint = this.create({
            method,
            path,
            sourceLocation,
            summary: docstringData.short_description,
            description: docstringData.long_description,
        });
        return {
            ...endpoint,
            parameters: this.parsePythonParameters(docstringData.params || []),
            responses: this.parsePythonReturns(docstringData.returns || []),
            metadata: {
                ...endpoint.metadata,
                extractionMethod: ExtractionMethod.PYTHON_DOCSTRING,
                confidence: 0.75,
                language: 'python',
            },
        };
    }
    static generateId(method, path) {
        const cleanPath = path.replace(/[^a-zA-Z0-9]/g, '_');
        return `${method.toLowerCase()}_${cleanPath}_${Date.now()}`;
    }
    static generateHash(method, path, sourceLocation) {
        const data = `${method}:${path}:${sourceLocation.filePath}:${sourceLocation.startLine}`;
        // Simple hash implementation - in production, use a proper hash function
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }
    static inferExtractionMethod(sourceType) {
        switch (sourceType) {
            case input_source_1.InputSourceType.OPENAPI:
                return ExtractionMethod.OPENAPI_SPEC;
            case input_source_1.InputSourceType.SWAGGER:
                return ExtractionMethod.SWAGGER_SPEC;
            case input_source_1.InputSourceType.JSDOC:
                return ExtractionMethod.JSDOC_COMMENT;
            case input_source_1.InputSourceType.PYTHON_DOCSTRING:
                return ExtractionMethod.PYTHON_DOCSTRING;
            case input_source_1.InputSourceType.GO_DOC:
                return ExtractionMethod.GO_COMMENT;
            case input_source_1.InputSourceType.TYPESCRIPT:
            case input_source_1.InputSourceType.JAVASCRIPT:
            case input_source_1.InputSourceType.PYTHON:
            case input_source_1.InputSourceType.GO:
            case input_source_1.InputSourceType.JAVA:
            case input_source_1.InputSourceType.CSHARP:
                return ExtractionMethod.AST_ANALYSIS;
            default:
                return ExtractionMethod.AST_ANALYSIS;
        }
    }
    static parseOpenApiParameters(parameters) {
        return parameters.map((param, index) => ({
            id: `param_${index}_${param.name}`,
            name: param.name,
            in: param.in,
            description: param.description,
            required: param.required || false,
            schema: param.schema || { type: 'string' },
            example: param.example,
            deprecated: param.deprecated || false,
            style: param.style,
            explode: param.explode,
            allowEmptyValue: param.allowEmptyValue,
            allowReserved: param.allowReserved,
        }));
    }
    static parseOpenApiRequestBody(requestBody) {
        const content = Object.entries(requestBody.content || {}).map(([mediaType, mediaContent]) => ({
            mediaType,
            schema: mediaContent.schema || { type: 'object' },
            examples: mediaContent.examples ? Object.values(mediaContent.examples).map((ex) => ({
                name: ex.summary,
                summary: ex.summary,
                description: ex.description,
                value: ex.value,
            })) : [],
            encoding: mediaContent.encoding,
        }));
        return {
            description: requestBody.description,
            required: requestBody.required || false,
            content,
        };
    }
    static parseOpenApiResponses(responses) {
        return Object.entries(responses).map(([statusCode, response]) => ({
            statusCode,
            description: response.description || '',
            headers: response.headers ? this.parseResponseHeaders(response.headers) : [],
            content: response.content ? this.parseResponseContent(response.content) : [],
            links: response.links ? Object.values(response.links) : [],
        }));
    }
    static parseResponseHeaders(headers) {
        return Object.entries(headers).map(([name, header]) => ({
            name,
            description: header.description,
            required: header.required,
            schema: header.schema || { type: 'string' },
            example: header.example,
            deprecated: header.deprecated,
        }));
    }
    static parseResponseContent(content) {
        return Object.entries(content).map(([mediaType, mediaContent]) => ({
            mediaType,
            schema: mediaContent.schema || { type: 'object' },
            examples: mediaContent.examples ? Object.values(mediaContent.examples) : [],
        }));
    }
    static parseOpenApiSecurity(security) {
        return security.map((securityItem) => {
            const [scheme, scopes] = Object.entries(securityItem)[0] || ['', []];
            return {
                scheme,
                scopes: scopes,
            };
        });
    }
    static parseJSDocParameters(params) {
        return params.map((param, index) => ({
            id: `jsdoc_param_${index}_${param.name}`,
            name: param.name,
            in: this.inferParameterLocation(param.name),
            description: param.description,
            required: !param.optional,
            schema: this.jsDocTypeToSchema(param.type),
            deprecated: false,
        }));
    }
    static parseJSDocReturns(returns) {
        if (returns.length === 0) {
            return [{
                    statusCode: '200',
                    description: 'Success',
                }];
        }
        return returns.map((ret, index) => ({
            statusCode: index === 0 ? '200' : '400',
            description: ret.description || 'Response',
            content: [{
                    mediaType: 'application/json',
                    schema: this.jsDocTypeToSchema(ret.type),
                }],
        }));
    }
    static parsePythonParameters(params) {
        return params.map((param, index) => ({
            id: `python_param_${index}_${param.arg_name}`,
            name: param.arg_name,
            in: this.inferParameterLocation(param.arg_name),
            description: param.description,
            required: !param.is_optional,
            schema: this.pythonTypeToSchema(param.type_name),
            deprecated: false,
        }));
    }
    static parsePythonReturns(returns) {
        if (returns.length === 0) {
            return [{
                    statusCode: '200',
                    description: 'Success',
                }];
        }
        return returns.map((ret, index) => ({
            statusCode: index === 0 ? '200' : '400',
            description: ret.description || 'Response',
            content: [{
                    mediaType: 'application/json',
                    schema: this.pythonTypeToSchema(ret.type_name),
                }],
        }));
    }
    static inferParameterLocation(paramName) {
        if (paramName.toLowerCase().includes('id') || paramName.toLowerCase().includes('path')) {
            return ParameterLocation.PATH;
        }
        return ParameterLocation.QUERY;
    }
    static jsDocTypeToSchema(type) {
        if (!type)
            return { type: schema_1.SchemaType.STRING };
        const typeName = type.name || type;
        switch (typeName.toLowerCase()) {
            case 'string':
                return { type: schema_1.SchemaType.STRING };
            case 'number':
                return { type: schema_1.SchemaType.NUMBER };
            case 'boolean':
                return { type: schema_1.SchemaType.BOOLEAN };
            case 'array':
                return { type: schema_1.SchemaType.ARRAY, items: { type: schema_1.SchemaType.STRING } };
            case 'object':
                return { type: schema_1.SchemaType.OBJECT };
            default:
                return { type: schema_1.SchemaType.STRING };
        }
    }
    static pythonTypeToSchema(typeName) {
        if (!typeName)
            return { type: schema_1.SchemaType.STRING };
        switch (typeName.toLowerCase()) {
            case 'str':
            case 'string':
                return { type: schema_1.SchemaType.STRING };
            case 'int':
            case 'integer':
                return { type: schema_1.SchemaType.INTEGER };
            case 'float':
            case 'number':
                return { type: schema_1.SchemaType.NUMBER };
            case 'bool':
            case 'boolean':
                return { type: schema_1.SchemaType.BOOLEAN };
            case 'list':
            case 'array':
                return { type: schema_1.SchemaType.ARRAY, items: { type: schema_1.SchemaType.STRING } };
            case 'dict':
            case 'object':
                return { type: schema_1.SchemaType.OBJECT };
            default:
                return { type: schema_1.SchemaType.STRING };
        }
    }
    static validateOpenApiEndpoint(endpoint) {
        const errors = [];
        const warnings = [];
        const suggestions = [];
        // Validate required fields
        if (!endpoint.summary) {
            warnings.push({
                code: 'MISSING_SUMMARY',
                message: 'Endpoint summary is missing',
                rule: 'openapi-summary-required',
                impact: 'medium',
            });
        }
        if (endpoint.responses.length === 0) {
            errors.push({
                code: 'NO_RESPONSES',
                message: 'Endpoint must have at least one response definition',
                severity: 'error',
                rule: 'openapi-responses-required',
                fixable: true,
                suggestion: 'Add a 200 response with appropriate schema',
            });
        }
        // Calculate completeness score
        let completeness = 0.5; // Base score
        if (endpoint.summary)
            completeness += 0.1;
        if (endpoint.description)
            completeness += 0.1;
        if (endpoint.parameters.length > 0)
            completeness += 0.1;
        if (endpoint.responses.length > 0)
            completeness += 0.2;
        if (endpoint.examples.length > 0)
            completeness += 0.1;
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            suggestions,
            completeness: Math.min(completeness, 1.0),
        };
    }
}
exports.ParsedEndpointFactory = ParsedEndpointFactory;
/**
 * Utility functions for working with ParsedEndpoints
 */
class ParsedEndpointUtils {
    /**
     * Check if two endpoints are equivalent
     */
    static areEquivalent(endpoint1, endpoint2) {
        return (endpoint1.method === endpoint2.method &&
            endpoint1.path === endpoint2.path &&
            endpoint1.sourceLocation.filePath === endpoint2.sourceLocation.filePath);
    }
    /**
     * Get a display name for an endpoint
     */
    static getDisplayName(endpoint) {
        return endpoint.summary ||
            endpoint.operationId ||
            `${endpoint.method.toUpperCase()} ${endpoint.path}`;
    }
    /**
     * Get all parameter names for an endpoint
     */
    static getParameterNames(endpoint) {
        return endpoint.parameters.map(param => param.name);
    }
    /**
     * Get required parameters for an endpoint
     */
    static getRequiredParameters(endpoint) {
        return endpoint.parameters.filter(param => param.required);
    }
    /**
     * Get successful response definitions
     */
    static getSuccessResponses(endpoint) {
        return endpoint.responses.filter(response => {
            const code = parseInt(response.statusCode);
            return code >= 200 && code < 300;
        });
    }
    /**
     * Get error response definitions
     */
    static getErrorResponses(endpoint) {
        return endpoint.responses.filter(response => {
            const code = parseInt(response.statusCode);
            return code >= 400;
        });
    }
    /**
     * Check if endpoint is complete (has all recommended fields)
     */
    static isComplete(endpoint) {
        return endpoint.validation.completeness >= 0.8;
    }
    /**
     * Get endpoint complexity score (0-1, higher = more complex)
     */
    static getComplexityScore(endpoint) {
        let score = 0;
        // Base complexity
        score += 0.1;
        // Parameters add complexity
        score += endpoint.parameters.length * 0.05;
        // Request body adds complexity
        if (endpoint.requestBody) {
            score += 0.2;
        }
        // Multiple responses add complexity
        score += endpoint.responses.length * 0.05;
        // Security requirements add complexity
        score += endpoint.security.length * 0.1;
        return Math.min(score, 1.0);
    }
}
exports.ParsedEndpointUtils = ParsedEndpointUtils;
//# sourceMappingURL=parsed-endpoint.js.map