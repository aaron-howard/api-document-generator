/**
 * Parsed endpoint models representing standardized API endpoint data
 * Extracted from various source formats (OpenAPI, JSDoc, source code, etc.)
 */

import { HttpMethod, SourceLocation } from './api-spec';
import { SchemaObject, SchemaType } from './schema';
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

export enum ParameterLocation {
  QUERY = 'query',
  PATH = 'path',
  HEADER = 'header',
  COOKIE = 'cookie',
  BODY = 'body', // For legacy formats
  FORM = 'formData', // For legacy formats
}

export enum ParameterStyle {
  MATRIX = 'matrix',
  LABEL = 'label',
  FORM = 'form',
  SIMPLE = 'simple',
  SPACE_DELIMITED = 'spaceDelimited',
  PIPE_DELIMITED = 'pipeDelimited',
  DEEP_OBJECT = 'deepObject',
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

export enum ExtractionMethod {
  OPENAPI_SPEC = 'openapi-spec',
  SWAGGER_SPEC = 'swagger-spec',
  JSDOC_COMMENT = 'jsdoc-comment',
  PYTHON_DOCSTRING = 'python-docstring',
  GO_COMMENT = 'go-comment',
  JAVA_ANNOTATION = 'java-annotation',
  CSHARP_ATTRIBUTE = 'csharp-attribute',
  AST_ANALYSIS = 'ast-analysis',
  RUNTIME_INSPECTION = 'runtime-inspection',
  MANUAL_ANNOTATION = 'manual-annotation',
}

export interface EndpointValidation {
  readonly isValid: boolean;
  readonly errors: ValidationError[];
  readonly warnings: ValidationWarning[];
  readonly suggestions: ValidationSuggestion[];
  readonly completeness: number; // 0-1 score
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
export class ParsedEndpointFactory {
  /**
   * Create a basic ParsedEndpoint with minimal required fields
   */
  static create(config: {
    method: HttpMethod;
    path: string;
    sourceLocation: EndpointSourceLocation;
    summary?: string;
    description?: string;
  }): ParsedEndpoint {
    const now = new Date();
    const hash = this.generateHash(config.method, config.path, config.sourceLocation);

    const result: ParsedEndpoint = {
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
      (result as any).summary = config.summary;
    }
    
    if (config.description !== undefined) {
      (result as any).description = config.description;
    }

    return result;
  }

  /**
   * Create ParsedEndpoint from OpenAPI operation
   */
  static fromOpenApiOperation(
    path: string,
    method: HttpMethod,
    operation: any,
    sourceLocation: EndpointSourceLocation
  ): ParsedEndpoint {
    const endpoint = this.create({
      method,
      path,
      sourceLocation,
      summary: operation.summary,
      description: operation.description,
    });

    // Add additional OpenAPI-specific data
    const result: ParsedEndpoint = {
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
      (result as any).operationId = operation.operationId;
    }

    if (operation.requestBody !== undefined) {
      (result as any).requestBody = this.parseOpenApiRequestBody(operation.requestBody);
    }

    return result;
  }

  /**
   * Create ParsedEndpoint from JSDoc comment
   */
  static fromJSDocComment(
    method: HttpMethod,
    path: string,
    jsDocData: any,
    sourceLocation: EndpointSourceLocation
  ): ParsedEndpoint {
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
      tags: jsDocData.tags?.map((tag: any) => tag.title) || [],
      deprecated: jsDocData.deprecated || false,
      metadata: {
        ...endpoint.metadata,
        extractionMethod: ExtractionMethod.JSDOC_COMMENT,
        confidence: 0.8,
        annotations: jsDocData.tags?.map((tag: any) => `@${tag.title}`) || [],
      },
    };
  }

  /**
   * Create ParsedEndpoint from Python docstring
   */
  static fromPythonDocstring(
    method: HttpMethod,
    path: string,
    docstringData: any,
    sourceLocation: EndpointSourceLocation
  ): ParsedEndpoint {
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

  private static generateId(method: HttpMethod, path: string): string {
    const cleanPath = path.replace(/[^a-zA-Z0-9]/g, '_');
    return `${method.toLowerCase()}_${cleanPath}_${Date.now()}`;
  }

  private static generateHash(method: HttpMethod, path: string, sourceLocation: EndpointSourceLocation): string {
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

  private static inferExtractionMethod(sourceType: InputSourceType): ExtractionMethod {
    switch (sourceType) {
      case InputSourceType.OPENAPI:
        return ExtractionMethod.OPENAPI_SPEC;
      case InputSourceType.SWAGGER:
        return ExtractionMethod.SWAGGER_SPEC;
      case InputSourceType.JSDOC:
        return ExtractionMethod.JSDOC_COMMENT;
      case InputSourceType.PYTHON_DOCSTRING:
        return ExtractionMethod.PYTHON_DOCSTRING;
      case InputSourceType.GO_DOC:
        return ExtractionMethod.GO_COMMENT;
      case InputSourceType.TYPESCRIPT:
      case InputSourceType.JAVASCRIPT:
      case InputSourceType.PYTHON:
      case InputSourceType.GO:
      case InputSourceType.JAVA:
      case InputSourceType.CSHARP:
        return ExtractionMethod.AST_ANALYSIS;
      default:
        return ExtractionMethod.AST_ANALYSIS;
    }
  }

  private static parseOpenApiParameters(parameters: any[]): EndpointParameter[] {
    return parameters.map((param, index) => ({
      id: `param_${index}_${param.name}`,
      name: param.name,
      in: param.in as ParameterLocation,
      description: param.description,
      required: param.required || false,
      schema: param.schema || { type: 'string' },
      example: param.example,
      deprecated: param.deprecated || false,
      style: param.style as ParameterStyle,
      explode: param.explode,
      allowEmptyValue: param.allowEmptyValue,
      allowReserved: param.allowReserved,
    }));
  }

  private static parseOpenApiRequestBody(requestBody: any): ParsedRequestBody {
    const content = Object.entries(requestBody.content || {}).map(([mediaType, mediaContent]: [string, any]) => ({
      mediaType,
      schema: mediaContent.schema || { type: 'object' },
      examples: mediaContent.examples ? Object.values(mediaContent.examples).map((ex: any) => ({
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

  private static parseOpenApiResponses(responses: any): ParsedResponse[] {
    return Object.entries(responses).map(([statusCode, response]: [string, any]) => ({
      statusCode,
      description: response.description || '',
      headers: response.headers ? this.parseResponseHeaders(response.headers) : [],
      content: response.content ? this.parseResponseContent(response.content) : [],
      links: response.links ? Object.values(response.links) : [],
    }));
  }

  private static parseResponseHeaders(headers: any): ResponseHeader[] {
    return Object.entries(headers).map(([name, header]: [string, any]) => ({
      name,
      description: header.description,
      required: header.required,
      schema: header.schema || { type: 'string' },
      example: header.example,
      deprecated: header.deprecated,
    }));
  }

  private static parseResponseContent(content: any): ContentType[] {
    return Object.entries(content).map(([mediaType, mediaContent]: [string, any]) => ({
      mediaType,
      schema: mediaContent.schema || { type: 'object' },
      examples: mediaContent.examples ? Object.values(mediaContent.examples) : [],
    }));
  }

  private static parseOpenApiSecurity(security: any[]): SecurityRequirement[] {
    return security.map((securityItem) => {
      const [scheme, scopes] = Object.entries(securityItem)[0] || ['', []];
      return {
        scheme,
        scopes: scopes as string[],
      };
    });
  }

  private static parseJSDocParameters(params: any[]): EndpointParameter[] {
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

  private static parseJSDocReturns(returns: any[]): ParsedResponse[] {
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

  private static parsePythonParameters(params: any[]): EndpointParameter[] {
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

  private static parsePythonReturns(returns: any[]): ParsedResponse[] {
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

  private static inferParameterLocation(paramName: string): ParameterLocation {
    if (paramName.toLowerCase().includes('id') || paramName.toLowerCase().includes('path')) {
      return ParameterLocation.PATH;
    }
    return ParameterLocation.QUERY;
  }

  private static jsDocTypeToSchema(type: any): SchemaObject {
    if (!type) return { type: SchemaType.STRING };
    
    const typeName = type.name || type;
    switch (typeName.toLowerCase()) {
      case 'string':
        return { type: SchemaType.STRING };
      case 'number':
        return { type: SchemaType.NUMBER };
      case 'boolean':
        return { type: SchemaType.BOOLEAN };
      case 'array':
        return { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } };
      case 'object':
        return { type: SchemaType.OBJECT };
      default:
        return { type: SchemaType.STRING };
    }
  }

  private static pythonTypeToSchema(typeName: any): SchemaObject {
    if (!typeName) return { type: SchemaType.STRING };
    
    switch (typeName.toLowerCase()) {
      case 'str':
      case 'string':
        return { type: SchemaType.STRING };
      case 'int':
      case 'integer':
        return { type: SchemaType.INTEGER };
      case 'float':
      case 'number':
        return { type: SchemaType.NUMBER };
      case 'bool':
      case 'boolean':
        return { type: SchemaType.BOOLEAN };
      case 'list':
      case 'array':
        return { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } };
      case 'dict':
      case 'object':
        return { type: SchemaType.OBJECT };
      default:
        return { type: SchemaType.STRING };
    }
  }

  private static validateOpenApiEndpoint(endpoint: ParsedEndpoint): EndpointValidation {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: ValidationSuggestion[] = [];

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
    if (endpoint.summary) completeness += 0.1;
    if (endpoint.description) completeness += 0.1;
    if (endpoint.parameters.length > 0) completeness += 0.1;
    if (endpoint.responses.length > 0) completeness += 0.2;
    if (endpoint.examples.length > 0) completeness += 0.1;

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      completeness: Math.min(completeness, 1.0),
    };
  }
}

/**
 * Utility functions for working with ParsedEndpoints
 */
export class ParsedEndpointUtils {
  /**
   * Check if two endpoints are equivalent
   */
  static areEquivalent(endpoint1: ParsedEndpoint, endpoint2: ParsedEndpoint): boolean {
    return (
      endpoint1.method === endpoint2.method &&
      endpoint1.path === endpoint2.path &&
      endpoint1.sourceLocation.filePath === endpoint2.sourceLocation.filePath
    );
  }

  /**
   * Get a display name for an endpoint
   */
  static getDisplayName(endpoint: ParsedEndpoint): string {
    return endpoint.summary || 
           endpoint.operationId || 
           `${endpoint.method.toUpperCase()} ${endpoint.path}`;
  }

  /**
   * Get all parameter names for an endpoint
   */
  static getParameterNames(endpoint: ParsedEndpoint): string[] {
    return endpoint.parameters.map(param => param.name);
  }

  /**
   * Get required parameters for an endpoint
   */
  static getRequiredParameters(endpoint: ParsedEndpoint): EndpointParameter[] {
    return endpoint.parameters.filter(param => param.required);
  }

  /**
   * Get successful response definitions
   */
  static getSuccessResponses(endpoint: ParsedEndpoint): ParsedResponse[] {
    return endpoint.responses.filter(response => {
      const code = parseInt(response.statusCode);
      return code >= 200 && code < 300;
    });
  }

  /**
   * Get error response definitions
   */
  static getErrorResponses(endpoint: ParsedEndpoint): ParsedResponse[] {
    return endpoint.responses.filter(response => {
      const code = parseInt(response.statusCode);
      return code >= 400;
    });
  }

  /**
   * Check if endpoint is complete (has all recommended fields)
   */
  static isComplete(endpoint: ParsedEndpoint): boolean {
    return endpoint.validation.completeness >= 0.8;
  }

  /**
   * Get endpoint complexity score (0-1, higher = more complex)
   */
  static getComplexityScore(endpoint: ParsedEndpoint): number {
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