"use strict";
/**
 * Core data models for API specifications
 * Supports OpenAPI 3.x, JSDoc, and other documentation formats
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiSpecificationFactory = exports.SecuritySchemeType = exports.ParameterStyle = exports.ParameterLocation = exports.HttpMethod = exports.ApiSpecFormat = void 0;
var ApiSpecFormat;
(function (ApiSpecFormat) {
    ApiSpecFormat["OPENAPI_3_0"] = "openapi-3.0";
    ApiSpecFormat["OPENAPI_3_1"] = "openapi-3.1";
    ApiSpecFormat["SWAGGER_2_0"] = "swagger-2.0";
    ApiSpecFormat["JSDOC"] = "jsdoc";
    ApiSpecFormat["PYTHON_DOCSTRING"] = "python-docstring";
    ApiSpecFormat["GO_GODOC"] = "go-godoc";
    ApiSpecFormat["POSTMAN"] = "postman";
    ApiSpecFormat["INSOMNIA"] = "insomnia";
})(ApiSpecFormat || (exports.ApiSpecFormat = ApiSpecFormat = {}));
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["PATCH"] = "PATCH";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["HEAD"] = "HEAD";
    HttpMethod["OPTIONS"] = "OPTIONS";
    HttpMethod["TRACE"] = "TRACE";
})(HttpMethod || (exports.HttpMethod = HttpMethod = {}));
var ParameterLocation;
(function (ParameterLocation) {
    ParameterLocation["QUERY"] = "query";
    ParameterLocation["HEADER"] = "header";
    ParameterLocation["PATH"] = "path";
    ParameterLocation["COOKIE"] = "cookie";
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
var SecuritySchemeType;
(function (SecuritySchemeType) {
    SecuritySchemeType["API_KEY"] = "apiKey";
    SecuritySchemeType["HTTP"] = "http";
    SecuritySchemeType["OAUTH2"] = "oauth2";
    SecuritySchemeType["OPENID_CONNECT"] = "openIdConnect";
})(SecuritySchemeType || (exports.SecuritySchemeType = SecuritySchemeType = {}));
/**
 * Factory functions for creating API specification objects
 */
class ApiSpecificationFactory {
    static createEmpty(format) {
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
    static fromOpenApiSpec(spec) {
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
    static generateId() {
        return `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    static getDefaultVersion(format) {
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
    static detectOpenApiVersion(version) {
        if (version?.startsWith('3.1')) {
            return ApiSpecFormat.OPENAPI_3_1;
        }
        else if (version?.startsWith('3.0')) {
            return ApiSpecFormat.OPENAPI_3_0;
        }
        else if (version?.startsWith('2.0')) {
            return ApiSpecFormat.SWAGGER_2_0;
        }
        throw new Error(`Unsupported OpenAPI/Swagger version: ${version}`);
    }
    static extractMetadata(info) {
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
    static extractEndpoints(paths) {
        const endpoints = [];
        for (const [path, pathItem] of Object.entries(paths)) {
            for (const [method, operation] of Object.entries(pathItem)) {
                if (this.isHttpMethod(method)) {
                    endpoints.push(this.createEndpoint(path, method, operation, pathItem));
                }
            }
        }
        return endpoints;
    }
    static isHttpMethod(method) {
        return Object.values(HttpMethod).includes(method.toUpperCase());
    }
    static createEndpoint(path, method, operation, pathItem) {
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
    static extractParameters(operationParams, pathParams) {
        const allParams = [...pathParams, ...operationParams];
        return allParams.map(param => ({
            name: param.name,
            in: param.in,
            description: param.description,
            required: param.required,
            deprecated: param.deprecated,
            allowEmptyValue: param.allowEmptyValue,
            style: param.style,
            explode: param.explode,
            allowReserved: param.allowReserved,
            schema: param.schema,
            example: param.example,
            examples: param.examples,
            content: param.content,
        }));
    }
    static extractResponses(responses) {
        return Object.entries(responses).map(([statusCode, response]) => ({
            statusCode,
            description: response.description || '',
            headers: response.headers,
            content: response.content,
            links: response.links,
        }));
    }
    static extractDataModels(schemas) {
        return Object.entries(schemas).map(([name, schema]) => ({
            name,
            schema: schema,
            description: schema.description,
            examples: schema.examples,
        }));
    }
    static extractSecuritySchemes(securitySchemes) {
        return Object.entries(securitySchemes).map(([, scheme]) => ({
            type: scheme.type,
            description: scheme.description,
            name: scheme.name,
            in: scheme.in,
            scheme: scheme.scheme,
            bearerFormat: scheme.bearerFormat,
            flows: scheme.flows,
            openIdConnectUrl: scheme.openIdConnectUrl,
        }));
    }
    static extractServers(servers) {
        return servers.map(server => ({
            url: server.url,
            description: server.description,
            variables: server.variables,
        }));
    }
    static extractTags(tags) {
        return tags.map(tag => ({
            name: tag.name,
            description: tag.description,
            externalDocs: tag.externalDocs,
        }));
    }
    static extractExtensions(obj) {
        const extensions = {};
        for (const [key, value] of Object.entries(obj)) {
            if (key.startsWith('x-')) {
                extensions[key] = value;
            }
        }
        return Object.keys(extensions).length > 0 ? extensions : {};
    }
}
exports.ApiSpecificationFactory = ApiSpecificationFactory;
//# sourceMappingURL=api-spec.js.map