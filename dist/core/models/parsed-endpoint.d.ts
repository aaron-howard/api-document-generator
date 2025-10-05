/**
 * Parsed endpoint models representing standardized API endpoint data
 * Extracted from various source formats (OpenAPI, JSDoc, source code, etc.)
 */
import { HttpMethod, SourceLocation } from './api-spec';
import { SchemaObject } from './schema';
import { InputSourceType } from './input-source';
export interface ParsedEndpoint {
    readonly id: string;
    readonly method: HttpMethod;
    readonly path: string;
    readonly operationId?: string;
    readonly summary?: string;
    readonly description?: string;
    readonly parameters: EndpointParameter[];
    readonly requestBody?: ParsedRequestBody;
    readonly responses: ParsedResponse[];
    readonly tags: string[];
    readonly deprecated: boolean;
    readonly security: SecurityRequirement[];
    readonly examples: EndpointExample[];
    readonly sourceLocation: EndpointSourceLocation;
    readonly metadata: EndpointMetadata;
    readonly validation: EndpointValidation;
}
export interface EndpointParameter {
    readonly id: string;
    readonly name: string;
    readonly in: ParameterLocation;
    readonly description?: string;
    readonly required: boolean;
    readonly schema: SchemaObject;
    readonly example?: any;
    readonly examples?: ParameterExample[];
    readonly deprecated: boolean;
    readonly style?: ParameterStyle;
    readonly explode?: boolean;
    readonly allowEmptyValue?: boolean;
    readonly allowReserved?: boolean;
    readonly sourceLocation?: SourceLocation;
}
export declare enum ParameterLocation {
    QUERY = "query",
    PATH = "path",
    HEADER = "header",
    COOKIE = "cookie",
    BODY = "body",// For legacy formats
    FORM = "formData"
}
export declare enum ParameterStyle {
    MATRIX = "matrix",
    LABEL = "label",
    FORM = "form",
    SIMPLE = "simple",
    SPACE_DELIMITED = "spaceDelimited",
    PIPE_DELIMITED = "pipeDelimited",
    DEEP_OBJECT = "deepObject"
}
export interface ParameterExample {
    readonly name?: string;
    readonly summary?: string;
    readonly description?: string;
    readonly value: any;
    readonly externalValue?: string;
}
export interface ParsedRequestBody {
    readonly description?: string;
    readonly required: boolean;
    readonly content: ContentType[];
    readonly examples?: RequestBodyExample[];
    readonly sourceLocation?: SourceLocation;
}
export interface ContentType {
    readonly mediaType: string;
    readonly schema: SchemaObject;
    readonly examples?: ContentExample[];
    readonly encoding?: Record<string, EncodingObject>;
}
export interface EncodingObject {
    readonly contentType?: string;
    readonly headers?: Record<string, EndpointParameter>;
    readonly style?: ParameterStyle;
    readonly explode?: boolean;
    readonly allowReserved?: boolean;
}
export interface RequestBodyExample {
    readonly name?: string;
    readonly summary?: string;
    readonly description?: string;
    readonly value: any;
    readonly mediaType: string;
}
export interface ParsedResponse {
    readonly statusCode: string;
    readonly description: string;
    readonly headers?: ResponseHeader[];
    readonly content?: ContentType[];
    readonly links?: ResponseLink[];
    readonly examples?: ResponseExample[];
    readonly sourceLocation?: SourceLocation;
}
export interface ResponseHeader {
    readonly name: string;
    readonly description?: string;
    readonly required?: boolean;
    readonly schema: SchemaObject;
    readonly example?: any;
    readonly deprecated?: boolean;
}
export interface ResponseLink {
    readonly operationRef?: string;
    readonly operationId?: string;
    readonly parameters?: Record<string, any>;
    readonly requestBody?: any;
    readonly description?: string;
    readonly server?: ServerReference;
}
export interface ServerReference {
    readonly url: string;
    readonly description?: string;
    readonly variables?: Record<string, ServerVariable>;
}
export interface ServerVariable {
    readonly enum?: string[];
    readonly default: string;
    readonly description?: string;
}
export interface ResponseExample {
    readonly name?: string;
    readonly summary?: string;
    readonly description?: string;
    readonly value: any;
    readonly mediaType: string;
    readonly statusCode: string;
}
export interface ContentExample {
    readonly name?: string;
    readonly summary?: string;
    readonly description?: string;
    readonly value: any;
}
export interface EndpointExample {
    readonly id: string;
    readonly name?: string;
    readonly summary?: string;
    readonly description?: string;
    readonly request?: ExampleRequest;
    readonly response?: ExampleResponse;
    readonly scenario?: string;
    readonly tags?: string[];
}
export interface ExampleRequest {
    readonly method: HttpMethod;
    readonly path: string;
    readonly headers?: Record<string, string>;
    readonly queryParameters?: Record<string, any>;
    readonly pathParameters?: Record<string, any>;
    readonly body?: any;
    readonly mediaType?: string;
}
export interface ExampleResponse {
    readonly statusCode: string;
    readonly headers?: Record<string, string>;
    readonly body?: any;
    readonly mediaType?: string;
}
export interface SecurityRequirement {
    readonly scheme: string;
    readonly scopes: string[];
}
export interface EndpointSourceLocation {
    readonly inputSourceId: string;
    readonly sourceType: InputSourceType;
    readonly filePath: string;
    readonly startLine: number;
    readonly endLine: number;
    readonly startColumn?: number;
    readonly endColumn?: number;
    readonly functionName?: string;
    readonly className?: string;
    readonly namespace?: string;
    readonly module?: string;
}
export interface EndpointMetadata {
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly version?: string;
    readonly hash: string;
    readonly confidence: number;
    readonly extractionMethod: ExtractionMethod;
    readonly language?: string;
    readonly framework?: string;
    readonly annotations?: string[];
    readonly customFields?: Record<string, any>;
}
export declare enum ExtractionMethod {
    OPENAPI_SPEC = "openapi-spec",
    SWAGGER_SPEC = "swagger-spec",
    JSDOC_COMMENT = "jsdoc-comment",
    PYTHON_DOCSTRING = "python-docstring",
    GO_COMMENT = "go-comment",
    JAVA_ANNOTATION = "java-annotation",
    CSHARP_ATTRIBUTE = "csharp-attribute",
    AST_ANALYSIS = "ast-analysis",
    RUNTIME_INSPECTION = "runtime-inspection",
    MANUAL_ANNOTATION = "manual-annotation"
}
export interface EndpointValidation {
    readonly isValid: boolean;
    readonly errors: ValidationError[];
    readonly warnings: ValidationWarning[];
    readonly suggestions: ValidationSuggestion[];
    readonly completeness: number;
}
export interface ValidationError {
    readonly code: string;
    readonly message: string;
    readonly field?: string;
    readonly severity: 'error' | 'warning' | 'info';
    readonly rule: string;
    readonly fixable: boolean;
    readonly suggestion?: string;
}
export interface ValidationWarning {
    readonly code: string;
    readonly message: string;
    readonly field?: string;
    readonly rule: string;
    readonly impact: 'high' | 'medium' | 'low';
}
export interface ValidationSuggestion {
    readonly type: 'enhancement' | 'documentation' | 'example' | 'security';
    readonly message: string;
    readonly field?: string;
    readonly priority: 'high' | 'medium' | 'low';
    readonly automated: boolean;
}
/**
 * Factory for creating ParsedEndpoint instances
 */
export declare class ParsedEndpointFactory {
    /**
     * Create a basic ParsedEndpoint with minimal required fields
     */
    static create(config: {
        method: HttpMethod;
        path: string;
        sourceLocation: EndpointSourceLocation;
        summary?: string;
        description?: string;
    }): ParsedEndpoint;
    /**
     * Create ParsedEndpoint from OpenAPI operation
     */
    static fromOpenApiOperation(path: string, method: HttpMethod, operation: any, sourceLocation: EndpointSourceLocation): ParsedEndpoint;
    /**
     * Create ParsedEndpoint from JSDoc comment
     */
    static fromJSDocComment(method: HttpMethod, path: string, jsDocData: any, sourceLocation: EndpointSourceLocation): ParsedEndpoint;
    /**
     * Create ParsedEndpoint from Python docstring
     */
    static fromPythonDocstring(method: HttpMethod, path: string, docstringData: any, sourceLocation: EndpointSourceLocation): ParsedEndpoint;
    private static generateId;
    private static generateHash;
    private static inferExtractionMethod;
    private static parseOpenApiParameters;
    private static parseOpenApiRequestBody;
    private static parseOpenApiResponses;
    private static parseResponseHeaders;
    private static parseResponseContent;
    private static parseOpenApiSecurity;
    private static parseJSDocParameters;
    private static parseJSDocReturns;
    private static parsePythonParameters;
    private static parsePythonReturns;
    private static inferParameterLocation;
    private static jsDocTypeToSchema;
    private static pythonTypeToSchema;
    private static validateOpenApiEndpoint;
}
/**
 * Utility functions for working with ParsedEndpoints
 */
export declare class ParsedEndpointUtils {
    /**
     * Check if two endpoints are equivalent
     */
    static areEquivalent(endpoint1: ParsedEndpoint, endpoint2: ParsedEndpoint): boolean;
    /**
     * Get a display name for an endpoint
     */
    static getDisplayName(endpoint: ParsedEndpoint): string;
    /**
     * Get all parameter names for an endpoint
     */
    static getParameterNames(endpoint: ParsedEndpoint): string[];
    /**
     * Get required parameters for an endpoint
     */
    static getRequiredParameters(endpoint: ParsedEndpoint): EndpointParameter[];
    /**
     * Get successful response definitions
     */
    static getSuccessResponses(endpoint: ParsedEndpoint): ParsedResponse[];
    /**
     * Get error response definitions
     */
    static getErrorResponses(endpoint: ParsedEndpoint): ParsedResponse[];
    /**
     * Check if endpoint is complete (has all recommended fields)
     */
    static isComplete(endpoint: ParsedEndpoint): boolean;
    /**
     * Get endpoint complexity score (0-1, higher = more complex)
     */
    static getComplexityScore(endpoint: ParsedEndpoint): number;
}
//# sourceMappingURL=parsed-endpoint.d.ts.map