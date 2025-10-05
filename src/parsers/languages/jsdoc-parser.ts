/**
 * JSDoc Parser Implementation
 * 
 * Parses JSDoc comments from JavaScript/TypeScript files into standardized AST format.
 * Supports function documentation, type definitions, and API endpoint extraction.
 */

import { IParser, ParseRequest, ParseResponse, ValidationResponse, ParseError, StandardizedAST } from '../parser-service';
import { ApiSpecification, ApiSpecFormat, ApiEndpoint, HttpMethod } from '../../core/models/api-spec';
import { DataModel } from '../../core/models/schema';

/**
 * JSDoc Parser class implementing IParser interface
 */
export class JSDocParser implements IParser {
  readonly type = 'jsdoc';
  readonly supportedExtensions = ['.js', '.ts', '.jsx', '.tsx', '.mjs'];

  /**
   * Check if this parser can handle the given request
   */
  canParse(request: ParseRequest): boolean {
    if (request.type !== 'jsdoc') {
      return false;
    }

    // Check file extension
    const path = request.path.toLowerCase();
    return this.supportedExtensions.some(ext => path.endsWith(ext));
  }

  /**
   * Parse JSDoc comments into standardized AST format
   */
  async parse(request: ParseRequest): Promise<ParseResponse> {
    const parseId = this.generateParseId();
    const startTime = Date.now();

    try {
      // Load and parse the source file
      const source = await this.loadSource(request);
      
      // Extract JSDoc comments
      const jsdocComments = this.extractJSDocComments(source);
      
      // Parse JSDoc comments into structured data
      const parsedDocs = await this.parseJSDocComments(jsdocComments);

      // Convert to standardized AST
      const ast = await this.convertToAST(parsedDocs, request);

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
          sourceType: 'jsdoc',
          version: '1.0.0',
          endpointCount: ast.endpoints.length,
          schemaCount: ast.schemas.length,
          parseTime,
          fileSize: source.length
        }
      };

    } catch (error) {
      return this.handleParseError(error, parseId);
    }
  }

  /**
   * Validate parsed JSDoc AST
   */
  async validate(ast: any, rules?: string[]): Promise<ValidationResponse> {
    const violations: ValidationResponse['violations'] = [];

    // Standard JSDoc validation rules
    if (!rules || rules.includes('jsdoc-format')) {
      this.validateJSDocFormat(ast, violations);
    }

    if (!rules || rules.includes('function-documentation')) {
      this.validateFunctionDocumentation(ast, violations);
    }

    if (!rules || rules.includes('type-definitions')) {
      this.validateTypeDefinitions(ast, violations);
    }

    return {
      valid: violations.filter(v => v.severity === 'error').length === 0,
      ...(violations.length > 0 && { violations })
    };
  }

  // Private implementation methods

  private async loadSource(request: ParseRequest): Promise<string> {
    switch (request.source) {
      case 'file':
        return await this.loadFromFile(request.path);
      case 'content':
        return request.path;
      default:
        throw new ParseError(
          `Unsupported source type for JSDoc: ${request.source}`,
          'UNSUPPORTED_SOURCE'
        );
    }
  }

  private async loadFromFile(_path: string): Promise<string> {
    // Placeholder for file loading - would use fs.readFileSync or similar
    // For now, return mock JavaScript with JSDoc comments
    return `
/**
 * User API Controller
 * @module UserController
 * @description Handles user-related API operations
 */

/**
 * Get all users
 * @route GET /api/users
 * @description Retrieve a list of all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object[]>} Array of user objects
 * @throws {400} Bad request error
 * @throws {500} Internal server error
 * @example
 * // GET /api/users
 * // Returns: [{ id: 1, name: "John", email: "john@example.com" }]
 */
async function getUsers(req, res) {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Create a new user
 * @route POST /api/users
 * @description Create a new user account
 * @param {Object} req - Express request object
 * @param {UserCreateRequest} req.body - User creation data
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @returns {Promise<User>} Created user object
 * @throws {400} Validation error
 * @throws {409} User already exists
 * @throws {500} Internal server error
 * @example
 * // POST /api/users
 * // Body: { name: "Jane", email: "jane@example.com", password: "secret" }
 * // Returns: { id: 2, name: "Jane", email: "jane@example.com" }
 */
async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * User data model
 * @typedef {Object} User
 * @property {number} id - Unique identifier
 * @property {string} name - User's full name
 * @property {string} email - User's email address
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * User creation request
 * @typedef {Object} UserCreateRequest
 * @property {string} name - User's full name (required)
 * @property {string} email - User's email address (required)
 * @property {string} password - User's password (required)
 */
`;
  }

  private extractJSDocComments(source: string): string[] {
    const jsdocRegex = /\/\*\*[\s\S]*?\*\//g;
    const matches = source.match(jsdocRegex);
    return matches || [];
  }

  private async parseJSDocComments(comments: string[]): Promise<any[]> {
    const parsedComments: any[] = [];

    for (const comment of comments) {
      try {
        const parsed = this.parseComment(comment);
        if (parsed) {
          parsedComments.push(parsed);
        }
      } catch (error) {
        // Log error but continue parsing other comments
        // console.warn(`Failed to parse JSDoc comment: ${error}`);
      }
    }

    return parsedComments;
  }

  private parseComment(comment: string): any | null {
    // Remove /** and */ and clean up
    const cleanComment = comment
      .replace(/^\/\*\*/, '')
      .replace(/\*\/$/, '')
      .split('\n')
      .map(line => line.replace(/^\s*\*\s?/, ''))
      .join('\n')
      .trim();

    if (!cleanComment) {
      return null;
    }

    const parsed: any = {
      description: '',
      tags: []
    };

    const lines = cleanComment.split('\n');
    let currentTag: any = null;
    let descriptionLines: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('@')) {
        // Save previous tag
        if (currentTag) {
          parsed.tags.push(currentTag);
        }

        // Parse new tag
        const tagMatch = trimmedLine.match(/^@(\w+)(?:\s+(.*))?$/);
        if (tagMatch) {
          currentTag = {
            tag: tagMatch[1],
            name: '',
            type: '',
            description: tagMatch[2] || ''
          };

          // Parse specific tag formats
          this.parseTagContent(currentTag);
        }
      } else if (currentTag) {
        // Continuation of current tag
        currentTag.description += (currentTag.description ? ' ' : '') + trimmedLine;
        this.parseTagContent(currentTag);
      } else {
        // Description content
        descriptionLines.push(trimmedLine);
      }
    }

    // Save last tag
    if (currentTag) {
      parsed.tags.push(currentTag);
    }

    parsed.description = descriptionLines.join(' ').trim();

    return parsed;
  }

  private parseTagContent(tag: any): void {
    const { tag: tagName, description } = tag;

    switch (tagName) {
      case 'param':
        this.parseParamTag(tag);
        break;
      case 'returns':
      case 'return':
        this.parseReturnTag(tag);
        break;
      case 'throws':
      case 'exception':
        this.parseThrowsTag(tag);
        break;
      case 'route':
        this.parseRouteTag(tag);
        break;
      case 'typedef':
        this.parseTypedefTag(tag);
        break;
      case 'property':
      case 'prop':
        this.parsePropertyTag(tag);
        break;
      case 'example':
        tag.code = description;
        break;
      default:
        // Generic tag - keep as is
        break;
    }
  }

  private parseParamTag(tag: any): void {
    // @param {type} name - description
    const match = tag.description.match(/^\{([^}]+)\}\s+(\S+)\s*-?\s*(.*)$/);
    if (match) {
      tag.type = match[1];
      tag.name = match[2];
      tag.description = match[3];
    }
  }

  private parseReturnTag(tag: any): void {
    // @returns {type} description
    const match = tag.description.match(/^\{([^}]+)\}\s*(.*)$/);
    if (match) {
      tag.type = match[1];
      tag.description = match[2];
    }
  }

  private parseThrowsTag(tag: any): void {
    // @throws {statusCode} description
    const match = tag.description.match(/^\{([^}]+)\}\s*(.*)$/);
    if (match) {
      tag.statusCode = match[1];
      tag.description = match[2];
    }
  }

  private parseRouteTag(tag: any): void {
    // @route METHOD /path
    const match = tag.description.match(/^(\w+)\s+(.+)$/);
    if (match) {
      tag.method = match[1].toUpperCase();
      tag.path = match[2];
    }
  }

  private parseTypedefTag(tag: any): void {
    // @typedef {type} name
    const match = tag.description.match(/^\{([^}]+)\}\s+(.+)$/);
    if (match) {
      tag.type = match[1];
      tag.name = match[2];
    }
  }

  private parsePropertyTag(tag: any): void {
    // @property {type} name - description
    const match = tag.description.match(/^\{([^}]+)\}\s+(\S+)\s*-?\s*(.*)$/);
    if (match) {
      tag.type = match[1];
      tag.name = match[2];
      tag.description = match[3];
    }
  }

  private async convertToAST(parsedDocs: any[], request: ParseRequest): Promise<StandardizedAST> {
    const endpoints = this.extractEndpoints(parsedDocs);
    const schemas = this.extractSchemas(parsedDocs);
    const components = this.extractComponents(parsedDocs);
    const metadata = this.extractMetadata(parsedDocs, request);

    // Create ApiSpecification
    const spec: ApiSpecification = {
      id: this.generateSpecId(),
      format: ApiSpecFormat.JSDOC,
      version: '1.0.0',
      metadata: {
        title: 'JSDoc API',
        description: 'API documentation extracted from JSDoc comments',
        version: '1.0.0'
      },
      endpoints,
      dataModels: schemas,
      security: [],
      servers: [],
      tags: []
    };

    return {
      spec,
      endpoints: endpoints.map(e => this.endpointToPlainObject(e)),
      schemas,
      components,
      metadata
    };
  }

  private extractEndpoints(parsedDocs: any[]): ApiEndpoint[] {
    const endpoints: ApiEndpoint[] = [];

    for (const doc of parsedDocs) {
      const routeTag = doc.tags.find((tag: any) => tag.tag === 'route');
      if (!routeTag || !routeTag.method || !routeTag.path) {
        continue;
      }

      const endpoint: ApiEndpoint = {
        id: `${routeTag.method}_${routeTag.path}`.replace(/[^a-zA-Z0-9]/g, '_'),
        path: routeTag.path,
        method: this.parseHttpMethod(routeTag.method),
        summary: doc.description,
        description: doc.description,
        tags: [],
        parameters: this.extractParameters(doc),
        responses: this.extractResponses(doc),
        deprecated: false
      };

      endpoints.push(endpoint);
    }

    return endpoints;
  }

  private extractSchemas(parsedDocs: any[]): DataModel[] {
    const schemas: DataModel[] = [];

    for (const doc of parsedDocs) {
      const typedefTag = doc.tags.find((tag: any) => tag.tag === 'typedef');
      if (!typedefTag || !typedefTag.name) {
        continue;
      }

      const properties = doc.tags
        .filter((tag: any) => tag.tag === 'property')
        .reduce((props: any, tag: any) => {
          if (tag.name) {
            props[tag.name] = {
              type: this.convertJSDocType(tag.type),
              description: tag.description
            };
          }
          return props;
        }, {});

      const schema: DataModel = {
        name: typedefTag.name,
        schema: {
          type: 'object' as any,
          properties,
          description: doc.description
        },
        description: doc.description
      };

      schemas.push(schema);
    }

    return schemas;
  }

  private extractComponents(_parsedDocs: any[]): any[] {
    return [];
  }

  private extractMetadata(parsedDocs: any[], request: ParseRequest): Record<string, any> {
    const moduleTag = parsedDocs
      .flatMap((doc: any) => doc.tags)
      .find((tag: any) => tag.tag === 'module');

    return {
      sourceFile: request.path,
      module: moduleTag?.name || 'Unknown',
      jsdocVersion: '1.0.0',
      totalComments: parsedDocs.length
    };
  }

  private extractParameters(doc: any): any[] {
    return doc.tags
      .filter((tag: any) => tag.tag === 'param')
      .map((tag: any) => ({
        name: tag.name,
        in: this.determineParameterLocation(tag.name),
        description: tag.description,
        required: !tag.name.includes('?'),
        schema: {
          type: this.convertJSDocType(tag.type)
        }
      }));
  }

  private extractResponses(doc: any): any[] {
    const responses: any[] = [];

    // Extract return/returns tag
    const returnTag = doc.tags.find((tag: any) => tag.tag === 'returns' || tag.tag === 'return');
    if (returnTag) {
      responses.push({
        statusCode: '200',
        description: returnTag.description || 'Successful response',
        content: {
          'application/json': {
            schema: {
              type: this.convertJSDocType(returnTag.type)
            }
          }
        }
      });
    }

    // Extract throws/exception tags
    const errorTags = doc.tags.filter((tag: any) => tag.tag === 'throws' || tag.tag === 'exception');
    for (const errorTag of errorTags) {
      responses.push({
        statusCode: errorTag.statusCode || '500',
        description: errorTag.description || 'Error response'
      });
    }

    return responses;
  }

  private parseHttpMethod(method: string): HttpMethod {
    const upperMethod = method.toUpperCase();
    switch (upperMethod) {
      case 'GET': return HttpMethod.GET;
      case 'POST': return HttpMethod.POST;
      case 'PUT': return HttpMethod.PUT;
      case 'PATCH': return HttpMethod.PATCH;
      case 'DELETE': return HttpMethod.DELETE;
      case 'HEAD': return HttpMethod.HEAD;
      case 'OPTIONS': return HttpMethod.OPTIONS;
      case 'TRACE': return HttpMethod.TRACE;
      default: return HttpMethod.GET;
    }
  }

  private determineParameterLocation(paramName: string): string {
    if (paramName.includes('req.params') || paramName.includes('id')) {
      return 'path';
    }
    if (paramName.includes('req.query')) {
      return 'query';
    }
    if (paramName.includes('req.body')) {
      return 'body';
    }
    if (paramName.includes('req.headers')) {
      return 'header';
    }
    return 'query';
  }

  private convertJSDocType(jsdocType: string): string {
    if (!jsdocType) return 'any';

    const typeMap: Record<string, string> = {
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'object': 'object',
      'array': 'array',
      'Object': 'object',
      'Array': 'array',
      'String': 'string',
      'Number': 'number',
      'Boolean': 'boolean',
      'Date': 'string',
      'Promise': 'object'
    };

    // Handle array types
    if (jsdocType.includes('[]')) {
      return 'array';
    }

    // Handle Promise types
    if (jsdocType.startsWith('Promise<')) {
      const innerType = jsdocType.match(/Promise<(.+)>/)?.[1];
      return this.convertJSDocType(innerType || 'any');
    }

    return typeMap[jsdocType] || 'object';
  }

  private endpointToPlainObject(endpoint: ApiEndpoint): any {
    return {
      id: endpoint.id,
      path: endpoint.path,
      method: endpoint.method,
      summary: endpoint.summary,
      description: endpoint.description,
      tags: endpoint.tags,
      parameters: endpoint.parameters,
      responses: endpoint.responses,
      deprecated: endpoint.deprecated
    };
  }

  private generateParseId(): string {
    return `jsdoc_parse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSpecId(): string {
    return `jsdoc_spec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
          details: error.details || {}
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

  private validateJSDocFormat(ast: any, violations: ValidationResponse['violations']): void {
    if (!ast.metadata) {
      violations!.push({
        rule: 'jsdoc-format',
        message: 'Missing metadata in JSDoc AST',
        severity: 'error'
      });
    }

    if (ast.endpoints && Array.isArray(ast.endpoints)) {
      ast.endpoints.forEach((endpoint: any, index: number) => {
        if (!endpoint.summary && !endpoint.description) {
          violations!.push({
            rule: 'jsdoc-format',
            message: `Endpoint at index ${index} missing documentation`,
            severity: 'warning'
          });
        }
      });
    }
  }

  private validateFunctionDocumentation(ast: any, violations: ValidationResponse['violations']): void {
    if (ast.endpoints && Array.isArray(ast.endpoints)) {
      ast.endpoints.forEach((endpoint: any) => {
        if (!endpoint.parameters || endpoint.parameters.length === 0) {
          violations!.push({
            rule: 'function-documentation',
            message: `Function ${endpoint.id} should document its parameters`,
            severity: 'warning'
          });
        }

        if (!endpoint.responses || endpoint.responses.length === 0) {
          violations!.push({
            rule: 'function-documentation',
            message: `Function ${endpoint.id} should document its return value`,
            severity: 'warning'
          });
        }
      });
    }
  }

  private validateTypeDefinitions(ast: any, violations: ValidationResponse['violations']): void {
    if (ast.schemas && Array.isArray(ast.schemas)) {
      ast.schemas.forEach((schema: any) => {
        if (!schema.schema || !schema.schema.properties) {
          violations!.push({
            rule: 'type-definitions',
            message: `Type definition '${schema.name}' should have properties`,
            severity: 'warning'
          });
        }
      });
    }
  }
}

export default JSDocParser;