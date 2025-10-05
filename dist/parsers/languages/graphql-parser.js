"use strict";
/**
 * GraphQL Parser Implementation
 *
 * Parses GraphQL schema definitions and resolvers into standardized AST format.
 * Supports queries, mutations, subscriptions, and type definitions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLParser = void 0;
const parser_service_1 = require("../parser-service");
const api_spec_1 = require("../../core/models/api-spec");
const schema_1 = require("../../core/models/schema");
/**
 * GraphQL Parser class implementing IParser interface
 */
class GraphQLParser {
    constructor() {
        this.type = 'graphql';
        this.supportedExtensions = ['.graphql', '.gql'];
    }
    /**
     * Check if this parser can handle the given request
     */
    canParse(request) {
        if (request.type !== 'graphql') {
            return false;
        }
        // Check file extension
        const path = request.path.toLowerCase();
        return this.supportedExtensions.some(ext => path.endsWith(ext));
    }
    /**
     * Parse GraphQL schema into standardized AST format
     */
    async parse(request) {
        const parseId = this.generateParseId();
        const startTime = Date.now();
        try {
            // Load and parse the GraphQL schema
            const schema = await this.loadSchema(request);
            // Parse GraphQL definitions
            const parsedDefinitions = this.parseGraphQLDefinitions(schema);
            // Convert to standardized AST
            const ast = await this.convertToAST(parsedDefinitions, request);
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
                    sourceType: 'graphql',
                    version: '1.0.0',
                    endpointCount: ast.endpoints.length,
                    schemaCount: ast.schemas.length,
                    parseTime,
                    fileSize: schema.length
                }
            };
        }
        catch (error) {
            return this.handleParseError(error, parseId);
        }
    }
    /**
     * Validate parsed GraphQL AST
     */
    async validate(ast, rules) {
        const violations = [];
        // Standard GraphQL validation rules
        if (!rules || rules.includes('graphql-syntax')) {
            this.validateGraphQLSyntax(ast, violations);
        }
        if (!rules || rules.includes('type-definitions')) {
            this.validateTypeDefinitions(ast, violations);
        }
        if (!rules || rules.includes('resolver-definitions')) {
            this.validateResolverDefinitions(ast, violations);
        }
        return {
            valid: violations.filter(v => v.severity === 'error').length === 0,
            ...(violations.length > 0 && { violations })
        };
    }
    // Private implementation methods
    async loadSchema(request) {
        switch (request.source) {
            case 'file':
                return await this.loadFromFile(request.path);
            case 'content':
                return request.path;
            case 'url':
                return await this.loadFromUrl(request.path);
            default:
                throw new parser_service_1.ParseError(`Unsupported source type for GraphQL: ${request.source}`, 'UNSUPPORTED_SOURCE');
        }
    }
    async loadFromFile(_path) {
        // Placeholder for file loading - would use fs.readFileSync or similar
        // For now, return mock GraphQL schema
        return `
# User Management GraphQL API
# 
# This GraphQL schema provides comprehensive user management operations
# including user creation, retrieval, updating, and deletion with proper
# authentication and authorization support.

scalar DateTime
scalar EmailAddress

# User type represents a user in the system
type User {
  # Unique identifier for the user
  id: ID!
  
  # Full name of the user
  name: String!
  
  # Email address of the user (must be unique)
  email: EmailAddress!
  
  # Timestamp when user was created
  createdAt: DateTime!
  
  # Timestamp when user was last updated
  updatedAt: DateTime!
  
  # Whether the user account is active
  isActive: Boolean!
  
  # User's profile information
  profile: UserProfile
}

# User profile contains additional user information
type UserProfile {
  # User's avatar URL
  avatarUrl: String
  
  # User's bio or description
  bio: String
  
  # User's location
  location: String
  
  # User's website URL
  website: String
  
  # Social media links
  socialLinks: [SocialLink!]!
}

# Social media link
type SocialLink {
  # Platform name (e.g., 'twitter', 'github', 'linkedin')
  platform: String!
  
  # URL to the user's profile on the platform
  url: String!
}

# Input type for creating a new user
input CreateUserInput {
  # Full name of the user (2-100 characters)
  name: String!
  
  # Valid email address (must be unique)
  email: EmailAddress!
  
  # Password for the user account (minimum 8 characters)
  password: String!
  
  # Optional profile information
  profile: CreateUserProfileInput
}

# Input type for user profile creation
input CreateUserProfileInput {
  # User's bio or description
  bio: String
  
  # User's location
  location: String
  
  # User's website URL
  website: String
}

# Input type for updating user information
input UpdateUserInput {
  # Updated name for the user
  name: String
  
  # Updated email for the user
  email: EmailAddress
  
  # Whether the user account should be active
  isActive: Boolean
  
  # Updated profile information
  profile: UpdateUserProfileInput
}

# Input type for updating user profile
input UpdateUserProfileInput {
  # Updated avatar URL
  avatarUrl: String
  
  # Updated bio or description
  bio: String
  
  # Updated location
  location: String
  
  # Updated website URL
  website: String
}

# Input type for user filtering
input UserFilter {
  # Filter by name (partial match)
  name: String
  
  # Filter by email (partial match)
  email: String
  
  # Filter by active status
  isActive: Boolean
  
  # Filter by creation date range
  createdAfter: DateTime
  createdBefore: DateTime
}

# Input type for pagination
input PaginationInput {
  # Number of items to return (default: 20, max: 100)
  limit: Int = 20
  
  # Number of items to skip
  offset: Int = 0
}

# Paginated user results
type UserConnection {
  # List of users
  users: [User!]!
  
  # Total number of users matching the filter
  totalCount: Int!
  
  # Whether there are more users available
  hasNextPage: Boolean!
  
  # Whether there are previous users available
  hasPreviousPage: Boolean!
}

# Response type for user mutations
type UserMutationResponse {
  # Whether the operation was successful
  success: Boolean!
  
  # User data (if successful)
  user: User
  
  # Error message (if failed)
  error: String
  
  # Error code for programmatic handling
  errorCode: String
}

# Delete response
type DeleteResponse {
  # Whether the deletion was successful
  success: Boolean!
  
  # Error message (if failed)
  error: String
  
  # Number of affected records
  affectedRows: Int
}

# Root Query type
type Query {
  # Get all users with optional filtering and pagination
  users(
    # Optional filter criteria
    filter: UserFilter
    
    # Pagination options
    pagination: PaginationInput
  ): UserConnection!
  
  # Get a specific user by ID
  user(
    # User ID to retrieve
    id: ID!
  ): User
  
  # Get current authenticated user
  me: User
  
  # Search users by name or email
  searchUsers(
    # Search query string
    query: String!
    
    # Pagination options
    pagination: PaginationInput
  ): UserConnection!
}

# Root Mutation type
type Mutation {
  # Create a new user account
  createUser(
    # User creation data
    input: CreateUserInput!
  ): UserMutationResponse!
  
  # Update an existing user
  updateUser(
    # User ID to update
    id: ID!
    
    # Updated user data
    input: UpdateUserInput!
  ): UserMutationResponse!
  
  # Delete a user account (soft delete)
  deleteUser(
    # User ID to delete
    id: ID!
  ): DeleteResponse!
  
  # Activate a user account
  activateUser(
    # User ID to activate
    id: ID!
  ): UserMutationResponse!
  
  # Deactivate a user account
  deactivateUser(
    # User ID to deactivate
    id: ID!
  ): UserMutationResponse!
}

# Root Subscription type
type Subscription {
  # Subscribe to user creation events
  userCreated: User!
  
  # Subscribe to user update events
  userUpdated: User!
  
  # Subscribe to user deletion events
  userDeleted: ID!
  
  # Subscribe to user status changes
  userStatusChanged: User!
}

# Schema definition
schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
`;
    }
    async loadFromUrl(_url) {
        throw new parser_service_1.ParseError('URL loading not yet implemented for GraphQL', 'NOT_IMPLEMENTED');
    }
    parseGraphQLDefinitions(schema) {
        const definitions = {
            types: [],
            queries: [],
            mutations: [],
            subscriptions: [],
            inputs: [],
            scalars: [],
            enums: [],
            interfaces: [],
            unions: []
        };
        // Simple regex-based parsing (in real implementation, would use graphql-js parser)
        this.parseTypes(schema, definitions);
        this.parseQueries(schema, definitions);
        this.parseMutations(schema, definitions);
        this.parseSubscriptions(schema, definitions);
        this.parseInputs(schema, definitions);
        this.parseScalars(schema, definitions);
        return definitions;
    }
    parseTypes(schema, definitions) {
        const typeRegex = /type\s+(\w+)\s*{([^}]*)}/g;
        let match;
        while ((match = typeRegex.exec(schema)) !== null) {
            const [, name, fieldsStr] = match;
            if (name === 'Query' || name === 'Mutation' || name === 'Subscription') {
                continue; // Skip root types, handled separately
            }
            const fields = this.parseFields(fieldsStr || '');
            definitions.types.push({
                name,
                kind: 'OBJECT',
                fields,
                description: this.extractDescription(schema, match.index)
            });
        }
    }
    parseQueries(schema, definitions) {
        const queryMatch = schema.match(/type\s+Query\s*{([^}]*)}/);
        if (queryMatch) {
            const fieldsStr = queryMatch[1];
            const fields = this.parseFields(fieldsStr || '');
            definitions.queries = fields.map((field) => ({
                ...field,
                operation: 'query'
            }));
        }
    }
    parseMutations(schema, definitions) {
        const mutationMatch = schema.match(/type\s+Mutation\s*{([^}]*)}/);
        if (mutationMatch) {
            const fieldsStr = mutationMatch[1];
            const fields = this.parseFields(fieldsStr || '');
            definitions.mutations = fields.map((field) => ({
                ...field,
                operation: 'mutation'
            }));
        }
    }
    parseSubscriptions(schema, definitions) {
        const subscriptionMatch = schema.match(/type\s+Subscription\s*{([^}]*)}/);
        if (subscriptionMatch) {
            const fieldsStr = subscriptionMatch[1];
            const fields = this.parseFields(fieldsStr || '');
            definitions.subscriptions = fields.map((field) => ({
                ...field,
                operation: 'subscription'
            }));
        }
    }
    parseInputs(schema, definitions) {
        const inputRegex = /input\s+(\w+)\s*{([^}]*)}/g;
        let match;
        while ((match = inputRegex.exec(schema)) !== null) {
            const [, name, fieldsStr] = match;
            const fields = this.parseFields(fieldsStr || '');
            definitions.inputs.push({
                name,
                kind: 'INPUT_OBJECT',
                fields,
                description: this.extractDescription(schema, match.index)
            });
        }
    }
    parseScalars(schema, definitions) {
        const scalarRegex = /scalar\s+(\w+)/g;
        let match;
        while ((match = scalarRegex.exec(schema)) !== null) {
            const [, name] = match;
            definitions.scalars.push({
                name,
                kind: 'SCALAR',
                description: this.extractDescription(schema, match.index)
            });
        }
    }
    parseFields(fieldsStr) {
        const fields = [];
        const lines = fieldsStr.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
        for (const line of lines) {
            const field = this.parseField(line);
            if (field) {
                fields.push(field);
            }
        }
        return fields;
    }
    parseField(fieldStr) {
        // Parse field definition: fieldName(args): Type!
        const fieldMatch = fieldStr.match(/(\w+)(?:\(([^)]*)\))?\s*:\s*(.+?)(?:\s*#\s*(.*))?$/);
        if (!fieldMatch) {
            return null;
        }
        const [, name, argsStr, typeStr, description] = fieldMatch;
        const args = argsStr ? this.parseArguments(argsStr) : [];
        const type = this.parseType(typeStr || '');
        return {
            name,
            type,
            args,
            description: description?.trim() || ''
        };
    }
    parseArguments(argsStr) {
        const args = [];
        const argPairs = argsStr.split(',').map(arg => arg.trim()).filter(arg => arg);
        for (const argPair of argPairs) {
            const argMatch = argPair.match(/(\w+)\s*:\s*(.+?)(?:\s*=\s*(.+))?$/);
            if (argMatch) {
                const [, name, typeStr, defaultValue] = argMatch;
                args.push({
                    name,
                    type: this.parseType(typeStr || ''),
                    defaultValue: defaultValue?.trim(),
                    description: ''
                });
            }
        }
        return args;
    }
    parseType(typeStr) {
        const trimmed = typeStr.trim();
        // Handle non-null types
        if (trimmed.endsWith('!')) {
            return {
                kind: 'NON_NULL',
                ofType: this.parseType(trimmed.slice(0, -1))
            };
        }
        // Handle list types
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            return {
                kind: 'LIST',
                ofType: this.parseType(trimmed.slice(1, -1))
            };
        }
        // Handle scalar/object types
        return {
            kind: this.getTypeKind(trimmed),
            name: trimmed
        };
    }
    getTypeKind(typeName) {
        const scalarTypes = ['String', 'Int', 'Float', 'Boolean', 'ID', 'DateTime', 'EmailAddress'];
        if (scalarTypes.includes(typeName)) {
            return 'SCALAR';
        }
        return 'OBJECT';
    }
    extractDescription(schema, index) {
        // Look for comments before the definition
        const beforeDef = schema.substring(0, index);
        const lines = beforeDef.split('\n').reverse();
        const descriptionLines = [];
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('#')) {
                descriptionLines.unshift(trimmed.replace(/^#\s*/, ''));
            }
            else if (trimmed === '') {
                continue;
            }
            else {
                break;
            }
        }
        return descriptionLines.join(' ').trim();
    }
    async convertToAST(definitions, request) {
        const endpoints = this.extractEndpoints(definitions);
        const schemas = this.extractSchemas(definitions);
        const components = this.extractComponents(definitions);
        const metadata = this.extractMetadata(definitions, request);
        // Create ApiSpecification
        const spec = {
            id: this.generateSpecId(),
            format: api_spec_1.ApiSpecFormat.OPENAPI_3_0, // GraphQL doesn't have its own enum value, using OpenAPI
            version: '1.0.0',
            metadata: {
                title: 'GraphQL API',
                description: 'API documentation extracted from GraphQL schema',
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
    extractEndpoints(definitions) {
        const endpoints = [];
        // Convert GraphQL operations to REST-like endpoints
        [...definitions.queries, ...definitions.mutations, ...definitions.subscriptions].forEach((operation) => {
            const method = this.operationToHttpMethod(operation.operation);
            const path = this.operationToPath(operation.name, operation.operation);
            const endpoint = {
                id: `${operation.operation}_${operation.name}`,
                path,
                method,
                summary: operation.description || `${operation.operation} ${operation.name}`,
                description: operation.description || '',
                tags: [operation.operation],
                parameters: this.convertArgsToParameters(operation.args || []),
                responses: this.generateResponsesForOperation(operation),
                deprecated: false
            };
            endpoints.push(endpoint);
        });
        return endpoints;
    }
    extractSchemas(definitions) {
        const schemas = [];
        // Convert GraphQL types to schemas
        [...definitions.types, ...definitions.inputs].forEach((type) => {
            const properties = {};
            if (type.fields) {
                type.fields.forEach((field) => {
                    properties[field.name] = {
                        type: this.graphqlTypeToJsonType(field.type),
                        description: field.description
                    };
                });
            }
            const schema = {
                name: type.name,
                schema: {
                    type: schema_1.SchemaType.OBJECT,
                    properties,
                    description: type.description
                },
                description: type.description
            };
            schemas.push(schema);
        });
        return schemas;
    }
    extractComponents(definitions) {
        const components = [];
        // Add scalars as components
        definitions.scalars.forEach((scalar) => {
            components.push({
                type: 'scalar',
                name: scalar.name,
                definition: scalar,
                source: 'graphql'
            });
        });
        return components;
    }
    extractMetadata(definitions, request) {
        return {
            sourceFile: request.path,
            schemaType: 'graphql',
            typeCount: definitions.types.length,
            queryCount: definitions.queries.length,
            mutationCount: definitions.mutations.length,
            subscriptionCount: definitions.subscriptions.length,
            inputCount: definitions.inputs.length,
            scalarCount: definitions.scalars.length
        };
    }
    operationToHttpMethod(operation) {
        switch (operation.toLowerCase()) {
            case 'query': return api_spec_1.HttpMethod.GET;
            case 'mutation': return api_spec_1.HttpMethod.POST;
            case 'subscription': return api_spec_1.HttpMethod.GET; // Or could be WebSocket
            default: return api_spec_1.HttpMethod.POST;
        }
    }
    operationToPath(operationName, operationType) {
        return `/graphql/${operationType}/${operationName}`;
    }
    convertArgsToParameters(args) {
        return args.map(arg => ({
            name: arg.name,
            in: 'query',
            description: arg.description,
            required: this.isRequiredType(arg.type),
            schema: {
                type: this.graphqlTypeToJsonType(arg.type),
                default: arg.defaultValue
            }
        }));
    }
    generateResponsesForOperation(operation) {
        return [{
                statusCode: '200',
                description: 'Successful GraphQL response',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: this.graphqlTypeToJsonType(operation.type)
                                },
                                errors: {
                                    type: 'array',
                                    items: { type: 'object' }
                                }
                            }
                        }
                    }
                }
            }];
    }
    isRequiredType(type) {
        return type?.kind === 'NON_NULL';
    }
    graphqlTypeToJsonType(type) {
        if (!type)
            return 'object';
        if (type.kind === 'NON_NULL' || type.kind === 'LIST') {
            return this.graphqlTypeToJsonType(type.ofType);
        }
        if (type.kind === 'SCALAR') {
            const scalarMap = {
                'String': 'string',
                'Int': 'integer',
                'Float': 'number',
                'Boolean': 'boolean',
                'ID': 'string',
                'DateTime': 'string',
                'EmailAddress': 'string'
            };
            return scalarMap[type.name] || 'string';
        }
        if (type.kind === 'LIST') {
            return 'array';
        }
        return 'object';
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
        return `graphql_parse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateSpecId() {
        return `graphql_spec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
    validateGraphQLSyntax(ast, violations) {
        if (!ast.metadata) {
            violations.push({
                rule: 'graphql-syntax',
                message: 'Missing metadata in GraphQL AST',
                severity: 'error'
            });
        }
        if (!ast.endpoints || !Array.isArray(ast.endpoints) || ast.endpoints.length === 0) {
            violations.push({
                rule: 'graphql-syntax',
                message: 'GraphQL schema should define at least one operation',
                severity: 'warning'
            });
        }
    }
    validateTypeDefinitions(ast, violations) {
        if (ast.schemas && Array.isArray(ast.schemas)) {
            ast.schemas.forEach((schema) => {
                if (!schema.name) {
                    violations.push({
                        rule: 'type-definitions',
                        message: 'GraphQL type missing name',
                        severity: 'error'
                    });
                }
                if (!schema.schema || !schema.schema.properties || Object.keys(schema.schema.properties).length === 0) {
                    violations.push({
                        rule: 'type-definitions',
                        message: `GraphQL type '${schema.name}' should have at least one field`,
                        severity: 'warning'
                    });
                }
            });
        }
    }
    validateResolverDefinitions(ast, violations) {
        if (ast.endpoints && Array.isArray(ast.endpoints)) {
            ast.endpoints.forEach((endpoint) => {
                if (!endpoint.summary && !endpoint.description) {
                    violations.push({
                        rule: 'resolver-definitions',
                        message: `GraphQL operation '${endpoint.id}' should have documentation`,
                        severity: 'warning'
                    });
                }
            });
        }
    }
}
exports.GraphQLParser = GraphQLParser;
exports.default = GraphQLParser;
//# sourceMappingURL=graphql-parser.js.map