"use strict";
/**
 * JSDoc Parser Implementation
 *
 * Parses JSDoc comments from JavaScript/TypeScript files into standardized AST format.
 * Supports function documentation, type definitions, and API endpoint extraction.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSDocParser = void 0;
const parser_service_1 = require("../parser-service");
const api_spec_1 = require("../../core/models/api-spec");
/**
 * JSDoc Parser class implementing IParser interface
 */
class JSDocParser {
    constructor() {
        this.type = 'jsdoc';
        this.supportedExtensions = ['.js', '.ts', '.jsx', '.tsx', '.mjs'];
    }
    /**
     * Check if this parser can handle the given request
     */
    canParse(request) {
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
    async parse(request) {
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
        }
        catch (error) {
            return this.handleParseError(error, parseId);
        }
    }
    /**
     * Validate parsed JSDoc AST
     */
    async validate(ast, rules) {
        const violations = [];
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
    async loadSource(request) {
        switch (request.source) {
            case 'file':
                return await this.loadFromFile(request.path);
            case 'content':
                return request.path;
            default:
                throw new parser_service_1.ParseError(`Unsupported source type for JSDoc: ${request.source}`, 'UNSUPPORTED_SOURCE');
        }
    }
    async loadFromFile(_path) {
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
    extractJSDocComments(source) {
        const jsdocRegex = /\/\*\*[\s\S]*?\*\//g;
        const matches = source.match(jsdocRegex);
        return matches || [];
    }
    async parseJSDocComments(comments) {
        const parsedComments = [];
        for (const comment of comments) {
            try {
                const parsed = this.parseComment(comment);
                if (parsed) {
                    parsedComments.push(parsed);
                }
            }
            catch (error) {
                // Log error but continue parsing other comments
                // console.warn(`Failed to parse JSDoc comment: ${error}`);
            }
        }
        return parsedComments;
    }
    parseComment(comment) {
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
        const parsed = {
            description: '',
            tags: []
        };
        const lines = cleanComment.split('\n');
        let currentTag = null;
        let descriptionLines = [];
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
            }
            else if (currentTag) {
                // Continuation of current tag
                currentTag.description += (currentTag.description ? ' ' : '') + trimmedLine;
                this.parseTagContent(currentTag);
            }
            else {
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
    parseTagContent(tag) {
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
    parseParamTag(tag) {
        // @param {type} name - description
        const match = tag.description.match(/^\{([^}]+)\}\s+(\S+)\s*-?\s*(.*)$/);
        if (match) {
            tag.type = match[1];
            tag.name = match[2];
            tag.description = match[3];
        }
    }
    parseReturnTag(tag) {
        // @returns {type} description
        const match = tag.description.match(/^\{([^}]+)\}\s*(.*)$/);
        if (match) {
            tag.type = match[1];
            tag.description = match[2];
        }
    }
    parseThrowsTag(tag) {
        // @throws {statusCode} description
        const match = tag.description.match(/^\{([^}]+)\}\s*(.*)$/);
        if (match) {
            tag.statusCode = match[1];
            tag.description = match[2];
        }
    }
    parseRouteTag(tag) {
        // @route METHOD /path
        const match = tag.description.match(/^(\w+)\s+(.+)$/);
        if (match) {
            tag.method = match[1].toUpperCase();
            tag.path = match[2];
        }
    }
    parseTypedefTag(tag) {
        // @typedef {type} name
        const match = tag.description.match(/^\{([^}]+)\}\s+(.+)$/);
        if (match) {
            tag.type = match[1];
            tag.name = match[2];
        }
    }
    parsePropertyTag(tag) {
        // @property {type} name - description
        const match = tag.description.match(/^\{([^}]+)\}\s+(\S+)\s*-?\s*(.*)$/);
        if (match) {
            tag.type = match[1];
            tag.name = match[2];
            tag.description = match[3];
        }
    }
    async convertToAST(parsedDocs, request) {
        const endpoints = this.extractEndpoints(parsedDocs);
        const schemas = this.extractSchemas(parsedDocs);
        const components = this.extractComponents(parsedDocs);
        const metadata = this.extractMetadata(parsedDocs, request);
        // Create ApiSpecification
        const spec = {
            id: this.generateSpecId(),
            format: api_spec_1.ApiSpecFormat.JSDOC,
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
    extractEndpoints(parsedDocs) {
        const endpoints = [];
        for (const doc of parsedDocs) {
            const routeTag = doc.tags.find((tag) => tag.tag === 'route');
            if (!routeTag || !routeTag.method || !routeTag.path) {
                continue;
            }
            const endpoint = {
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
    extractSchemas(parsedDocs) {
        const schemas = [];
        for (const doc of parsedDocs) {
            const typedefTag = doc.tags.find((tag) => tag.tag === 'typedef');
            if (!typedefTag || !typedefTag.name) {
                continue;
            }
            const properties = doc.tags
                .filter((tag) => tag.tag === 'property')
                .reduce((props, tag) => {
                if (tag.name) {
                    props[tag.name] = {
                        type: this.convertJSDocType(tag.type),
                        description: tag.description
                    };
                }
                return props;
            }, {});
            const schema = {
                name: typedefTag.name,
                schema: {
                    type: 'object',
                    properties,
                    description: doc.description
                },
                description: doc.description
            };
            schemas.push(schema);
        }
        return schemas;
    }
    extractComponents(_parsedDocs) {
        return [];
    }
    extractMetadata(parsedDocs, request) {
        const moduleTag = parsedDocs
            .flatMap((doc) => doc.tags)
            .find((tag) => tag.tag === 'module');
        return {
            sourceFile: request.path,
            module: moduleTag?.name || 'Unknown',
            jsdocVersion: '1.0.0',
            totalComments: parsedDocs.length
        };
    }
    extractParameters(doc) {
        return doc.tags
            .filter((tag) => tag.tag === 'param')
            .map((tag) => ({
            name: tag.name,
            in: this.determineParameterLocation(tag.name),
            description: tag.description,
            required: !tag.name.includes('?'),
            schema: {
                type: this.convertJSDocType(tag.type)
            }
        }));
    }
    extractResponses(doc) {
        const responses = [];
        // Extract return/returns tag
        const returnTag = doc.tags.find((tag) => tag.tag === 'returns' || tag.tag === 'return');
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
        const errorTags = doc.tags.filter((tag) => tag.tag === 'throws' || tag.tag === 'exception');
        for (const errorTag of errorTags) {
            responses.push({
                statusCode: errorTag.statusCode || '500',
                description: errorTag.description || 'Error response'
            });
        }
        return responses;
    }
    parseHttpMethod(method) {
        const upperMethod = method.toUpperCase();
        switch (upperMethod) {
            case 'GET': return api_spec_1.HttpMethod.GET;
            case 'POST': return api_spec_1.HttpMethod.POST;
            case 'PUT': return api_spec_1.HttpMethod.PUT;
            case 'PATCH': return api_spec_1.HttpMethod.PATCH;
            case 'DELETE': return api_spec_1.HttpMethod.DELETE;
            case 'HEAD': return api_spec_1.HttpMethod.HEAD;
            case 'OPTIONS': return api_spec_1.HttpMethod.OPTIONS;
            case 'TRACE': return api_spec_1.HttpMethod.TRACE;
            default: return api_spec_1.HttpMethod.GET;
        }
    }
    determineParameterLocation(paramName) {
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
    convertJSDocType(jsdocType) {
        if (!jsdocType)
            return 'any';
        const typeMap = {
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
    endpointToPlainObject(endpoint) {
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
    generateParseId() {
        return `jsdoc_parse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateSpecId() {
        return `jsdoc_spec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    handleParseError(error, parseId) {
        if (error instanceof parser_service_1.ParseError) {
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
                    message: error.message,
                    details: {}
                }]
        };
    }
    // Validation methods
    validateJSDocFormat(ast, violations) {
        if (!ast.metadata) {
            violations.push({
                rule: 'jsdoc-format',
                message: 'Missing metadata in JSDoc AST',
                severity: 'error'
            });
        }
        if (ast.endpoints && Array.isArray(ast.endpoints)) {
            ast.endpoints.forEach((endpoint, index) => {
                if (!endpoint.summary && !endpoint.description) {
                    violations.push({
                        rule: 'jsdoc-format',
                        message: `Endpoint at index ${index} missing documentation`,
                        severity: 'warning'
                    });
                }
            });
        }
    }
    validateFunctionDocumentation(ast, violations) {
        if (ast.endpoints && Array.isArray(ast.endpoints)) {
            ast.endpoints.forEach((endpoint) => {
                if (!endpoint.parameters || endpoint.parameters.length === 0) {
                    violations.push({
                        rule: 'function-documentation',
                        message: `Function ${endpoint.id} should document its parameters`,
                        severity: 'warning'
                    });
                }
                if (!endpoint.responses || endpoint.responses.length === 0) {
                    violations.push({
                        rule: 'function-documentation',
                        message: `Function ${endpoint.id} should document its return value`,
                        severity: 'warning'
                    });
                }
            });
        }
    }
    validateTypeDefinitions(ast, violations) {
        if (ast.schemas && Array.isArray(ast.schemas)) {
            ast.schemas.forEach((schema) => {
                if (!schema.schema || !schema.schema.properties) {
                    violations.push({
                        rule: 'type-definitions',
                        message: `Type definition '${schema.name}' should have properties`,
                        severity: 'warning'
                    });
                }
            });
        }
    }
}
exports.JSDocParser = JSDocParser;
exports.default = JSDocParser;
//# sourceMappingURL=jsdoc-parser.js.map