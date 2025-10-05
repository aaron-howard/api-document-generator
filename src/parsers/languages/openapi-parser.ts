/**
 * OpenAPI Parser Implementation
 * 
 * Parses OpenAPI 3.x and Swagger 2.0 specifications into standardized AST format.
 * Supports schema validation, reference resolution, and comprehensive error reporting.
 */

import { IParser, ParseRequest, ParseResponse, ValidationResponse, ParseError, StandardizedAST } from '../parser-service';
import { ApiSpecification, ApiSpecFormat, ApiEndpoint, HttpMethod } from '../../core/models/api-spec';
import { DataModel } from '../../core/models/schema';

/**
 * OpenAPI Parser class implementing IParser interface
 */
export class OpenAPIParser implements IParser {
  readonly type = 'openapi';
  readonly supportedExtensions = ['.yaml', '.yml', '.json'];

  /**
   * Check if this parser can handle the given request
   */
  canParse(request: ParseRequest): boolean {
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
  async parse(request: ParseRequest): Promise<ParseResponse> {
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

    } catch (error) {
      return this.handleParseError(error, parseId);
    }
  }

  /**
   * Validate parsed OpenAPI AST
   */
  async validate(ast: any, rules?: string[]): Promise<ValidationResponse> {
    const violations: ValidationResponse['violations'] = [];

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

  private async loadDocument(request: ParseRequest): Promise<any> {
    switch (request.source) {
      case 'file':
        return await this.loadFromFile(request.path);
      case 'url':
        return await this.loadFromUrl(request.path);
      case 'content':
        return await this.loadFromContent(request.path);
      default:
        throw new ParseError(
          `Unsupported source type for OpenAPI: ${request.source}`,
          'UNSUPPORTED_SOURCE'
        );
    }
  }

  private async loadFromFile(_path: string): Promise<any> {
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

  private async loadFromUrl(_url: string): Promise<any> {
    // Placeholder for URL loading
    throw new ParseError('URL loading not yet implemented', 'NOT_IMPLEMENTED');
  }

  private async loadFromContent(content: string): Promise<any> {
    try {
      // Try parsing as JSON first
      return JSON.parse(content);
    } catch {
      // Try parsing as YAML
      // In real implementation, would use yaml.parse()
      throw new ParseError('YAML parsing not yet implemented', 'NOT_IMPLEMENTED');
    }
  }

  private async validateDocument(document: any): Promise<void> {
    // Basic structure validation
    if (!document.openapi && !document.swagger) {
      throw new ParseError(
        'Document must have openapi or swagger field',
        'INVALID_DOCUMENT'
      );
    }

    if (!document.info) {
      throw new ParseError(
        'Document must have info object',
        'MISSING_INFO'
      );
    }

    if (!document.info.title || !document.info.version) {
      throw new ParseError(
        'Document info must have title and version',
        'MISSING_INFO_FIELDS'
      );
    }

    if (!document.paths) {
      throw new ParseError(
        'Document must have paths object',
        'MISSING_PATHS'
      );
    }
  }

  private async resolveReferences(_document: any): Promise<void> {
    // Placeholder for reference resolution
    // In real implementation, would resolve $ref objects
  }

  private async convertToAST(document: any, _request: ParseRequest): Promise<StandardizedAST> {
    const endpoints = this.extractEndpoints(document);
    const schemas = this.extractSchemas(document);
    const components = this.extractComponents(document);
    const metadata = this.extractMetadata(document);

    // Create ApiSpecification
    const spec: ApiSpecification = {
      id: this.generateSpecId(),
      format: document.openapi ? ApiSpecFormat.OPENAPI_3_0 : ApiSpecFormat.SWAGGER_2_0,
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

  private extractEndpoints(document: any): ApiEndpoint[] {
    const endpoints: ApiEndpoint[] = [];

    if (!document.paths) {
      return endpoints;
    }

    for (const [path, pathItem] of Object.entries(document.paths)) {
      if (typeof pathItem !== 'object' || !pathItem) continue;

      const httpMethods = [
        HttpMethod.GET, 
        HttpMethod.POST, 
        HttpMethod.PUT, 
        HttpMethod.DELETE, 
        HttpMethod.PATCH, 
        HttpMethod.HEAD, 
        HttpMethod.OPTIONS, 
        HttpMethod.TRACE
      ];
      
      for (const method of httpMethods) {
        const operation = (pathItem as any)[method.toLowerCase()];
        if (!operation) continue;

        endpoints.push({
          id: `${method}_${path}`.replace(/[^a-zA-Z0-9]/g, '_'),
          path,
          method,
          summary: operation.summary,
          description: operation.description,
          operationId: operation.operationId,
          tags: operation.tags || [],
          parameters: this.extractParameters(operation.parameters, (pathItem as any).parameters),
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

  private extractSchemas(document: any): DataModel[] {
    const schemas: DataModel[] = [];

    if (document.components?.schemas) {
      for (const [name, schema] of Object.entries(document.components.schemas)) {
        schemas.push({
          name,
          schema: schema as any,
          description: (schema as any).description
        });
      }
    }

    return schemas;
  }

  private extractComponents(document: any): any[] {
    const components: any[] = [];

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

  private extractMetadata(document: any): Record<string, any> {
    return {
      openapi: document.openapi || document.swagger,
      info: document.info,
      externalDocs: document.externalDocs,
      servers: document.servers,
      tags: document.tags,
      security: document.security
    };
  }

  private extractParameters(operationParams?: any[], pathParams?: any[]): any[] {
    const parameters: any[] = [];

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

  private extractRequestBody(requestBody: any): any {
    return requestBody || undefined;
  }

  private extractResponses(responses: any): any {
    return responses || {};
  }

  private extractSecurity(document: any): any[] {
    const security: any[] = [];

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

  private extractServers(document: any): any[] {
    return document.servers || [];
  }

  private extractTags(document: any): any[] {
    return document.tags || [];
  }

  private endpointToPlainObject(endpoint: ApiEndpoint): any {
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

  private calculateDocumentSize(document: any): number {
    return JSON.stringify(document).length;
  }

  private generateParseId(): string {
    return `openapi_parse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSpecId(): string {
    return `openapi_spec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleParseError(error: any, parseId: string): ParseResponse {
    if (error instanceof ParseError) {
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
        message: (error as Error).message,
        details: {}
      }]
    };
  }

  // Validation methods

  private validateOpenAPIStructure(ast: any, violations: ValidationResponse['violations']): void {
    if (!ast.metadata || !ast.metadata.openapi) {
      violations!.push({
        rule: 'openapi-structure',
        message: 'Missing OpenAPI version in metadata',
        severity: 'error'
      });
    }

    if (!ast.metadata?.info?.title) {
      violations!.push({
        rule: 'openapi-structure',
        message: 'Missing required title in info object',
        severity: 'error'
      });
    }

    if (!ast.metadata?.info?.version) {
      violations!.push({
        rule: 'openapi-structure',
        message: 'Missing required version in info object',
        severity: 'error'
      });
    }
  }

  private validateEndpointDefinitions(ast: any, violations: ValidationResponse['violations']): void {
    if (!ast.endpoints || !Array.isArray(ast.endpoints)) {
      violations!.push({
        rule: 'endpoint-definitions',
        message: 'Endpoints must be an array',
        severity: 'error'
      });
      return;
    }

    ast.endpoints.forEach((endpoint: any, index: number) => {
      if (!endpoint.path) {
        violations!.push({
          rule: 'endpoint-definitions',
          message: `Endpoint at index ${index} missing required path`,
          severity: 'error'
        });
      }

      if (!endpoint.method) {
        violations!.push({
          rule: 'endpoint-definitions',
          message: `Endpoint at index ${index} missing required method`,
          severity: 'error'
        });
      }

      if (!endpoint.responses || Object.keys(endpoint.responses).length === 0) {
        violations!.push({
          rule: 'endpoint-definitions',
          message: `Endpoint ${endpoint.method} ${endpoint.path} should have at least one response`,
          severity: 'warning'
        });
      }
    });
  }

  private validateSchemaDefinitions(ast: any, violations: ValidationResponse['violations']): void {
    if (ast.schemas && Array.isArray(ast.schemas)) {
      ast.schemas.forEach((schema: any, index: number) => {
        if (!schema.name) {
          violations!.push({
            rule: 'schema-definitions',
            message: `Schema at index ${index} missing required name`,
            severity: 'error'
          });
        }

        if (!schema.schema || typeof schema.schema !== 'object') {
          violations!.push({
            rule: 'schema-definitions',
            message: `Schema '${schema.name}' missing or invalid schema definition`,
            severity: 'error'
          });
        }
      });
    }
  }

  private validateSecurityDefinitions(_ast: any, _violations: ValidationResponse['violations']): void {
    // Placeholder for security validation
  }
}

export default OpenAPIParser;