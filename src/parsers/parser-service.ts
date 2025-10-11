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
  type: 'openapi' | 'jsdoc' | 'python-docstring' | 'go-doc' | 'graphql' | 'express'
    | 'developer-guide' | 'changelog' | 'product-overview' | 'architecture'
    | 'user-guide' | 'security' | 'onboarding' | 'monitoring';
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
export class ParseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly location?: {
      file: string;
      line: number;
      column: number;
    },
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ParseError';
  }
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
export class ParserRegistry {
  private parsers = new Map<string, IParser>();

  /**
   * Register a parser for a specific type
   */
  register(type: string, parser: IParser): void {
    this.parsers.set(type, parser);
  }

  /**
   * Get a parser for a specific type
   */
  get(type: string): IParser | undefined {
    return this.parsers.get(type);
  }

  /**
   * Get all registered parser types
   */
  getTypes(): string[] {
    return Array.from(this.parsers.keys());
  }

  /**
   * Find appropriate parser for a request
   */
  findParser(request: ParseRequest): IParser | undefined {
    const parser = this.parsers.get(request.type);
    if (parser && parser.canParse(request)) {
      return parser;
    }
    return undefined;
  }
}

/**
 * Main Parser Service class implementing the parser API contract
 */
export class ParserService {
  private registry: ParserRegistry;
  private parseCache = new Map<string, ParseResponse>();
  private initialized = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    this.registry = new ParserRegistry();
    // Don't call initializeParsers() here - make it lazy
  }

  /**
   * Ensure parsers are initialized before use
   */
  private async ensureInitialized(): Promise<void> {
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
  private async initializeParsers(): Promise<void> {
    // Dynamic imports to avoid circular dependencies and allow optional parsers
    try {
      const OpenAPIParser = (await import('./languages/openapi-parser')).default;
      this.registry.register('openapi', new OpenAPIParser());
    } catch (error) {
      console.warn('OpenAPI parser not available:', (error as Error).message);
    }

    try {
      const JSDocParser = (await import('./languages/jsdoc-parser')).default;
      this.registry.register('jsdoc', new JSDocParser());
    } catch (error) {
      console.warn('JSDoc parser not available:', (error as Error).message);
    }

    try {
      const PythonParser = (await import('./languages/python-parser')).default;
      this.registry.register('python-docstring', new PythonParser());
    } catch (error) {
      console.warn('Python parser not available:', (error as Error).message);
    }

    try {
      const GoDocParser = (await import('./languages/go-parser')).default;
      this.registry.register('go-doc', new GoDocParser());
    } catch (error) {
      console.warn('Go parser not available:', (error as Error).message);
    }

    try {
      const GraphQLParser = (await import('./languages/graphql-parser')).default;
      this.registry.register('graphql', new GraphQLParser());
    } catch (error) {
      console.warn('GraphQL parser not available:', (error as Error).message);
    }

    // Register new documentation parsers
    try {
      const DeveloperGuideParser = (await import('./languages/developer-guide-parser')).default;
      this.registry.register('developer-guide', new DeveloperGuideParser());
    } catch (error) {
      console.warn('Developer Guide parser not available:', (error as Error).message);
    }

    try {
      const ChangelogParser = (await import('./languages/changelog-parser')).default;
      this.registry.register('changelog', new ChangelogParser());
    } catch (error) {
      console.warn('Changelog parser not available:', (error as Error).message);
    }

    try {
      const ExpressParser = (await import('./languages/express-parser')).default;
      this.registry.register('express', new ExpressParser());
    } catch (error) {
      console.warn('Express parser not available:', (error as Error).message);
    }
    
    this.initialized = true;
  }

  /**
   * Parse input source
   * Implementation of POST /parse endpoint from parser-service.yaml
   */
  async parse(request: ParseRequest): Promise<ParseResponse> {
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
        throw new ParseError(
          `No parser available for type: ${request.type}`,
          'PARSER_NOT_FOUND'
        );
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

    } catch (error) {
      const parseId = this.generateParseId();
      
      if (error instanceof ParseError) {
        const baseError = {
          status: 'error' as const,
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
          message: (error as Error).message,
          details: {}
        }]
      };
    }
  }

  /**
   * Extract specific data from parsed AST
   * Implementation of POST /extract endpoint from parser-service.yaml
   */
  async extract(request: ExtractRequest): Promise<ExtractResponse> {
    try {
      // Ensure parsers are initialized
      await this.ensureInitialized();
      
      // Find the parsed AST by parseId
      const parseResult = this.findParseResult(request.parseId);
      if (!parseResult || !parseResult.ast) {
        throw new Error(`Parse result not found for ID: ${request.parseId}`);
      }

      const extractId = this.generateExtractId();
      let data: any = {};
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

    } catch (error) {
      throw new Error(`Extraction failed: ${(error as Error).message}`);
    }
  }

  /**
   * Validate parsed AST structure
   * Implementation of POST /validate endpoint from parser-service.yaml
   */
  async validate(request: ValidationRequest): Promise<ValidationResponse> {
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

    } catch (error) {
      return {
        valid: false,
        violations: [{
          rule: 'system',
          message: `Validation failed: ${(error as Error).message}`,
          severity: 'error'
        }]
      };
    }
  }

  /**
   * Get available parser types
   */
  getAvailableTypes(): string[] {
    return this.registry.getTypes();
  }

  /**
   * Clear parse cache
   */
  clearCache(): void {
    this.parseCache.clear();
  }

  // Private helper methods

  private validateParseRequest(request: ParseRequest): void {
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

  private getCacheKey(request: ParseRequest): string {
    return JSON.stringify({
      type: request.type,
      source: request.source,
      path: request.path,
      options: request.options
    });
  }

  private generateParseId(): string {
    return `parse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateExtractId(): string {
    return `extract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private findParseResult(parseId: string): ParseResponse | undefined {
    // In a real implementation, this would look up the result by ID
    // For now, return a mock result from cache
    for (const result of this.parseCache.values()) {
      if (result.parseId === parseId) {
        return result;
      }
    }
    return undefined;
  }

  private filterEndpoints(endpoints: any[], filters?: ExtractRequest['filters']): any[] {
    if (!filters) return endpoints;

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

  private filterSchemas(schemas: any[], filters?: ExtractRequest['filters']): any[] {
    if (!filters) return schemas;
    
    // Apply any schema-specific filtering here
    return schemas;
  }

  private filterComponents(components: any[], filters?: ExtractRequest['filters']): any[] {
    if (!filters) return components;
    
    // Apply any component-specific filtering here
    return components;
  }

  private async performBasicValidation(ast: any, rules?: string[]): Promise<ValidationResponse> {
    const violations: ValidationResponse['violations'] = [];

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

  private validateRequiredFields(ast: any, violations: ValidationResponse['violations']): void {
    // Check for required fields in endpoints
    if (ast.endpoints) {
      ast.endpoints.forEach((endpoint: any, index: number) => {
        if (!endpoint.path) {
          violations!.push({
            rule: 'required-fields',
            message: `Endpoint at index ${index} is missing required 'path' field`,
            severity: 'error'
          });
        }
        if (!endpoint.method) {
          violations!.push({
            rule: 'required-fields',
            message: `Endpoint at index ${index} is missing required 'method' field`,
            severity: 'error'
          });
        }
      });
    }
  }

  private validateSchemaConsistency(_ast: any, _violations: ValidationResponse['violations']): void {
    // Placeholder for schema consistency validation
  }

  private validateEndpointFormat(ast: any, violations: ValidationResponse['violations']): void {
    // Validate endpoint format
    if (ast.endpoints) {
      ast.endpoints.forEach((endpoint: any, index: number) => {
        if (endpoint.path && !endpoint.path.startsWith('/')) {
          violations!.push({
            rule: 'endpoint-format',
            message: `Endpoint path at index ${index} should start with '/'`,
            severity: 'warning'
          });
        }
      });
    }
  }
}

// Default export
export default ParserService;