/**
 * Core data models for API specifications
 * Supports OpenAPI 3.x, JSDoc, and other documentation formats
 */

import { DataModel, SchemaObject } from './schema';

export interface ApiSpecification {
  readonly id: string;
  readonly format: ApiSpecFormat;
  readonly version: string;
  readonly metadata: ApiMetadata;
  readonly endpoints: ApiEndpoint[];
  readonly dataModels: DataModel[];
  readonly security: SecurityScheme[];
  readonly servers: ServerInfo[];
  readonly tags: Tag[];
  readonly externalDocs?: ExternalDocumentation;
  readonly extensions?: Record<string, any>;
}

export enum ApiSpecFormat {
  OPENAPI_3_0 = 'openapi-3.0',
  OPENAPI_3_1 = 'openapi-3.1',
  SWAGGER_2_0 = 'swagger-2.0',
  JSDOC = 'jsdoc',
  PYTHON_DOCSTRING = 'python-docstring',
  GO_GODOC = 'go-godoc',
  POSTMAN = 'postman',
  INSOMNIA = 'insomnia',
}

export interface ApiMetadata {
  readonly title: string;
  readonly description?: string;
  readonly version: string;
  readonly contact?: ContactInfo;
  readonly license?: LicenseInfo;
  readonly termsOfService?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly source?: SourceInfo;
}

export interface ContactInfo {
  readonly name?: string;
  readonly email?: string;
  readonly url?: string;
}

export interface LicenseInfo {
  readonly name: string;
  readonly url?: string;
  readonly identifier?: string;
}

export interface SourceInfo {
  readonly filePath: string;
  readonly language?: string;
  readonly framework?: string;
  readonly repository?: string;
  readonly branch?: string;
  readonly commit?: string;
}

export interface ApiEndpoint {
  readonly id: string;
  readonly path: string;
  readonly method: HttpMethod;
  readonly operationId?: string;
  readonly summary?: string;
  readonly description?: string;
  readonly tags: string[];
  readonly parameters: Parameter[];
  readonly requestBody?: RequestBody;
  readonly responses: Response[];
  readonly security?: SecurityRequirement[];
  readonly deprecated?: boolean;
  readonly servers?: ServerInfo[];
  readonly callbacks?: Record<string, Callback>;
  readonly externalDocs?: ExternalDocumentation;
  readonly extensions?: Record<string, any>;
  readonly sourceLocation?: SourceLocation;
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
}

export interface Parameter {
  readonly name: string;
  readonly in: ParameterLocation;
  readonly description?: string;
  readonly required?: boolean;
  readonly deprecated?: boolean;
  readonly allowEmptyValue?: boolean;
  readonly style?: ParameterStyle;
  readonly explode?: boolean;
  readonly allowReserved?: boolean;
  readonly schema?: SchemaObject;
  readonly example?: any;
  readonly examples?: Record<string, ExampleObject>;
  readonly content?: Record<string, MediaType>;
}

export enum ParameterLocation {
  QUERY = 'query',
  HEADER = 'header',
  PATH = 'path',
  COOKIE = 'cookie',
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

export interface RequestBody {
  readonly description?: string;
  readonly content: Record<string, MediaType>;
  readonly required?: boolean;
}

export interface Response {
  readonly statusCode: string;
  readonly description: string;
  readonly headers?: Record<string, Header>;
  readonly content?: Record<string, MediaType>;
  readonly links?: Record<string, Link>;
}

export interface MediaType {
  readonly schema?: SchemaObject;
  readonly example?: any;
  readonly examples?: Record<string, ExampleObject>;
  readonly encoding?: Record<string, Encoding>;
}

export interface Header {
  readonly description?: string;
  readonly required?: boolean;
  readonly deprecated?: boolean;
  readonly allowEmptyValue?: boolean;
  readonly style?: ParameterStyle;
  readonly explode?: boolean;
  readonly allowReserved?: boolean;
  readonly schema?: SchemaObject;
  readonly example?: any;
  readonly examples?: Record<string, ExampleObject>;
  readonly content?: Record<string, MediaType>;
}

export interface Link {
  readonly operationRef?: string;
  readonly operationId?: string;
  readonly parameters?: Record<string, any>;
  readonly requestBody?: any;
  readonly description?: string;
  readonly server?: ServerInfo;
}

export interface Encoding {
  readonly contentType?: string;
  readonly headers?: Record<string, Header>;
  readonly style?: ParameterStyle;
  readonly explode?: boolean;
  readonly allowReserved?: boolean;
}

export interface ExampleObject {
  readonly summary?: string;
  readonly description?: string;
  readonly value?: any;
  readonly externalValue?: string;
}

export interface Callback {
  readonly expression: string;
  readonly operations: Record<string, ApiEndpoint>;
}

export interface ServerInfo {
  readonly url: string;
  readonly description?: string;
  readonly variables?: Record<string, ServerVariable>;
}

export interface ServerVariable {
  readonly enum?: string[];
  readonly default: string;
  readonly description?: string;
}

export interface Tag {
  readonly name: string;
  readonly description?: string;
  readonly externalDocs?: ExternalDocumentation;
}

export interface ExternalDocumentation {
  readonly description?: string;
  readonly url: string;
}

export interface SecurityScheme {
  readonly type: SecuritySchemeType;
  readonly description?: string;
  readonly name?: string;
  readonly in?: ParameterLocation;
  readonly scheme?: string;
  readonly bearerFormat?: string;
  readonly flows?: OAuthFlows;
  readonly openIdConnectUrl?: string;
}

export enum SecuritySchemeType {
  API_KEY = 'apiKey',
  HTTP = 'http',
  OAUTH2 = 'oauth2',
  OPENID_CONNECT = 'openIdConnect',
}

export interface OAuthFlows {
  readonly implicit?: OAuthFlow;
  readonly password?: OAuthFlow;
  readonly clientCredentials?: OAuthFlow;
  readonly authorizationCode?: OAuthFlow;
}

export interface OAuthFlow {
  readonly authorizationUrl?: string;
  readonly tokenUrl?: string;
  readonly refreshUrl?: string;
  readonly scopes: Record<string, string>;
}

export interface SecurityRequirement {
  readonly [name: string]: string[];
}

export interface SourceLocation {
  readonly filePath: string;
  readonly startLine: number;
  readonly endLine: number;
  readonly startColumn?: number;
  readonly endColumn?: number;
}

/**
 * Factory functions for creating API specification objects
 */
export class ApiSpecificationFactory {
  static createEmpty(format: ApiSpecFormat): ApiSpecification {
    return {
      id: this.generateId(),
      format,
      version: this.getDefaultVersion(format),
      metadata: {
        title: 'Untitled API',
        version: '1.0.0',
        createdAt: new Date(),
      },
      endpoints: [],
      dataModels: [],
      security: [],
      servers: [],
      tags: [],
    };
  }

  static fromOpenApiSpec(spec: any): ApiSpecification {
    const format = this.detectOpenApiVersion(spec.openapi || spec.swagger);
    
    return {
      id: this.generateId(),
      format,
      version: spec.openapi || spec.swagger,
      metadata: this.extractMetadata(spec.info),
      endpoints: this.extractEndpoints(spec.paths || {}),
      dataModels: this.extractDataModels(spec.components?.schemas || spec.definitions || {}),
      security: this.extractSecuritySchemes(spec.components?.securitySchemes || spec.securityDefinitions || {}),
      servers: this.extractServers(spec.servers || []),
      tags: this.extractTags(spec.tags || []),
      externalDocs: spec.externalDocs,
      extensions: this.extractExtensions(spec),
    };
  }

  private static generateId(): string {
    return `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static getDefaultVersion(format: ApiSpecFormat): string {
    switch (format) {
      case ApiSpecFormat.OPENAPI_3_0:
        return '3.0.3';
      case ApiSpecFormat.OPENAPI_3_1:
        return '3.1.0';
      case ApiSpecFormat.SWAGGER_2_0:
        return '2.0';
      default:
        return '1.0.0';
    }
  }

  private static detectOpenApiVersion(version: string): ApiSpecFormat {
    if (version?.startsWith('3.1')) {
      return ApiSpecFormat.OPENAPI_3_1;
    } else if (version?.startsWith('3.0')) {
      return ApiSpecFormat.OPENAPI_3_0;
    } else if (version?.startsWith('2.0')) {
      return ApiSpecFormat.SWAGGER_2_0;
    }
    throw new Error(`Unsupported OpenAPI/Swagger version: ${version}`);
  }

  private static extractMetadata(info: any): ApiMetadata {
    return {
      title: info?.title || 'Untitled API',
      description: info?.description,
      version: info?.version || '1.0.0',
      contact: info?.contact,
      license: info?.license,
      termsOfService: info?.termsOfService,
      createdAt: new Date(),
    };
  }

  private static extractEndpoints(paths: any): ApiEndpoint[] {
    const endpoints: ApiEndpoint[] = [];
    
    for (const [path, pathItem] of Object.entries(paths)) {
      for (const [method, operation] of Object.entries(pathItem as any)) {
        if (this.isHttpMethod(method)) {
          endpoints.push(this.createEndpoint(path, method as HttpMethod, operation as any, pathItem as any));
        }
      }
    }
    
    return endpoints;
  }

  private static isHttpMethod(method: string): boolean {
    return Object.values(HttpMethod).includes(method.toUpperCase() as HttpMethod);
  }

  private static createEndpoint(path: string, method: HttpMethod, operation: any, pathItem: any): ApiEndpoint {
    return {
      id: `${method.toLowerCase()}_${path.replace(/[^a-zA-Z0-9]/g, '_')}`,
      path,
      method,
      operationId: operation.operationId,
      summary: operation.summary,
      description: operation.description,
      tags: operation.tags || [],
      parameters: this.extractParameters(operation.parameters || [], pathItem.parameters || []),
      requestBody: operation.requestBody,
      responses: this.extractResponses(operation.responses || {}),
      security: operation.security,
      deprecated: operation.deprecated,
      servers: operation.servers,
      callbacks: operation.callbacks,
      externalDocs: operation.externalDocs,
      extensions: this.extractExtensions(operation),
    };
  }

  private static extractParameters(operationParams: any[], pathParams: any[]): Parameter[] {
    const allParams = [...pathParams, ...operationParams];
    return allParams.map(param => ({
      name: param.name,
      in: param.in as ParameterLocation,
      description: param.description,
      required: param.required,
      deprecated: param.deprecated,
      allowEmptyValue: param.allowEmptyValue,
      style: param.style as ParameterStyle,
      explode: param.explode,
      allowReserved: param.allowReserved,
      schema: param.schema,
      example: param.example,
      examples: param.examples,
      content: param.content,
    }));
  }

  private static extractResponses(responses: any): Response[] {
    return Object.entries(responses).map(([statusCode, response]: [string, any]) => ({
      statusCode,
      description: response.description || '',
      headers: response.headers,
      content: response.content,
      links: response.links,
    }));
  }

  private static extractDataModels(schemas: any): DataModel[] {
    return Object.entries(schemas).map(([name, schema]: [string, any]) => ({
      name,
      schema: schema as SchemaObject,
      description: schema.description,
      examples: schema.examples,
    }));
  }

  private static extractSecuritySchemes(securitySchemes: any): SecurityScheme[] {
    return Object.entries(securitySchemes).map(([, scheme]: [string, any]) => ({
      type: scheme.type as SecuritySchemeType,
      description: scheme.description,
      name: scheme.name,
      in: scheme.in as ParameterLocation,
      scheme: scheme.scheme,
      bearerFormat: scheme.bearerFormat,
      flows: scheme.flows,
      openIdConnectUrl: scheme.openIdConnectUrl,
    }));
  }

  private static extractServers(servers: any[]): ServerInfo[] {
    return servers.map(server => ({
      url: server.url,
      description: server.description,
      variables: server.variables,
    }));
  }

  private static extractTags(tags: any[]): Tag[] {
    return tags.map(tag => ({
      name: tag.name,
      description: tag.description,
      externalDocs: tag.externalDocs,
    }));
  }

  private static extractExtensions(obj: any): Record<string, any> {
    const extensions: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('x-')) {
        extensions[key] = value;
      }
    }
    return Object.keys(extensions).length > 0 ? extensions : {};
  }
}