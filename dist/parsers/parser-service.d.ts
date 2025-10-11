/**
 * Parser Service Implementation
 *
 * Multi-language parser service that converts various source code and specification formats
 * into a standardized AST format. Supports OpenAPI, JSDoc, Python docstrings, Go docs, and GraphQL.
 */
import { ApiSpecification } from '../core/models/api-spec';
import { DataModel } from '../core/models/schema';
/**
 * Parser Service API request/response interfaces based on parser-service.yaml contract
 */
export interface ParseRequest {
    type: 'openapi' | 'jsdoc' | 'python-docstring' | 'go-doc' | 'graphql' | 'express' | 'developer-guide' | 'changelog' | 'product-overview' | 'architecture' | 'user-guide' | 'security' | 'onboarding' | 'monitoring';
    source: 'file' | 'directory' | 'url' | 'content';
    path: string;
    options?: {
        validateSchema?: boolean;
        resolveRefs?: boolean;
        recursive?: boolean;
        include?: string[];
        exclude?: string[];
        parserSpecific?: Record<string, any>;
    };
}
export interface ParseResponse {
    status: 'success' | 'partial' | 'failed';
    parseId: string;
    ast?: {
        endpoints: any[];
        schemas: any[];
        components: any[];
        metadata: Record<string, any>;
    };
    metadata?: {
        sourceType: string;
        version: string;
        endpointCount: number;
        schemaCount: number;
        parseTime: number;
        fileSize: number;
    };
    warnings?: Array<{
        code: string;
        message: string;
        location?: {
            file: string;
            line: number;
            column: number;
        };
    }>;
    errors?: Array<{
        status: 'error';
        code: string;
        message: string;
        details: Record<string, any>;
        location?: {
            file: string;
            line: number;
            column: number;
        };
    }>;
}
export interface ExtractRequest {
    parseId: string;
    extractType: 'endpoints' | 'schemas' | 'components' | 'metadata';
    filters?: {
        tags?: string[];
        methods?: string[];
        paths?: string[];
    };
}
export interface ExtractResponse {
    extractId: string;
    data: Record<string, any>;
    count: number;
}
export interface ValidationRequest {
    parseId: string;
    rules?: string[];
}
export interface ValidationResponse {
    valid: boolean;
    violations?: Array<{
        rule: string;
        message: string;
        severity: 'error' | 'warning' | 'info';
        location?: {
            file: string;
            line: number;
            column: number;
        };
    }>;
}
/**
 * Parser Error types
 */
export declare class ParseError extends Error {
    readonly code: string;
    readonly location?: {
        file: string;
        line: number;
        column: number;
    } | undefined;
    readonly details?: Record<string, any> | undefined;
    constructor(message: string, code: string, location?: {
        file: string;
        line: number;
        column: number;
    } | undefined, details?: Record<string, any> | undefined);
}
/**
 * Base parser interface that all language-specific parsers must implement
 */
export interface IParser {
    readonly type: string;
    readonly supportedExtensions: string[];
    /**
     * Check if this parser can handle the given source
     */
    canParse(request: ParseRequest): boolean;
    /**
     * Parse the input source into standardized AST format
     */
    parse(request: ParseRequest): Promise<ParseResponse>;
    /**
     * Validate parsed content
     */
    validate?(ast: any, rules?: string[]): Promise<ValidationResponse>;
}
/**
 * Standardized AST format for all parsers
 */
export interface StandardizedAST {
    spec: ApiSpecification;
    endpoints: any[];
    schemas: DataModel[];
    components: any[];
    metadata: Record<string, any>;
}
/**
 * Parser registry for managing different parser implementations
 */
export declare class ParserRegistry {
    private parsers;
    /**
     * Register a parser for a specific type
     */
    register(type: string, parser: IParser): void;
    /**
     * Get a parser for a specific type
     */
    get(type: string): IParser | undefined;
    /**
     * Get all registered parser types
     */
    getTypes(): string[];
    /**
     * Find appropriate parser for a request
     */
    findParser(request: ParseRequest): IParser | undefined;
}
/**
 * Main Parser Service class implementing the parser API contract
 */
export declare class ParserService {
    private registry;
    private parseCache;
    private initialized;
    private initializationPromise;
    constructor();
    /**
     * Ensure parsers are initialized before use
     */
    private ensureInitialized;
    /**
     * Initialize and register all language parsers
     */
    private initializeParsers;
    /**
     * Parse input source
     * Implementation of POST /parse endpoint from parser-service.yaml
     */
    parse(request: ParseRequest): Promise<ParseResponse>;
    /**
     * Extract specific data from parsed AST
     * Implementation of POST /extract endpoint from parser-service.yaml
     */
    extract(request: ExtractRequest): Promise<ExtractResponse>;
    /**
     * Validate parsed AST structure
     * Implementation of POST /validate endpoint from parser-service.yaml
     */
    validate(request: ValidationRequest): Promise<ValidationResponse>;
    /**
     * Get available parser types
     */
    getAvailableTypes(): string[];
    /**
     * Clear parse cache
     */
    clearCache(): void;
    private validateParseRequest;
    private getCacheKey;
    private generateParseId;
    private generateExtractId;
    private findParseResult;
    private filterEndpoints;
    private filterSchemas;
    private filterComponents;
    private performBasicValidation;
    private validateRequiredFields;
    private validateSchemaConsistency;
    private validateEndpointFormat;
}
export default ParserService;
//# sourceMappingURL=parser-service.d.ts.map