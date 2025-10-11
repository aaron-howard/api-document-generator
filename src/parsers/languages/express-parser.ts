/**
 * Express.js Parser Implementation
 * 
 * Parses Express.js route definitions, middleware, and error handlers from JavaScript/TypeScript files.
 * Extracts route patterns, HTTP methods, parameters, and generates API documentation.
 */

import { IParser, ParseRequest, ParseResponse, ValidationResponse, StandardizedAST } from '../parser-service';
import { ApiEndpoint, HttpMethod } from '../../core/models/api-spec';
import { DataModel } from '../../core/models/schema';
import * as ts from 'typescript';
import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Express.js specific interfaces
 */
export interface ExpressRoute {
  method: string;
  path: string;
  handler: string;
  middleware: string[];
  parameters: RouteParameter[];
  file: string;
  line: number;
  column: number;
}

export interface RouteParameter {
  name: string;
  type: 'path' | 'query' | 'body' | 'header';
  required: boolean;
  description?: string;
}

export interface ExpressMiddleware {
  name: string;
  type: 'middleware' | 'error-handler';
  file: string;
  line: number;
  column: number;
}

export interface ExpressApp {
  name: string;
  routes: ExpressRoute[];
  middleware: ExpressMiddleware[];
  errorHandlers: ExpressMiddleware[];
}

/**
 * Express.js Parser class implementing IParser interface
 */
export class ExpressParser implements IParser {
  readonly type = 'express';
  readonly supportedExtensions = ['.js', '.ts', '.jsx', '.tsx'];

  /**
   * Check if this parser can handle the given request
   */
  canParse(request: ParseRequest): boolean {
    if (request.type !== 'express') {
      return false;
    }

    // For directory parsing, we can handle it
    if (request.source === 'directory') {
      return true;
    }

    // For file parsing, check file extension
    const path = request.path.toLowerCase();
    return this.supportedExtensions.some(ext => path.endsWith(ext));
  }

  /**
   * Parse Express.js files into standardized AST format
   */
  async parse(request: ParseRequest): Promise<ParseResponse> {
    const parseId = this.generateParseId();
    const startTime = Date.now();

    try {
      let expressApps: ExpressApp[] = [];

      if (request.source === 'directory') {
        // Handle directory parsing
        expressApps = await this.parseDirectory(request);
      } else {
        // Handle single file parsing
        const source = await this.loadSource(request);
        
        // Check if this is an Express.js file
        if (!this.detectExpressApp(source)) {
          return {
            status: 'failed',
            parseId,
            errors: [{
              status: 'error',
              code: 'NOT_EXPRESS_APP',
              message: 'File does not appear to contain Express.js application code',
              details: { path: request.path }
            }]
          };
        }

        // Parse TypeScript/JavaScript AST
        const sourceFile = this.createSourceFile(request.path, source);
        
        // Extract Express routes and middleware
        const expressApp = this.extractExpressApp(sourceFile, request.path);
        expressApps = [expressApp];
      }

      // Merge all Express apps into one
      const mergedApp = this.mergeExpressApps(expressApps);
      
      // Convert to standardized AST
      const ast = await this.convertToAST(mergedApp, request);

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
          sourceType: 'express',
          version: '1.0.0',
          endpointCount: ast.endpoints.length,
          schemaCount: ast.schemas.length,
          parseTime,
          fileSize: this.calculateTotalFileSize(expressApps)
        }
      };

    } catch (error) {
      return this.handleParseError(error, parseId);
    }
  }

  /**
   * Detect if source code contains Express.js application
   */
  detectExpressApp(source: string): boolean {
    const expressPatterns = [
      /require\s*\(\s*['"]express['"]\s*\)/,
      /import\s+.*\s+from\s+['"]express['"]/,
      /app\.(get|post|put|delete|patch|use)/,
      /router\.(get|post|put|delete|patch|use)/,
      /express\s*\(\s*\)/,
      /app\.listen/,
      /Router\s*\(\s*\)/
    ];

    return expressPatterns.some(pattern => pattern.test(source));
  }

  /**
   * Create TypeScript source file for AST parsing
   */
  private createSourceFile(filePath: string, source: string): ts.SourceFile {
    const isTypeScript = filePath.endsWith('.ts') || filePath.endsWith('.tsx');
    
    return ts.createSourceFile(
      filePath,
      source,
      isTypeScript ? ts.ScriptTarget.Latest : ts.ScriptTarget.ES2020,
      true
    );
  }

  /**
   * Extract Express application structure from AST
   */
  private extractExpressApp(sourceFile: ts.SourceFile, filePath: string): ExpressApp {
    const routes: ExpressRoute[] = [];
    const middleware: ExpressMiddleware[] = [];
    const errorHandlers: ExpressMiddleware[] = [];

    // Visit all nodes in the AST
    const visit = (node: ts.Node) => {
      // Look for Express route definitions
      if (this.isExpressRouteCall(node)) {
        const route = this.extractRouteFromCall(node as ts.CallExpression, filePath);
        if (route) {
          routes.push(route);
        }
      }

      // Look for middleware definitions
      if (this.isMiddlewareCall(node)) {
        const middlewareItem = this.extractMiddlewareFromCall(node as ts.CallExpression, filePath);
        if (middlewareItem) {
          middleware.push(middlewareItem);
        }
      }

      // Look for error handlers
      if (this.isErrorHandlerCall(node)) {
        const errorHandler = this.extractErrorHandlerFromCall(node as ts.CallExpression, filePath);
        if (errorHandler) {
          errorHandlers.push(errorHandler);
        }
      }

      // Continue visiting child nodes
      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    return {
      name: path.basename(filePath, path.extname(filePath)),
      routes,
      middleware,
      errorHandlers
    };
  }

  /**
   * Check if AST node is an Express route call (app.get, router.post, etc.)
   */
  private isExpressRouteCall(node: ts.Node): boolean {
    if (!ts.isCallExpression(node)) {
      return false;
    }

    const expression = node.expression;
    if (!ts.isPropertyAccessExpression(expression)) {
      return false;
    }

    const methodName = expression.name.text;
    const httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'];
    
    return httpMethods.includes(methodName.toLowerCase());
  }

  /**
   * Extract route information from Express route call
   */
  private extractRouteFromCall(node: ts.CallExpression, filePath: string): ExpressRoute | null {
    if (!ts.isPropertyAccessExpression(node.expression)) {
      return null;
    }

    const method = node.expression.name.text.toUpperCase();
    const args = node.arguments;

    if (args.length < 2) {
      return null;
    }

    // Extract route path
    const pathArg = args[0];
    let path = '';
    
    if (pathArg && ts.isStringLiteral(pathArg)) {
      path = pathArg.text;
    } else if (pathArg && ts.isTemplateExpression(pathArg)) {
      // Handle template literals (basic case)
      path = pathArg.getText();
    }

    // Extract handler function name
    const handlerArg = args[args.length - 1];
    let handler = 'anonymous';
    
    if (handlerArg && ts.isIdentifier(handlerArg)) {
      handler = handlerArg.text;
    } else if (handlerArg && (ts.isArrowFunction(handlerArg) || ts.isFunctionExpression(handlerArg))) {
      handler = 'inline function';
    }

    // Extract middleware (middle arguments)
    const middleware: string[] = [];
    for (let i = 1; i < args.length - 1; i++) {
      const middlewareArg = args[i];
      if (middlewareArg && ts.isIdentifier(middlewareArg)) {
        middleware.push(middlewareArg.text);
      }
    }

    // Extract route parameters
    const parameters = this.extractRouteParameters(path);

    return {
      method,
      path,
      handler,
      middleware,
      parameters,
      file: filePath,
      line: node.getSourceFile().getLineAndCharacterOfPosition(node.getStart()).line + 1,
      column: node.getSourceFile().getLineAndCharacterOfPosition(node.getStart()).character + 1
    };
  }

  /**
   * Extract route parameters from path string
   */
  private extractRouteParameters(path: string): RouteParameter[] {
    const parameters: RouteParameter[] = [];
    const paramRegex = /:([a-zA-Z_][a-zA-Z0-9_]*)/g;
    let match;

    while ((match = paramRegex.exec(path)) !== null) {
      parameters.push({
        name: match[1] || '',
        type: 'path',
        required: true,
        description: `Path parameter: ${match[1]}`
      });
    }

    return parameters;
  }

  /**
   * Check if AST node is a middleware call (app.use, router.use)
   */
  private isMiddlewareCall(node: ts.Node): boolean {
    if (!ts.isCallExpression(node)) {
      return false;
    }

    const expression = node.expression;
    if (!ts.isPropertyAccessExpression(expression)) {
      return false;
    }

    return expression.name.text === 'use';
  }

  /**
   * Extract middleware information from call
   */
  private extractMiddlewareFromCall(node: ts.CallExpression, filePath: string): ExpressMiddleware | null {
    if (!ts.isPropertyAccessExpression(node.expression)) {
      return null;
    }

    const args = node.arguments;
    if (args.length === 0) {
      return null;
    }

    const middlewareArg = args[args.length - 1];
    let name = 'anonymous middleware';
    
    if (middlewareArg && ts.isIdentifier(middlewareArg)) {
      name = middlewareArg.text;
    } else if (middlewareArg && (ts.isArrowFunction(middlewareArg) || ts.isFunctionExpression(middlewareArg))) {
      name = 'inline middleware';
    }

    return {
      name,
      type: 'middleware',
      file: filePath,
      line: node.getSourceFile().getLineAndCharacterOfPosition(node.getStart()).line + 1,
      column: node.getSourceFile().getLineAndCharacterOfPosition(node.getStart()).character + 1
    };
  }

  /**
   * Check if AST node is an error handler call
   */
  private isErrorHandlerCall(node: ts.Node): boolean {
    if (!ts.isCallExpression(node)) {
      return false;
    }

    const expression = node.expression;
    if (!ts.isPropertyAccessExpression(expression)) {
      return false;
    }

    // Error handlers typically have 4 parameters: (err, req, res, next)
    return node.arguments.length === 4;
  }

  /**
   * Extract error handler information from call
   */
  private extractErrorHandlerFromCall(node: ts.CallExpression, filePath: string): ExpressMiddleware | null {
    const args = node.arguments;
    if (args.length !== 4) {
      return null;
    }

    const handlerArg = args[3]; // The error handler function
    let name = 'anonymous error handler';
    
    if (handlerArg && ts.isIdentifier(handlerArg)) {
      name = handlerArg.text;
    } else if (handlerArg && (ts.isArrowFunction(handlerArg) || ts.isFunctionExpression(handlerArg))) {
      name = 'inline error handler';
    }

    return {
      name,
      type: 'error-handler',
      file: filePath,
      line: node.getSourceFile().getLineAndCharacterOfPosition(node.getStart()).line + 1,
      column: node.getSourceFile().getLineAndCharacterOfPosition(node.getStart()).character + 1
    };
  }

  /**
   * Convert Express app structure to standardized AST
   */
  private async convertToAST(expressApp: ExpressApp, _request: ParseRequest): Promise<StandardizedAST> {
    const endpoints: ApiEndpoint[] = [];
    const schemas: DataModel[] = [];
    const components: any[] = [];

    // Convert Express routes to API endpoints
    for (const route of expressApp.routes) {
      const endpoint: ApiEndpoint = {
        id: `${route.method.toLowerCase()}_${route.path.replace(/[^a-zA-Z0-9]/g, '_')}`,
        path: route.path,
        method: route.method as HttpMethod,
        summary: `${route.method} ${route.path}`,
        description: `Handler: ${route.handler}`,
        parameters: route.parameters.map(param => ({
          name: param.name,
          in: param.type as any, // Type assertion for compatibility
          required: param.required,
          description: param.description || '',
          schema: { type: 'string' as any } // Default type, could be enhanced
        })),
        responses: [
          {
            statusCode: '200',
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { type: 'object' as any }
              }
            }
          }
        ],
        tags: [expressApp.name],
        operationId: `${route.method.toLowerCase()}_${route.path.replace(/[^a-zA-Z0-9]/g, '_')}`
      };

      endpoints.push(endpoint);
    }

    // Create schemas for common Express patterns
    const commonSchemas = this.createCommonSchemas();
    schemas.push(...commonSchemas);

    // Create components for middleware and error handlers
    components.push({
      type: 'middleware',
      items: expressApp.middleware
    });

    components.push({
      type: 'error-handlers',
      items: expressApp.errorHandlers
    });

    return {
      endpoints,
      schemas,
      components,
      spec: {
        title: expressApp.name,
        version: '1.0.0'
      } as any,
      metadata: {
        expressApp: expressApp.name,
        totalRoutes: expressApp.routes.length,
        totalMiddleware: expressApp.middleware.length,
        totalErrorHandlers: expressApp.errorHandlers.length,
        parserType: 'express'
      }
    };
  }

  /**
   * Create common schemas for Express.js applications
   */
  private createCommonSchemas(): DataModel[] {
    return [
      {
        name: 'ErrorResponse',
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            status: { type: 'number' }
          }
        }
      } as any,
      {
        name: 'SuccessResponse',
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' }
          }
        }
      } as any
    ];
  }

  /**
   * Parse directory of Express.js files
   */
  private async parseDirectory(request: ParseRequest): Promise<ExpressApp[]> {
    const expressApps: ExpressApp[] = [];
    const files = await this.getTypeScriptFiles(request.path);

    for (const filePath of files) {
      try {
        const source = await fs.readFile(filePath, 'utf-8');
        
        // Check if this is an Express.js file
        if (this.detectExpressApp(source)) {
          const sourceFile = this.createSourceFile(filePath, source);
          const expressApp = this.extractExpressApp(sourceFile, filePath);
          expressApps.push(expressApp);
        }
      } catch (error) {
        console.warn(`Failed to parse file ${filePath}:`, error);
        // Continue with other files
      }
    }

    return expressApps;
  }

  /**
   * Get all TypeScript/JavaScript files in directory
   */
  private async getTypeScriptFiles(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    
    const readDir = async (currentPath: string): Promise<void> => {
      const items = await fs.readdir(currentPath);
      
      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stat = await fs.stat(fullPath);
        
        if (stat.isDirectory()) {
          // Recursively search subdirectories if recursive is enabled
          await readDir(fullPath);
        } else if (stat.isFile()) {
          const ext = path.extname(item).toLowerCase();
          if (this.supportedExtensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    };

    await readDir(dirPath);
    return files;
  }

  /**
   * Merge multiple Express apps into one
   */
  private mergeExpressApps(apps: ExpressApp[]): ExpressApp {
    const mergedApp: ExpressApp = {
      name: 'Merged Express Application',
      routes: [],
      middleware: [],
      errorHandlers: []
    };

    for (const app of apps) {
      mergedApp.routes.push(...app.routes);
      mergedApp.middleware.push(...app.middleware);
      mergedApp.errorHandlers.push(...app.errorHandlers);
    }

    return mergedApp;
  }

  /**
   * Calculate total file size for multiple apps
   */
  private calculateTotalFileSize(apps: ExpressApp[]): number {
    // This is a rough estimate - in a real implementation you'd track actual file sizes
    return apps.length * 1000; // Placeholder
  }

  /**
   * Load source file content
   */
  private async loadSource(request: ParseRequest): Promise<string> {
    if (request.source === 'file') {
      return await fs.readFile(request.path, 'utf-8');
    } else if (request.source === 'content') {
      return request.path; // path contains content in this case
    } else {
      throw new Error(`Unsupported source type: ${request.source}`);
    }
  }

  /**
   * Generate unique parse ID
   */
  private generateParseId(): string {
    return `parse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Handle parse errors
   */
  private handleParseError(error: any, parseId: string): ParseResponse {
    return {
      status: 'failed',
      parseId,
      errors: [{
        status: 'error',
        code: 'PARSE_ERROR',
        message: error.message || 'Unknown parse error',
        details: { error: error.toString() }
      }]
    };
  }

  /**
   * Validate parsed Express AST
   */
  async validate(ast: any, rules?: string[]): Promise<ValidationResponse> {
    const violations: ValidationResponse['violations'] = [];

    // Standard Express validation rules
    if (!rules || rules.includes('route-format')) {
      this.validateRouteFormat(ast, violations);
    }

    if (!rules || rules.includes('middleware-order')) {
      this.validateMiddlewareOrder(ast, violations);
    }

    if (!rules || rules.includes('error-handlers')) {
      this.validateErrorHandlers(ast, violations);
    }

    return {
      valid: violations.filter(v => v.severity === 'error').length === 0,
      ...(violations.length > 0 && { violations })
    };
  }

  /**
   * Validate route format
   */
  private validateRouteFormat(ast: any, violations: ValidationResponse['violations'] = []): void {
    if (!ast.endpoints) return;

    for (const endpoint of ast.endpoints) {
      if (!endpoint.path || !endpoint.method) {
        violations.push({
          rule: 'route-format',
          message: 'Route missing path or method',
          severity: 'error',
          location: endpoint.metadata
        });
      }
    }
  }

  /**
   * Validate middleware order
   */
  private validateMiddlewareOrder(_ast: any, _violations: ValidationResponse['violations']): void {
    // Implementation for middleware order validation
    // This could check for common Express.js anti-patterns
  }

  /**
   * Validate error handlers
   */
  private validateErrorHandlers(_ast: any, _violations: ValidationResponse['violations']): void {
    // Implementation for error handler validation
    // This could check for proper error handler signatures
  }
}

export default ExpressParser;
