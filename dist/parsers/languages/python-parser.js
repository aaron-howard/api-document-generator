"use strict";
/**
 * Python Docstring Parser Implementation
 *
 * Parses Python docstrings (Google, NumPy, Sphinx formats) into standardized AST format.
 * Supports function documentation, class documentation, and API endpoint extraction.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonParser = void 0;
const parser_service_1 = require("../parser-service");
const api_spec_1 = require("../../core/models/api-spec");
const schema_1 = require("../../core/models/schema");
/**
 * Python Docstring Parser class implementing IParser interface
 */
class PythonParser {
    constructor() {
        this.type = 'python';
        this.supportedExtensions = ['.py', '.pyi'];
    }
    /**
     * Check if this parser can handle the given request
     */
    canParse(request) {
        if (request.type !== 'python-docstring') {
            return false;
        }
        // Check file extension
        const path = request.path.toLowerCase();
        return this.supportedExtensions.some(ext => path.endsWith(ext));
    }
    /**
     * Parse Python docstrings into standardized AST format
     */
    async parse(request) {
        const parseId = this.generateParseId();
        const startTime = Date.now();
        try {
            // Load and parse the source file
            const source = await this.loadSource(request);
            // Extract Python docstrings
            const docstrings = this.extractDocstrings(source);
            // Parse docstrings into structured data
            const parsedDocs = await this.parseDocstrings(docstrings);
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
                    sourceType: 'python',
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
     * Validate parsed Python docstring AST
     */
    async validate(ast, rules) {
        const violations = [];
        // Standard Python docstring validation rules
        if (!rules || rules.includes('docstring-format')) {
            this.validateDocstringFormat(ast, violations);
        }
        if (!rules || rules.includes('function-documentation')) {
            this.validateFunctionDocumentation(ast, violations);
        }
        if (!rules || rules.includes('type-annotations')) {
            this.validateTypeAnnotations(ast, violations);
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
                throw new parser_service_1.ParseError(`Unsupported source type for Python: ${request.source}`, 'UNSUPPORTED_SOURCE');
        }
    }
    async loadFromFile(_path) {
        // Placeholder for file loading - would use fs.readFileSync or similar
        // For now, return mock Python with docstrings
        return `
"""
User API Module

This module provides REST API endpoints for user management operations.
It supports user creation, retrieval, updating, and deletion.

Routes:
    GET /api/users - Get all users
    POST /api/users - Create a new user
    GET /api/users/{id} - Get user by ID
    PUT /api/users/{id} - Update user
    DELETE /api/users/{id} - Delete user

Author: API Documentation Generator
Version: 1.0.0
"""

from typing import List, Optional, Dict, Any
from dataclasses import dataclass
from datetime import datetime


@dataclass
class User:
    """
    User data model.
    
    Represents a user in the system with all necessary fields for
    user management and authentication.
    
    Attributes:
        id (int): Unique identifier for the user
        name (str): Full name of the user
        email (str): Email address of the user
        password_hash (str): Hashed password for authentication
        created_at (datetime): Timestamp when user was created
        updated_at (datetime): Timestamp when user was last updated
        is_active (bool): Whether the user account is active
        
    Example:
        >>> user = User(
        ...     id=1,
        ...     name="John Doe",
        ...     email="john@example.com",
        ...     password_hash="hashed_password",
        ...     created_at=datetime.now(),
        ...     updated_at=datetime.now(),
        ...     is_active=True
        ... )
    """
    id: int
    name: str
    email: str
    password_hash: str
    created_at: datetime
    updated_at: datetime
    is_active: bool = True


@dataclass
class UserCreateRequest:
    """
    Request model for creating a new user.
    
    Contains the necessary fields required to create a new user account.
    All fields are required unless specified otherwise.
    
    Attributes:
        name (str): Full name of the user (2-100 characters)
        email (str): Valid email address
        password (str): Plain text password (min 8 characters)
        
    Example:
        >>> request = UserCreateRequest(
        ...     name="Jane Smith",
        ...     email="jane@example.com",
        ...     password="secure_password123"
        ... )
    """
    name: str
    email: str
    password: str


def get_users(limit: Optional[int] = None, offset: int = 0) -> List[User]:
    """
    Retrieve a list of all users.
    
    Fetches users from the database with optional pagination support.
    Returns active users only by default.
    
    Route:
        GET /api/users
        
    Args:
        limit (Optional[int]): Maximum number of users to return.
            If None, returns all users. Defaults to None.
        offset (int): Number of users to skip for pagination.
            Must be non-negative. Defaults to 0.
            
    Returns:
        List[User]: List of user objects matching the criteria.
        Returns empty list if no users found.
        
    Raises:
        ValueError: If limit is negative or offset is negative.
        DatabaseError: If database connection fails.
        
    Example:
        >>> users = get_users(limit=10, offset=0)
        >>> len(users)
        10
        >>> first_user = users[0]
        >>> first_user.name
        'John Doe'
        
    HTTP Status Codes:
        200: Success - Returns list of users
        400: Bad Request - Invalid parameters
        500: Internal Server Error - Database error
    """
    # Implementation placeholder
    return []


def create_user(user_data: UserCreateRequest) -> User:
    """
    Create a new user account.
    
    Validates the input data, hashes the password, and creates a new user
    record in the database. Email must be unique across all users.
    
    Route:
        POST /api/users
        
    Args:
        user_data (UserCreateRequest): User creation data containing
            name, email, and password. All fields are required.
            
    Returns:
        User: The newly created user object with generated ID and timestamps.
        Password field is excluded from the response for security.
        
    Raises:
        ValidationError: If user_data validation fails.
        DuplicateEmailError: If email already exists in the system.
        DatabaseError: If user creation fails due to database issues.
        
    Example:
        >>> request = UserCreateRequest(
        ...     name="Alice Johnson",
        ...     email="alice@example.com",
        ...     password="my_password"
        ... )
        >>> user = create_user(request)
        >>> user.name
        'Alice Johnson'
        >>> user.id
        123
        
    HTTP Status Codes:
        201: Created - User successfully created
        400: Bad Request - Validation error
        409: Conflict - Email already exists
        500: Internal Server Error - Database error
    """
    # Implementation placeholder
    return User(
        id=1,
        name=user_data.name,
        email=user_data.email,
        password_hash="hashed",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )


def get_user_by_id(user_id: int) -> Optional[User]:
    """
    Retrieve a specific user by their ID.
    
    Searches for a user with the given ID in the database.
    Only returns active users.
    
    Route:
        GET /api/users/{user_id}
        
    Args:
        user_id (int): The unique identifier of the user.
            Must be a positive integer.
            
    Returns:
        Optional[User]: User object if found, None if not found
        or if user is inactive.
        
    Raises:
        ValueError: If user_id is not a positive integer.
        DatabaseError: If database query fails.
        
    Example:
        >>> user = get_user_by_id(123)
        >>> if user:
        ...     print(f"Found user: {user.name}")
        ... else:
        ...     print("User not found")
        Found user: John Doe
        
    HTTP Status Codes:
        200: Success - User found and returned
        404: Not Found - User not found or inactive
        400: Bad Request - Invalid user ID
        500: Internal Server Error - Database error
    """
    # Implementation placeholder
    return None


def update_user(user_id: int, user_data: Dict[str, Any]) -> Optional[User]:
    """
    Update an existing user's information.
    
    Updates the specified user with the provided data. Only provided
    fields will be updated. Email uniqueness is enforced.
    
    Route:
        PUT /api/users/{user_id}
        
    Args:
        user_id (int): The unique identifier of the user to update.
            Must be a positive integer.
        user_data (Dict[str, Any]): Dictionary containing fields to update.
            Supported fields: name, email, is_active.
            
    Returns:
        Optional[User]: Updated user object if successful, None if user
        not found or update failed.
        
    Raises:
        ValueError: If user_id is invalid or user_data contains invalid fields.
        DuplicateEmailError: If email update conflicts with existing user.
        DatabaseError: If update operation fails.
        
    Example:
        >>> updated_user = update_user(123, {"name": "John Smith"})
        >>> updated_user.name if updated_user else "Not found"
        'John Smith'
        
    HTTP Status Codes:
        200: Success - User updated successfully
        400: Bad Request - Invalid data or user ID
        404: Not Found - User not found
        409: Conflict - Email already exists
        500: Internal Server Error - Database error
    """
    # Implementation placeholder
    return None


def delete_user(user_id: int) -> bool:
    """
    Delete a user account.
    
    Soft deletes a user by marking them as inactive rather than
    removing the record completely.
    
    Route:
        DELETE /api/users/{user_id}
        
    Args:
        user_id (int): The unique identifier of the user to delete.
            Must be a positive integer.
            
    Returns:
        bool: True if user was successfully deleted, False if user
        not found or already inactive.
        
    Raises:
        ValueError: If user_id is not a positive integer.
        DatabaseError: If delete operation fails.
        
    Example:
        >>> success = delete_user(123)
        >>> success
        True
        
    HTTP Status Codes:
        200: Success - User deleted successfully
        404: Not Found - User not found
        400: Bad Request - Invalid user ID
        500: Internal Server Error - Database error
    """
    # Implementation placeholder
    return True
`;
    }
    extractDocstrings(source) {
        const docstrings = [];
        // Patterns for different Python constructs with docstrings
        const patterns = [
            // Module docstring
            { type: 'module', regex: /^"""([\s\S]*?)"""/m },
            // Class docstring
            { type: 'class', regex: /class\s+(\w+).*?:\s*"""([\s\S]*?)"""/g },
            // Function docstring
            { type: 'function', regex: /def\s+(\w+)\s*\([^)]*\)\s*(?:->\s*[^:]+)?\s*:\s*"""([\s\S]*?)"""/g }
        ];
        for (const pattern of patterns) {
            if (pattern.type === 'module') {
                const match = source.match(pattern.regex);
                if (match) {
                    docstrings.push({
                        type: 'module',
                        name: 'module',
                        docstring: match[1],
                        location: { line: 1, column: 1 }
                    });
                }
            }
            else {
                let match;
                while ((match = pattern.regex.exec(source)) !== null) {
                    docstrings.push({
                        type: pattern.type,
                        name: match[1],
                        docstring: match[2],
                        location: this.getLineColumn(source, match.index)
                    });
                }
            }
        }
        return docstrings;
    }
    getLineColumn(source, index) {
        const lines = source.substring(0, index).split('\n');
        return {
            line: lines.length,
            column: (lines[lines.length - 1] || '').length + 1
        };
    }
    async parseDocstrings(docstrings) {
        const parsedDocs = [];
        for (const docstring of docstrings) {
            try {
                const parsed = this.parseDocstring(docstring);
                if (parsed) {
                    parsedDocs.push(parsed);
                }
            }
            catch (error) {
                // Log error but continue parsing other docstrings
                // console.warn(`Failed to parse Python docstring: ${error}`);
            }
        }
        return parsedDocs;
    }
    parseDocstring(docstring) {
        const { type, name, docstring: content, location } = docstring;
        if (!content?.trim()) {
            return null;
        }
        const parsed = {
            type,
            name,
            location,
            description: '',
            summary: '',
            sections: {}
        };
        // Parse different docstring formats (Google, NumPy, Sphinx)
        const format = this.detectDocstringFormat(content);
        switch (format) {
            case 'google':
                this.parseGoogleDocstring(content, parsed);
                break;
            case 'numpy':
                this.parseNumpyDocstring(content, parsed);
                break;
            case 'sphinx':
                this.parseSphinxDocstring(content, parsed);
                break;
            default:
                this.parseSimpleDocstring(content, parsed);
                break;
        }
        return parsed;
    }
    detectDocstringFormat(content) {
        if (content.includes('Args:') || content.includes('Returns:') || content.includes('Raises:')) {
            return 'google';
        }
        if (content.includes('Parameters\n') || content.includes('Returns\n')) {
            return 'numpy';
        }
        if (content.includes(':param') || content.includes(':returns:') || content.includes(':raises:')) {
            return 'sphinx';
        }
        return 'simple';
    }
    parseGoogleDocstring(content, parsed) {
        const lines = content.split('\n').map(line => line.trim());
        let currentSection = 'description';
        let sectionContent = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (!line)
                continue;
            // Check for section headers
            if (line.match(/^(Args?|Arguments?|Parameters?|Param|Returns?|Return|Yields?|Yield|Raises?|Raise|Note|Notes?|Example|Examples?|Attributes?|Attribute):\s*$/)) {
                // Save previous section
                if (sectionContent.length > 0) {
                    this.saveSection(parsed, currentSection, sectionContent);
                    sectionContent = [];
                }
                currentSection = line.replace(':', '').toLowerCase();
            }
            else {
                sectionContent.push(line);
            }
        }
        // Save last section
        if (sectionContent.length > 0) {
            this.saveSection(parsed, currentSection, sectionContent);
        }
        // Extract summary (first line) and description
        const descriptionLines = parsed.sections.description || [];
        if (descriptionLines.length > 0) {
            parsed.summary = descriptionLines[0];
            parsed.description = descriptionLines.join(' ').trim();
        }
    }
    parseNumpyDocstring(content, parsed) {
        // Simplified NumPy format parsing
        this.parseGoogleDocstring(content, parsed);
    }
    parseSphinxDocstring(content, parsed) {
        const lines = content.split('\n');
        let currentSection = 'description';
        let sectionContent = [];
        for (const line of lines) {
            const trimmedLine = line.trim();
            // Check for Sphinx directives
            if (trimmedLine.match(/^:(param|arg|argument|type|returns?|return|rtype|raises?|raise|note|example)\s/)) {
                // Save previous section
                if (sectionContent.length > 0) {
                    this.saveSection(parsed, currentSection, sectionContent);
                    sectionContent = [];
                }
                const directiveMatch = trimmedLine.match(/^:(\w+)(?:\s+(\w+))?\s*:\s*(.*)$/);
                if (directiveMatch) {
                    const [, directive, paramName, description] = directiveMatch;
                    currentSection = directive || 'unknown';
                    if (paramName) {
                        sectionContent.push(`${paramName}: ${description || ''}`);
                    }
                    else {
                        sectionContent.push(description || '');
                    }
                }
            }
            else {
                sectionContent.push(trimmedLine);
            }
        }
        // Save last section
        if (sectionContent.length > 0) {
            this.saveSection(parsed, currentSection, sectionContent);
        }
        // Extract summary and description
        const descriptionLines = parsed.sections.description || [];
        if (descriptionLines.length > 0) {
            parsed.summary = descriptionLines[0];
            parsed.description = descriptionLines.join(' ').trim();
        }
    }
    parseSimpleDocstring(content, parsed) {
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        if (lines.length > 0) {
            parsed.summary = lines[0];
            parsed.description = lines.join(' ').trim();
            parsed.sections.description = lines;
        }
    }
    saveSection(parsed, sectionName, content) {
        const cleanContent = content.filter(line => line.trim());
        if (cleanContent.length === 0) {
            return;
        }
        switch (sectionName) {
            case 'args':
            case 'arguments':
            case 'parameters':
            case 'param':
                parsed.sections.parameters = this.parseParameterSection(cleanContent);
                break;
            case 'returns':
            case 'return':
                parsed.sections.returns = this.parseReturnSection(cleanContent);
                break;
            case 'raises':
            case 'raise':
                parsed.sections.raises = this.parseRaisesSection(cleanContent);
                break;
            case 'example':
            case 'examples':
                parsed.sections.examples = cleanContent;
                break;
            default:
                parsed.sections[sectionName] = cleanContent;
                break;
        }
    }
    parseParameterSection(lines) {
        const parameters = [];
        for (const line of lines) {
            const paramMatch = line.match(/^(\w+)\s*(?:\(([^)]+)\))?\s*:\s*(.*)$/);
            if (paramMatch) {
                const [, name, type, description] = paramMatch;
                parameters.push({
                    name,
                    type: type || 'any',
                    description: (description || '').trim(),
                    required: !(description || '').includes('optional') && !(description || '').includes('Optional')
                });
            }
        }
        return parameters;
    }
    parseReturnSection(lines) {
        const returnText = lines.join(' ').trim();
        const returnMatch = returnText.match(/^([^:]+):\s*(.*)$/);
        if (returnMatch) {
            const [, type, description] = returnMatch;
            return {
                type: (type || '').trim(),
                description: (description || '').trim()
            };
        }
        return {
            type: 'any',
            description: returnText
        };
    }
    parseRaisesSection(lines) {
        const raises = [];
        for (const line of lines) {
            const raiseMatch = line.match(/^(\w+)\s*:\s*(.*)$/);
            if (raiseMatch) {
                const [, exceptionType, description] = raiseMatch;
                raises.push({
                    exception: exceptionType,
                    description: (description || '').trim()
                });
            }
        }
        return raises;
    }
    async convertToAST(parsedDocs, request) {
        const endpoints = this.extractEndpoints(parsedDocs);
        const schemas = this.extractSchemas(parsedDocs);
        const components = this.extractComponents(parsedDocs);
        const metadata = this.extractMetadata(parsedDocs, request);
        // Create ApiSpecification
        const spec = {
            id: this.generateSpecId(),
            format: api_spec_1.ApiSpecFormat.PYTHON_DOCSTRING,
            version: '1.0.0',
            metadata: {
                title: 'Python API',
                description: 'API documentation extracted from Python docstrings',
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
            if (doc.type !== 'function') {
                continue;
            }
            // Look for route information in docstring
            const routeInfo = this.extractRouteInfo(doc);
            if (!routeInfo) {
                continue;
            }
            const endpoint = {
                id: `${routeInfo.method}_${doc.name}`,
                path: routeInfo.path,
                method: routeInfo.method,
                summary: doc.summary,
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
    extractRouteInfo(doc) {
        const description = doc.description || '';
        // Look for route information in various places
        const routePatterns = [
            /Route:\s*(\w+)\s+([\/\w{}-]+)/i,
            /(\w+)\s+([\/\w{}-]+)/i,
            /@route\s+(\w+)\s+([\/\w{}-]+)/i
        ];
        for (const pattern of routePatterns) {
            const match = description.match(pattern);
            if (match) {
                const method = this.parseHttpMethod(match[1]);
                const path = match[2];
                return { method, path };
            }
        }
        // Check for common function name patterns
        const functionName = doc.name.toLowerCase();
        if (functionName.startsWith('get_')) {
            return {
                method: api_spec_1.HttpMethod.GET,
                path: `/api/${functionName.replace('get_', '').replace(/_/g, '/')}`
            };
        }
        if (functionName.startsWith('create_')) {
            return {
                method: api_spec_1.HttpMethod.POST,
                path: `/api/${functionName.replace('create_', '').replace(/_/g, '/')}`
            };
        }
        if (functionName.startsWith('update_')) {
            return {
                method: api_spec_1.HttpMethod.PUT,
                path: `/api/${functionName.replace('update_', '').replace(/_/g, '/')}`
            };
        }
        if (functionName.startsWith('delete_')) {
            return {
                method: api_spec_1.HttpMethod.DELETE,
                path: `/api/${functionName.replace('delete_', '').replace(/_/g, '/')}`
            };
        }
        return null;
    }
    extractSchemas(parsedDocs) {
        const schemas = [];
        for (const doc of parsedDocs) {
            if (doc.type !== 'class') {
                continue;
            }
            const properties = {};
            // Extract attributes from docstring
            if (doc.sections?.attributes) {
                for (const attr of doc.sections.attributes) {
                    const attrMatch = attr.match(/^(\w+)\s*(?:\(([^)]+)\))?\s*:\s*(.*)$/);
                    if (attrMatch) {
                        const [, name, type, description] = attrMatch;
                        properties[name] = {
                            type: this.convertPythonType(type || 'any'),
                            description: description.trim()
                        };
                    }
                }
            }
            const schema = {
                name: doc.name,
                schema: {
                    type: schema_1.SchemaType.OBJECT,
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
        const moduleDoc = parsedDocs.find(doc => doc.type === 'module');
        return {
            sourceFile: request.path,
            module: moduleDoc?.description || 'Unknown',
            docstringCount: parsedDocs.length,
            functions: parsedDocs.filter(doc => doc.type === 'function').length,
            classes: parsedDocs.filter(doc => doc.type === 'class').length
        };
    }
    extractParameters(doc) {
        const parameters = [];
        if (doc.sections?.parameters) {
            for (const param of doc.sections.parameters) {
                parameters.push({
                    name: param.name,
                    in: this.determineParameterLocation(param.name, doc.name),
                    description: param.description,
                    required: param.required,
                    schema: {
                        type: this.convertPythonType(param.type)
                    }
                });
            }
        }
        return parameters;
    }
    extractResponses(doc) {
        const responses = [];
        // Extract return information
        if (doc.sections?.returns) {
            const returnInfo = doc.sections.returns;
            responses.push({
                statusCode: '200',
                description: returnInfo.description || 'Successful response',
                content: {
                    'application/json': {
                        schema: {
                            type: this.convertPythonType(returnInfo.type)
                        }
                    }
                }
            });
        }
        // Extract exception information
        if (doc.sections?.raises) {
            for (const raise of doc.sections.raises) {
                const statusCode = this.mapExceptionToStatus(raise.exception);
                responses.push({
                    statusCode,
                    description: raise.description || `${raise.exception} error`
                });
            }
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
    determineParameterLocation(paramName, functionName) {
        if (paramName.includes('id') && functionName.includes('by_id')) {
            return 'path';
        }
        if (paramName.includes('limit') || paramName.includes('offset') || paramName.includes('page')) {
            return 'query';
        }
        if (paramName.includes('data') || paramName.includes('request')) {
            return 'body';
        }
        return 'query';
    }
    convertPythonType(pythonType) {
        if (!pythonType)
            return 'any';
        const typeMap = {
            'str': 'string',
            'int': 'integer',
            'float': 'number',
            'bool': 'boolean',
            'list': 'array',
            'dict': 'object',
            'List': 'array',
            'Dict': 'object',
            'Optional': 'string',
            'Union': 'string',
            'Any': 'any',
            'datetime': 'string'
        };
        // Handle generic types
        if (pythonType.includes('[')) {
            const baseType = pythonType.split('[')[0];
            return typeMap[baseType || ''] || 'object';
        }
        return typeMap[pythonType] || 'object';
    }
    mapExceptionToStatus(exception) {
        const statusMap = {
            'ValueError': '400',
            'ValidationError': '400',
            'DuplicateEmailError': '409',
            'DatabaseError': '500',
            'NotFoundError': '404',
            'UnauthorizedError': '401',
            'ForbiddenError': '403'
        };
        return statusMap[exception] || '500';
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
        return `python_parse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateSpecId() {
        return `python_spec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
    validateDocstringFormat(ast, violations) {
        if (!ast.metadata) {
            violations.push({
                rule: 'docstring-format',
                message: 'Missing metadata in Python docstring AST',
                severity: 'error'
            });
        }
        if (ast.endpoints && Array.isArray(ast.endpoints)) {
            ast.endpoints.forEach((endpoint, index) => {
                if (!endpoint.summary && !endpoint.description) {
                    violations.push({
                        rule: 'docstring-format',
                        message: `Function at index ${index} missing docstring`,
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
    validateTypeAnnotations(ast, violations) {
        if (ast.schemas && Array.isArray(ast.schemas)) {
            ast.schemas.forEach((schema) => {
                if (!schema.schema || !schema.schema.properties) {
                    violations.push({
                        rule: 'type-annotations',
                        message: `Class '${schema.name}' should have documented attributes`,
                        severity: 'warning'
                    });
                }
            });
        }
    }
}
exports.PythonParser = PythonParser;
exports.default = PythonParser;
//# sourceMappingURL=python-parser.js.map