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
export declare enum ApiSpecFormat {
    OPENAPI_3_0 = "openapi-3.0",
    OPENAPI_3_1 = "openapi-3.1",
    SWAGGER_2_0 = "swagger-2.0",
    JSDOC = "jsdoc",
    PYTHON_DOCSTRING = "python-docstring",
    GO_GODOC = "go-godoc",
    POSTMAN = "postman",
    INSOMNIA = "insomnia"
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
export declare enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
    HEAD = "HEAD",
    OPTIONS = "OPTIONS",
    TRACE = "TRACE"
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
export declare enum ParameterLocation {
    QUERY = "query",
    HEADER = "header",
    PATH = "path",
    COOKIE = "cookie"
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
export declare enum SecuritySchemeType {
    API_KEY = "apiKey",
    HTTP = "http",
    OAUTH2 = "oauth2",
    OPENID_CONNECT = "openIdConnect"
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
export declare class ApiSpecificationFactory {
    static createEmpty(format: ApiSpecFormat): ApiSpecification;
    static fromOpenApiSpec(spec: any): ApiSpecification;
    private static generateId;
    private static getDefaultVersion;
    private static detectOpenApiVersion;
    private static extractMetadata;
    private static extractEndpoints;
    private static isHttpMethod;
    private static createEndpoint;
    private static extractParameters;
    private static extractResponses;
    private static extractDataModels;
    private static extractSecuritySchemes;
    private static extractServers;
    private static extractTags;
    private static extractExtensions;
}
//# sourceMappingURL=api-spec.d.ts.map